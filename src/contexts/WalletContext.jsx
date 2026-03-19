import { createContext, useContext, useState, useEffect } from "react";

const WalletContext = createContext(null);

// X Layer chain id
const XLAYER_CHAIN_ID = "0xc4"; // 196 in hex

export function WalletProvider({ children }) {
  const [address, setAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  // Prefer OKX Wallet, fallback to MetaMask
  const getProvider = () => window.okxwallet || window.ethereum || null;

  useEffect(() => {
    const provider = getProvider();
    if (!provider) return;
    provider.request({ method: "eth_accounts" }).then((accounts) => {
      if (accounts[0]) { setAddress(accounts[0]); setIsConnected(true); }
    });
    const handleChange = (accounts) => {
      if (accounts[0]) { setAddress(accounts[0]); setIsConnected(true); }
      else { setAddress(null); setIsConnected(false); }
    };
    provider.on?.("accountsChanged", handleChange);
    return () => provider.removeListener?.("accountsChanged", handleChange);
  }, []);

  const connect = async () => {
    setError(null);
    const provider = getProvider();
    if (!provider) { setError("no_wallet"); return; }
    try {
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      setAddress(accounts[0]);
      setIsConnected(true);
      // Switch to X Layer
      try {
        await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: XLAYER_CHAIN_ID }] });
      } catch (switchErr) {
        if (switchErr.code === 4902) {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: XLAYER_CHAIN_ID,
              chainName: "X Layer",
              nativeCurrency: { name: "OKB", symbol: "OKB", decimals: 18 },
              rpcUrls: ["https://rpc.xlayer.tech"],
              blockExplorerUrls: ["https://www.okx.com/explorer/xlayer"],
            }],
          });
        }
      }
    } catch (e) {
      setError(e.message || "connect_failed");
    }
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
  };

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null;

  return (
    <WalletContext.Provider value={{ address, isConnected, connect, disconnect, shortAddress }}>
      {children}
      {error === "no_wallet" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 max-w-sm w-full">
            <div className="text-lg font-semibold text-white mb-2">Wallet Not Detected</div>
            <p className="text-sm text-[#666] mb-5">Install OKX Wallet for the best experience on X Layer.</p>
            <div className="flex gap-3">
              <a href="https://www.okx.com/web3/wallet/download" target="_blank" rel="noopener noreferrer"
                className="flex-1 py-3 text-center text-sm font-bold text-white rounded-xl hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#FF6B00,#FF9A00)" }}
                onClick={() => setError(null)}>
                Get OKX Wallet
              </a>
              <button onClick={() => setError(null)}
                className="flex-1 py-3 text-sm text-[#666] border border-[#2a2a2a] rounded-xl hover:text-white transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
