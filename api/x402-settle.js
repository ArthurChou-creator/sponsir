import { okxHeaders, OKX_BASE } from './_okxAuth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const path = '/api/v6/x402/settle';
  const body = JSON.stringify(req.body);
  const headers = okxHeaders('POST', path, body);

  const upstream = await fetch(OKX_BASE + path, { method: 'POST', headers, body });
  const data = await upstream.json();
  res.status(200).json(data);
}
