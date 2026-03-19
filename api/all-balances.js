import { okxHeaders, OKX_BASE } from './_okxAuth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { address, chains } = req.query;
  const path = `/api/v6/dex/balance/all-token-balances-by-address?address=${address}&chains=${chains}`;
  const headers = okxHeaders('GET', path);

  const upstream = await fetch(OKX_BASE + path, { method: 'GET', headers });
  const data = await upstream.json();
  res.status(200).json(data);
}
