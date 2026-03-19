/**
 * OKX Onchain OS — Balance API + Transaction History API
 * API calls are proxied through Vercel serverless functions (keys never exposed to client)
 */

const X_LAYER = '196';
const USDG_ADDRESS = '0x4ae46a509f6b1d9056937ba4500cb143933d2dc8';

// ─── Balance API ──────────────────────────────────────────────────────────────

export async function getUSDGBalance(address) {
  const res = await fetch('/api/balance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address,
      tokenContractAddresses: [
        { chainIndex: X_LAYER, tokenContractAddress: USDG_ADDRESS },
      ],
    }),
  });
  const data = await res.json();
  if (data.code !== '0') throw new Error(`Balance API error: ${data.msg}`);

  const asset = data.data?.[0]?.tokenAssets?.[0];
  return {
    balance:    parseFloat(asset?.balance || '0'),
    rawBalance: asset?.rawBalance || '0',
    price:      asset?.tokenPrice || '1',
  };
}

export async function getAllBalances(address) {
  const res = await fetch(`/api/all-balances?address=${address}&chains=${X_LAYER}`);
  const data = await res.json();
  if (data.code !== '0') throw new Error(`Balance API error: ${data.msg}`);
  return data.data?.[0]?.tokenAssets || [];
}

// ─── Transaction History API ──────────────────────────────────────────────────

export async function getTransactionHistory(address, limit = 50) {
  const res = await fetch(`/api/transactions?address=${address}&chains=${X_LAYER}&limit=${limit}`);
  const data = await res.json();
  if (data.code !== '0') throw new Error(`Transaction History API error: ${data.msg}`);
  return data.data?.[0]?.transactionList || [];
}

// ─── Credibility Score ────────────────────────────────────────────────────────

export async function getCredibilityScore(address) {
  try {
    const [txs, balances] = await Promise.all([
      getTransactionHistory(address, 100),
      getAllBalances(address),
    ]);

    const txCount = txs.length;
    const txScore = Math.min(txCount / 100 * 40, 40);

    let ageScore = 0;
    if (txs.length > 0) {
      const oldest = Math.min(...txs.map(t => parseInt(t.txTime || Date.now())));
      const ageMs = Date.now() - oldest;
      const ageDays = ageMs / (1000 * 60 * 60 * 24);
      ageScore = Math.min(ageDays / 365 * 35, 35);
    }

    const totalValue = balances.reduce((sum, a) => {
      return sum + (parseFloat(a.balance || 0) * parseFloat(a.tokenPrice || 0));
    }, 0);
    const assetScore = Math.min(totalValue / 1000 * 25, 25);

    const total = Math.round(txScore + ageScore + assetScore);
    return {
      score: Math.max(total, 5),
      txCount,
      ageScore: Math.round(ageScore),
      assetScore: Math.round(assetScore),
    };
  } catch {
    return { score: 0, txCount: 0, ageScore: 0, assetScore: 0 };
  }
}
