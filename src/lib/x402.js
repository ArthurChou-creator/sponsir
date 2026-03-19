/**
 * OKX x402 Payment Integration
 * Agentic, gas-free USDG payments on X Layer via OKX Facilitator
 */

const API_KEY    = import.meta.env.VITE_OKX_API_KEY;
const SECRET_KEY = import.meta.env.VITE_OKX_SECRET_KEY;
const PASSPHRASE = import.meta.env.VITE_OKX_PASSPHRASE;

// Proxy path (defined in vite.config.js) → https://web3.okx.com
const BASE = '/okx-api';

// X Layer supported assets
export const USDG_ADDRESS = '0x4ae46a509f6b1d9056937ba4500cb143933d2dc8';
export const USDT_ADDRESS = '0x779ded0c9e1022225f8e0630b35a9b54be713736';
export const X402_CHAIN   = '196';

// ─── OKX API Auth ────────────────────────────────────────────────────────────

async function hmacSha256Base64(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

async function okxHeaders(method, path, body = '') {
  const timestamp = new Date().toISOString();
  const signature = await hmacSha256Base64(SECRET_KEY, timestamp + method + path + body);
  return {
    'Content-Type': 'application/json',
    'OK-ACCESS-KEY': API_KEY,
    'OK-ACCESS-SIGN': signature,
    'OK-ACCESS-PASSPHRASE': PASSPHRASE,
    'OK-ACCESS-TIMESTAMP': timestamp,
  };
}

// ─── EIP-3009 TransferWithAuthorization ──────────────────────────────────────

/**
 * Signs an EIP-3009 TransferWithAuthorization using the connected wallet.
 * This lets OKX Facilitator execute a gas-free token transfer on behalf of the user.
 */
export async function signTransferAuthorization({ from, to, value, assetAddress, tokenName }) {
  const provider = window.okxwallet || window.ethereum;
  if (!provider) throw new Error('No wallet detected');

  const validAfter  = '0';
  const validBefore = String(Math.floor(Date.now() / 1000) + 3600); // valid 1hr
  const nonce = '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0')).join('');

  const typedData = {
    types: {
      EIP712Domain: [
        { name: 'name',              type: 'string'  },
        { name: 'version',           type: 'string'  },
        { name: 'chainId',           type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      TransferWithAuthorization: [
        { name: 'from',        type: 'address' },
        { name: 'to',          type: 'address' },
        { name: 'value',       type: 'uint256' },
        { name: 'validAfter',  type: 'uint256' },
        { name: 'validBefore', type: 'uint256' },
        { name: 'nonce',       type: 'bytes32' },
      ],
    },
    domain: {
      name:              tokenName || 'USDG',
      version:           '1',
      chainId:           196,
      verifyingContract: assetAddress,
    },
    primaryType: 'TransferWithAuthorization',
    message: {
      from,
      to,
      value:       String(value),
      validAfter,
      validBefore,
      nonce,
    },
  };

  const signature = await provider.request({
    method: 'eth_signTypedData_v4',
    params: [from, JSON.stringify(typedData)],
  });

  return {
    signature,
    authorization: { from, to, value: String(value), validAfter, validBefore, nonce },
  };
}

// ─── x402 Settle ─────────────────────────────────────────────────────────────

/**
 * Execute a gas-free x402 payment via OKX Facilitator on X Layer.
 * @param {object} params
 * @param {string} params.from        - Payer wallet address
 * @param {string} params.to          - Payee address (our contract / treasury)
 * @param {number} params.amountUnits - Amount in token's smallest unit (e.g. 1e18 for 1 USDG)
 * @param {string} params.assetAddress
 * @param {string} params.tokenName
 * @returns {{ txHash, payer }}
 */
export async function settleX402({ from, to, amountUnits, assetAddress, tokenName }) {
  const path = '/api/v6/x402/settle';

  const { signature, authorization } = await signTransferAuthorization({
    from, to,
    value: amountUnits,
    assetAddress,
    tokenName,
  });

  const paymentPayload = {
    x402Version: '1',
    scheme: 'exact',
    payload: { signature, authorization },
  };

  const paymentRequirements = {
    scheme:            'exact',
    chainIndex:        X402_CHAIN,
    maxAmountRequired: String(amountUnits),
    payTo:             to,
    asset:             assetAddress,
  };

  const body = JSON.stringify({
    x402Version:         '1',
    chainIndex:          X402_CHAIN,
    paymentPayload,
    paymentRequirements,
  });

  const headers = await okxHeaders('POST', path, body);
  const res = await fetch(BASE + path, { method: 'POST', headers, body });
  const data = await res.json();

  if (data.code !== '0') throw new Error(`x402 settle error [${data.code}]: ${data.msg}`);
  const result = data.data?.[0];
  if (!result?.success) throw new Error(`x402 settlement failed: ${result?.errorMsg || JSON.stringify(result)}`);

  return { txHash: result.txHash, payer: result.payer };
}

// ─── x402 Verify ─────────────────────────────────────────────────────────────

/**
 * Verify an x402 payment was valid and settled.
 */
export async function verifyX402({ paymentPayload, paymentRequirements }) {
  const path = '/api/v6/x402/verify';
  const body = JSON.stringify({
    x402Version: '1',
    chainIndex:  X402_CHAIN,
    paymentPayload,
    paymentRequirements,
  });

  const headers = await okxHeaders('POST', path, body);
  const res = await fetch(BASE + path, { method: 'POST', headers, body });
  const data = await res.json();

  if (data.code !== '0') throw new Error(`x402 verify error: ${data.msg}`);
  return data.data?.[0]; // { isValid, payer, invalidReason }
}

// ─── Convenience wrapper ──────────────────────────────────────────────────────

/**
 * Full x402 agentic payment: sign → settle → verify
 * Uses USDG on X Layer. Amount in USD (e.g. 1 = $1).
 */
export async function agentPayX402({ from, payTo, amountUSD }) {
  // USDG has 6 decimals (same as USDC) — $1 = 1,000,000 units
  const amountUnits = BigInt(amountUSD) * BigInt('1000000');

  const { txHash, payer } = await settleX402({
    from,
    to:           payTo,
    amountUnits,
    assetAddress: USDG_ADDRESS,
    tokenName:    'Global Dollar', // EIP-712 domain name from USDG contract
  });

  return {
    txHash,
    payer,
    explorerUrl: `https://www.okx.com/explorer/xlayer/tx/${txHash}`,
    protocol:    'x402',
    asset:       'USDG',
    network:     'X Layer',
  };
}
