import { Link } from "react-router-dom";
import { useEvents } from "../contexts/OrganizerContext";

const STATS = [
  { label: "Events Listed", value: "240+" },
  { label: "Sponsors Active", value: "80+" },
  { label: "X Layer TXs", value: "1,200+" },
  { label: "Total Sponsored", value: "$2.4M+" },
];

const STEPS = [
  {
    n: "01",
    title: "Discovery Agent",
    desc: "Scans 200+ global crypto and AI conferences. Scores each by audience fit, chain activity, and past sponsor ROI.",
  },
  {
    n: "02",
    title: "Evaluation Agent",
    desc: "Reads onchain credibility, compares packages, cross-references sponsor history. Outputs ranked recommendations tailored to your goals.",
  },
  {
    n: "03",
    title: "Payment Agent",
    desc: "Reserves and settles on X Layer via x402 Protocol. No emails, no wires — a tx hash is your receipt.",
  },
];

export default function Home() {
  const { publishedEvents } = useEvents();
  const featured = publishedEvents.slice(0, 3);

  return (
    <div className="bg-[#0c0a09] text-white">

      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">

        {/* Background event photo */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover opacity-[0.22]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c0a09]/70 via-[#0c0a09]/50 to-[#0c0a09]" />
        </div>

        {/* Warm grid overlay */}
        <div className="absolute inset-0 grid-bg z-[1] pointer-events-none" />

        {/* Orange center glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] pointer-events-none z-[1]"
          style={{ background: "radial-gradient(ellipse, rgba(255,107,0,0.07) 0%, transparent 65%)" }}
        />

        {/* Geometric vertical accent — right side */}
        <div className="absolute right-[7%] top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-0 z-10 opacity-60">
          <div className="w-px h-28 bg-gradient-to-b from-transparent to-[#FF6B00]/50" />
          <div className="my-5 flex flex-col items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-[#FF6B00]" />
            <div className="w-px h-3 bg-[#FF6B00]/40" />
            <div className="w-1 h-1 rounded-full bg-[#FF6B00]/50" />
          </div>
          <div className="w-px h-28 bg-gradient-to-b from-[#FF6B00]/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pt-32 pb-24">

          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 border border-[#FF6B00]/20 rounded-full px-4 py-1.5 mb-10 bg-[#FF6B00]/5 fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full agent-pulse" style={{ background: "#FF6B00" }} />
            <span className="text-[11px] text-[#FF6B00]/80 tracking-[0.15em] uppercase font-medium">
              AI Agents · Live on X Layer
            </span>
          </div>

          {/* Title */}
          <h1 className="text-[58px] sm:text-[80px] lg:text-[100px] font-black leading-[0.9] tracking-[-0.03em] mb-8 fade-in-up-delay-1">
            <span className="block text-white">Sponsor</span>
            <span className="block gradient-text">Smarter.</span>
          </h1>

          {/* Subtext */}
          <p className="text-[#777] text-lg sm:text-xl max-w-xl leading-relaxed mb-10 fade-in-up-delay-2">
            AI agents discover, evaluate, reserve, and pay for crypto & AI event sponsorships — fully onchain on X Layer.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 fade-in-up-delay-3">
            <Link
              to="/events"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Explore Events
            </Link>
            <Link
              to="/agent"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 border border-[#FF6B00]/30 text-white text-sm font-semibold rounded-xl hover:bg-[#FF6B00]/5 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] agent-pulse" />
              Run AI Agent
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-[#1e1c1a]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-7 grid grid-cols-2 md:grid-cols-4 divide-x divide-[#1e1c1a]">
          {STATS.map((s) => (
            <div key={s.label} className="text-center px-6">
              <div className="font-display text-[30px] font-black tracking-tight">{s.value}</div>
              <div className="text-[11px] text-[#555] mt-1 tracking-wide uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Events ── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-[11px] text-[#FF6B00] tracking-[0.2em] uppercase font-medium mb-3">Featured</div>
            <h2 className="font-display text-3xl font-black tracking-tight">Upcoming Events</h2>
            <p className="text-[#555] text-sm mt-1.5">Ranked by AI Match Score · {publishedEvents.length} events live</p>
          </div>
          <Link to="/events" className="text-sm text-[#FF6B00] hover:underline hidden sm:block">
            View all →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {featured.map((e) => (
            <Link key={e.id} to={`/events/${e.id}`} className="group card-hover block">
              <div className="bg-[#100e0c] border border-[#1e1c1a] rounded-2xl overflow-hidden group-hover:border-[#2e2a27] transition-colors">
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={e.image}
                    alt={e.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#100e0c] via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[10px] font-semibold text-[#FF6B00] bg-black/70 border border-[#FF6B00]/30 px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {e.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="text-xs font-black text-[#00C076] bg-black/70 px-2.5 py-1 rounded-full backdrop-blur-sm font-mono-custom">
                      {e.score}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-white font-semibold text-sm leading-snug mb-3 group-hover:text-[#ccc] transition-colors">
                    {e.title}
                  </h3>
                  <div className="space-y-1 text-[11px] text-[#555] mb-4">
                    <div>📅 {e.date || "TBA"}</div>
                    <div>📍 {e.location?.name?.split(",")[0] || "TBA"}</div>
                    <div>👥 {e.audience || "TBA"}</div>
                  </div>
                  <div className="pt-4 border-t border-[#1a1815] flex justify-between items-center">
                    <div>
                      <span className="text-[#555] text-xs">from </span>
                      <span className="text-white font-bold font-mono-custom">$1</span>
                      <span className="text-[#555] text-xs ml-1">USDC</span>
                    </div>
                    <span className="text-[11px] text-[#444]">{e.sponsorship_plans?.length || 0} pkgs</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link to="/events" className="text-sm text-[#FF6B00] hover:underline">View all events →</Link>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-t border-[#1e1c1a] bg-[#0f0d0b]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-24">
          <div className="mb-16">
            <div className="text-[11px] text-[#FF6B00] tracking-[0.2em] uppercase font-medium mb-3">Architecture</div>
            <h2 className="font-display text-3xl font-black tracking-tight">Multi-Agent System</h2>
            <p className="text-[#555] text-sm mt-1.5">Three specialized agents. One onchain outcome.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 relative">
            {/* Connecting line between step dots */}
            <div className="hidden md:block absolute top-[84px] left-[calc(33.33%+12px)] right-[calc(33.33%+12px)] h-px bg-gradient-to-r from-[#FF6B00]/30 via-[#FF6B00]/50 to-[#FF6B00]/30" />

            {STEPS.map((s) => (
              <div key={s.n}>
                <div className="font-display text-[72px] font-black text-[#FF6B00]/08 leading-none mb-4 select-none"
                  style={{ color: "rgba(255,107,0,0.08)" }}>
                  {s.n}
                </div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#FF6B00] shrink-0" />
                  <h3 className="text-white font-semibold">{s.title}</h3>
                </div>
                <p className="text-[#555] text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-24">
        <div className="relative overflow-hidden bg-[#100e0c] border border-[#1e1c1a] rounded-3xl p-12 sm:p-16 text-center orange-glow">
          {/* Background event photo */}
          <div className="absolute inset-0 z-0 rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80"
              alt=""
              className="w-full h-full object-cover opacity-[0.08]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#100e0c]/80 to-transparent" />
          </div>

          <div className="relative z-10">
            <div className="text-[11px] font-medium text-[#FF6B00] tracking-[0.2em] uppercase mb-5">
              Powered by X Layer · OKX Onchain OS
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight mb-5">
              Let agents do the work.
            </h2>
            <p className="text-[#666] max-w-md mx-auto text-sm leading-relaxed mb-8">
              Connect your OKX Wallet, define your goals, and let Sponsir agents autonomously discover and close sponsorship deals onchain.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/agent"
                className="px-8 py-4 text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg,#FF6B00,#FF9A00)" }}
              >
                Run Agent Demo
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 border border-[#2a2826] text-white text-sm font-semibold rounded-xl hover:bg-[#1a1815] transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
