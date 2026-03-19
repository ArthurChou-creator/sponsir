import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirm) { setError("All fields are required"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setError(""); setLoading(true);
    try {
      await register(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#333] outline-none focus:border-white transition-colors";

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2.5 mb-6">
            <svg width="32" height="32" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#FF6B00" strokeWidth="1.5" />
              <polygon points="14,7 21,11 21,17 14,21 7,17 7,11" fill="#FF6B00" fillOpacity="0.15" stroke="#FF9A00" strokeWidth="1" />
              <circle cx="14" cy="14" r="2.5" fill="#FF6B00" />
            </svg>
            <span className="font-display text-white font-black text-xl tracking-tight">Sponsir</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Create account</h1>
          <p className="text-[#444] text-sm mt-1">
            Already have one?{" "}
            <Link to="/login" className="text-white hover:underline">Sign in</Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-[#555] block mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" autoComplete="email" className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-[#555] block mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters" autoComplete="new-password" className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-[#555] block mb-1.5">Confirm Password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••" autoComplete="new-password" className={inputClass} />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button type="submit" disabled={loading}
            className={`w-full py-3.5 bg-white text-black text-sm font-bold rounded-xl transition-all mt-2 ${loading ? "opacity-40" : "hover:bg-gray-100"}`}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-xs text-[#444] text-center">
          By signing up you agree to our{" "}
          <a href="#" className="text-[#666] hover:text-white">Terms of Service</a>
        </p>
      </div>
    </div>
  );
}
