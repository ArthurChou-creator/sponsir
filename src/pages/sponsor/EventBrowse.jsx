import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useEvents } from "../../contexts/OrganizerContext";

const CATEGORIES = ["All", "Crypto", "DeFi", "X Layer", "NFT", "Gaming"];

export default function EventBrowse() {
  const { publishedEvents } = useEvents();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    let result = publishedEvents;
    if (category !== "All") result = result.filter((e) => e.category === category);
    if (search.trim()) {
      const words = search.toLowerCase().split(/\s+/);
      result = result.filter((e) =>
        words.some((w) =>
          e.title.toLowerCase().includes(w) ||
          (e.tags || []).some((t) => t.includes(w)) ||
          e.location?.name?.toLowerCase().includes(w) ||
          e.category?.toLowerCase().includes(w)
        )
      );
    }
    return result;
  }, [search, category, publishedEvents]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-[#1e1e1e] bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Explore Events</h1>
          <p className="text-[#555] text-sm mb-8">Find the right crypto conference to sponsor · {publishedEvents.length} events live</p>
          <div className="flex gap-3 max-w-2xl mb-5">
            <div className="flex-1 flex items-center bg-[#111] border border-[#2a2a2a] rounded-xl px-4 gap-3 focus-within:border-white transition-colors">
              <svg className="w-4 h-4 text-[#444] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events, locations, categories..."
                className="flex-1 bg-transparent py-3 text-sm text-white placeholder-[#333] outline-none" />
            </div>
            <button className="px-5 py-3 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors">Search</button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  category === c ? "bg-white text-black border-white" : "border-[#2a2a2a] text-[#555] hover:text-white hover:border-[#444]"
                }`}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-[#444]">No events found.</div>
        ) : (
          <>
            <p className="text-[#444] text-sm mb-6">{filtered.length} events</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((e) => (
                <Link key={e.id} to={`/events/${e.id}`}>
                  <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl overflow-hidden hover:border-[#333] transition-all group h-full flex flex-col">
                    <div className="h-44 overflow-hidden bg-[#111]">
                      <img src={e.image} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-semibold text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/20 px-2.5 py-1 rounded-full">{e.category}</span>
                        <div className="flex items-center gap-1"><span className="text-[10px] text-[#444]">AI</span><span className="text-sm font-bold text-[#00C076]">{e.score}</span></div>
                      </div>
                      <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-[#ccc] transition-colors flex-1">{e.title}</h3>
                      <div className="mt-3 space-y-1 text-[11px] text-[#444]">
                        <div>📅 {e.date || (e.start_time ? new Date(e.start_time).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : "TBA")}</div>
                        <div>📍 {e.location?.name || "TBA"}</div>
                        <div>👥 {e.audience || "TBA"}</div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-[#1a1a1a] flex justify-between items-center">
                        <div><span className="text-[#444] text-xs">from </span><span className="text-white font-bold">$1</span><span className="text-[#444] text-xs ml-1">USDC</span></div>
                        <span className="text-[11px] text-[#444]">{e.sponsorship_plans?.length || 0} pkgs</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
