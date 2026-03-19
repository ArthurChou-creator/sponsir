import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useWallet } from "../../contexts/WalletContext";
import { useCart } from "../../contexts/CartContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { address, isConnected, connect, disconnect } = useWallet();
  const { purchases } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate("/login"); };

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null;
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: "/events", label: "Events" },
    { to: "/agent", label: "AI Agent" },
    ...(isAuthenticated ? [
      { to: "/cart", label: "Cart" },
      { to: "/create-event", label: "List Event" },
      { to: "/manage-events", label: "Manage" },
    ] : []),
    ...(purchases.length > 0 ? [{ to: "/my-sponsorships", label: "My Sponsorships" }] : []),
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0c0a09]/95 backdrop-blur-md border-b border-[#1e1c1a]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex justify-between h-[60px] items-center">

          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5">
              {/* Geometric logo mark */}
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#FF6B00" strokeWidth="1.5" />
                <polygon points="14,7 21,11 21,17 14,21 7,17 7,11" fill="#FF6B00" fillOpacity="0.15" stroke="#FF9A00" strokeWidth="1" />
                <circle cx="14" cy="14" r="2.5" fill="#FF6B00" />
              </svg>
              <span className="font-display text-white font-black text-[18px] tracking-tight">Sponsir</span>
              <span className="hidden sm:block text-[10px] font-medium px-1.5 py-0.5 rounded border border-[#FF6B00]/40 text-[#FF6B00]">
                X Layer
              </span>
            </Link>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`text-sm font-medium transition-colors ${
                    isActive(to) ? "text-white" : "text-[#666] hover:text-white"
                  }`}
                >
                  {label}
                  {isActive(to) && (
                    <div className="h-0.5 mt-0.5 rounded-full" style={{ background: 'linear-gradient(135deg, #FF6B00, #FF9A00)' }} />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-3">
            {/* Wallet */}
            {isConnected ? (
              <button
                onClick={() => disconnect()}
                className="flex items-center gap-2 px-3.5 py-2 bg-[#111] border border-[#2a2a2a] rounded-xl text-sm font-medium text-white hover:border-[#FF6B00]/50 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C076]"></span>
                <span className="font-mono text-xs">{shortAddress}</span>
              </button>
            ) : (
              <button
                onClick={connect}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #FF6B00, #FF9A00)' }}
              >
                Connect Wallet
              </button>
            )}

            {/* Auth */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-[#666] hover:text-white border border-[#1e1e1e] rounded-xl transition-colors"
              >
                Logout
              </button>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-[#999] hover:text-white border border-[#1e1e1e] rounded-xl transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-semibold text-black bg-white rounded-xl hover:bg-gray-100 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-[#666] hover:text-white p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0a0a0a] border-t border-[#1e1e1e] px-5 py-4 space-y-3">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-sm text-[#888] hover:text-white">
              {label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#1e1e1e]">
            {isConnected ? (
              <button onClick={() => { disconnect(); setIsMenuOpen(false); }}
                className="w-full py-2.5 text-sm text-[#00C076] border border-[#00C076]/20 rounded-xl">
                {shortAddress} — Disconnect
              </button>
            ) : (
              <button onClick={() => { connect(); setIsMenuOpen(false); }}
                className="w-full py-2.5 text-sm font-semibold text-white rounded-xl"
                style={{ background: 'linear-gradient(135deg, #FF6B00, #FF9A00)' }}>
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
