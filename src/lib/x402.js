/**
 * OKX x402 Payment Integration
 * Signing happens client-side (wallet); API calls proxied through Vercel (keys hidden)
 */

export const USDG_ADDRESS = '0x4ae46a509f6b1d9056937ba4500cb143933d2dc8';
export const USDT_ADDRESS = '0x779ded0c9e1022225f8e0630b35a9b54be713736';
export const X402_CHAIN   = '196';

// ─── EIP-3009 TransferWithAuthorization ──────────────────────────────────────

export async function signTransferAuthorization({ from, to, value, assetAddress, tokenName }) {
  const provider = window.okxwallet || window.ethereum;
  if (!provider) throw new Error('No wallet detected');

  const validAfter  = '0';
  const validBefore = String(Math.floor(Date.now() / 1000) + 3600);
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

// ─── x402 Settle (via server proxy) ──────────────────────────────────────────

export async function settleX402({ from, to, amountUnits, assetAddress, tokenName }) {
  const { signature, authorization } = await signTransferAuthorization({
    from, to, value: amountUnits, assetAddress, tokenName,
  });

  const body = {
    x402Version: '1',
    chainIndex:  X402_CHAIN,
    paymentPayload: {
      x402Version: '1',
      scheme: 'exact',
      payload: { signature, authorization },
    },
    paymentRequirements: {
      scheme:            'exact',
      chainIndex:        X402_CHAIN,
      maxAmountRequired: String(amountUnits),
      payTo:             to,
      asset:             assetAddress,
    },
  };

  const res = await fetch('/api/x402-settle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();

  if (data.code !== '0') throw new Error(`x402 settle error [${data.code}]: ${data.msg}`);
  const result = data.data?.[0];
  if (!result?.success) throw new Error(`x402 settlement failed: ${result?.errorMsg || JSON.stringify(result)}`);

  return { txHash: result.txHash, payer: result.payer };
}

// ─── x402 Verify (via server proxy) ──────────────────────────────────────────

export async function verifyX402({ paymentPayload, paymentRequirements }) {
  const res = await fetch('/api/x402-verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ x402Version: '1', chainIndex: X402_CHAIN, paymentPayload, paymentRequirements }),
  });
  const data = await res.json();
  if (data.code !== '0') throw new Error(`x402 verify error: ${data.msg}`);
  return data.data?.[0];
}

// ─── Convenience wrapper ──────────────────────────────────────────────────────

export async function agentPayX402({ from, payTo, amountUSD }) {
  const amountUnits = BigInt(amountUSD) * BigInt('1000000');

  const { txHash, payer } = await settleX402({
    from,
    to:           payTo,
    amountUnits,
    assetAddress: USDG_ADDRESS,
    tokenName:    'Global Dollar',
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
