import { useState, useEffect } from 'react';
import { getUSDGBalance } from '../lib/onchainOS';

/**
 * Hook: fetch USDG balance whenever wallet address changes
 */
export function useWalletBalance(address) {
  const [balance, setBalance] = useState(null); // null = loading
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!address) { setBalance(null); return; }
    let cancelled = false;
    getUSDGBalance(address)
      .then((b) => { if (!cancelled) setBalance(b.balance); })
      .catch((e) => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
  }, [address]);

  const isReady    = balance !== null;
  const hasEnough  = (required) => isReady && balance >= required;
  const canSponsor = (price) => hasEnough(price);

  return { balance, isReady, hasEnough, canSponsor, error };
}
