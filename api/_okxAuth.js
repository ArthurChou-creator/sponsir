import crypto from 'crypto';

const API_KEY    = process.env.OKX_API_KEY;
const SECRET_KEY = process.env.OKX_SECRET_KEY;
const PASSPHRASE = process.env.OKX_PASSPHRASE;

export function okxHeaders(method, path, body = '') {
  const timestamp = new Date().toISOString();
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(timestamp + method + path + body)
    .digest('base64');

  return {
    'Content-Type': 'application/json',
    'OK-ACCESS-KEY': API_KEY,
    'OK-ACCESS-SIGN': signature,
    'OK-ACCESS-PASSPHRASE': PASSPHRASE,
    'OK-ACCESS-TIMESTAMP': timestamp,
  };
}

export const OKX_BASE = 'https://web3.okx.com';
