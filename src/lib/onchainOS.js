/**
 * OKX Onchain OS — Balance API + Transaction History API
 */

const API_KEY    = import.meta.env.VITE_OKX_API_KEY;
const SECRET_KEY = import.meta.env.VITE_OKX_SECRET_KEY;
const PASSPHRASE = import.meta.env.VITE_OKX_PASSPHRASE;

const BASE = '/okx-api';
const X_LAYER = '196';

// USDG on X Layer
const USDG_ADDRESS = '0x4ae46a509f6b1d9056937ba4500cb143933d2dc8';

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

// ─── Balance API ──────────────────────────────────────────────────────────────

/**
 * Get USDG balance for a wallet on X Layer
 * @returns {{ balance: number, rawBalance: string, price: string }}
 */
export async function getUSDGBalance(address) {
  const path = '/api/v6/dex/balance/token-balances-by-address';
  const body = JSON.stringify({
    address,
    tokenContractAddresses: [
      { chainIndex: X_LAYER, tokenContractAddress: USDG_ADDRESS },
    ],
  });
  const headers = await okxHeaders('POST', path, body);
  const res = await fetch(BASE + path, { method: 'POST', headers, body });
  const data = await res.json();
  if (data.code !== '0') throw new Error(`Balance API error: ${data.msg}`);

  const asset = data.data?.[0]?.tokenAssets?.[0];
  return {
    balance:    parseFloat(asset?.balance || '0'),
    rawBalance: asset?.rawBalance || '0',
    price:      asset?.tokenPrice || '1',
  };
}

/**
 * Get all token balances for a wallet on X Layer
 * @returns {Array} tokenAssets
 */
export async function getAllBalances(address) {
  const path = `/api/v6/dex/balance/all-token-balances-by-address?address=${address}&chains=${X_LAYER}`;
  const headers = await okxHeaders('GET', path);
  const res = await fetch(BASE + path, { method: 'GET', headers });
  const data = await res.json();
  if (data.code !== '0') throw new Error(`Balance API error: ${data.msg}`);
  return data.data?.[0]?.tokenAssets || [];
}

// ─── Transaction History API ──────────────────────────────────────────────────

/**
 * Get transaction history for a wallet on X Layer
 * @returns {Array} transactions
 */
export async function getTransactionHistory(address, limit = 50) {
  const path = `/api/v6/dex/post-transaction/transactions-by-address?address=${address}&chains=${X_LAYER}&limit=${limit}`;
  const headers = await okxHeaders('GET', path);
  const res = await fetch(BASE + path, { method: 'GET', headers });
  const data = await res.json();
  if (data.code !== '0') throw new Error(`Transaction History API error: ${data.msg}`);
  return data.data?.[0]?.transactionList || [];
}

// ─── Credibility Score ────────────────────────────────────────────────────────

/**
 * Calculate an Onchain Credibility Score (0–100) for a wallet
 * Based on: transaction count, wallet age, asset holdings
 */
export async function getCredibilityScore(address) {
  try {
    const [txs, balances] = await Promise.all([
      getTransactionHistory(address, 100),
      getAllBalances(address),
    ]);

    // 1. Transaction count (0–40 pts)
    const txCount = txs.length;
    const txScore = Math.min(txCount / 100 * 40, 40);

    // 2. Wallet age from oldest tx (0–35 pts)
    let ageScore = 0;
    if (txs.length > 0) {
      const oldest = Math.min(...txs.map(t => parseInt(t.txTime || Date.now())));
      const ageMs = Date.now() - oldest;
      const ageDays = ageMs / (1000 * 60 * 60 * 24);
      ageScore = Math.min(ageDays / 365 * 35, 35);
    }

    // 3. Has stablecoins / assets (0–25 pts)
    const totalValue = balances.reduce((sum, a) => {
      return sum + (parseFloat(a.balance || 0) * parseFloat(a.tokenPrice || 0));
    }, 0);
    const assetScore = Math.min(totalValue / 1000 * 25, 25);

    const total = Math.round(txScore + ageScore + assetScore);
    return {
      score: Math.max(total, 5), // min 5 to avoid showing 0
      txCount,
      ageScore: Math.round(ageScore),
      assetScore: Math.round(assetScore),
    };
  } catch {
    return { score: 0, txCount: 0, ageScore: 0, assetScore: 0 };
  }
}
