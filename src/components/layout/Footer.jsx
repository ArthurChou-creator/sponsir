import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-[#1e1c1a] bg-[#0c0a09]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#FF6B00" strokeWidth="1.5" />
              <polygon points="14,7 21,11 21,17 14,21 7,17 7,11" fill="#FF6B00" fillOpacity="0.15" stroke="#FF9A00" strokeWidth="1" />
              <circle cx="14" cy="14" r="2.5" fill="#FF6B00" />
            </svg>
            <span className="font-display font-black text-white tracking-tight">Sponsir</span>
            <span className="text-[10px] text-[#444] border border-[#1e1c1a] rounded px-1.5 py-0.5">X Layer</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-xs text-[#444]">
            <Link to="/events" className="hover:text-white transition-colors">Events</Link>
            <Link to="/agent" className="hover:text-white transition-colors">AI Agent</Link>
            <Link to="/create-event" className="hover:text-white transition-colors">List Event</Link>
            <a
              href="https://www.okx.com/explorer/xlayer"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              X Layer Explorer
            </a>
          </div>

          {/* Copyright */}
          <div className="text-[11px] text-[#333]">
            © 2026 Sponsir. Built on X Layer.
          </div>
        </div>
      </div>
    </footer>
  );
}
