import { useState } from "react";
import { Link } from "react-router-dom";
import { useWallet } from "../contexts/WalletContext";
import { useWalletBalance } from "../hooks/useWalletBalance";
import { scoreEvents } from "../data/events";
import { useCart } from "../contexts/CartContext";
import { useEvents } from "../contexts/OrganizerContext";
import { recordSponsorship, CONTRACT_ADDRESS } from "../lib/contract";
import { agentPayX402 } from "../lib/x402";
import { getCredibilityScore } from "../lib/onchainOS";

async function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

export default function AgentPage() {
  const { isConnected, connect, shortAddress, address } = useWallet();
  const { balance, isReady } = useWalletBalance(address);
  const { addToCart, recordPurchases } = useCart();
  const { getEventById } = useEvents();
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState(null); // null|discover|evaluate|confirm|pay|done
  const [log, setLog] = useState([]);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [txMeta, setTxMeta] = useState(null); // { protocol, asset, network }
  const [paying, setPaying] = useState(false);

  const addLog = (msg) => setLog((p) => [...p, { t: new Date().toISOString().slice(11, 19), msg }]);

  const runDiscovery = async () => {
    if (!query.trim()) return;
    setPhase("discover"); setResults([]); setSelected(null); setSelectedPlan(null); setTxHash(null); setLog([]);

    addLog(`Discovery Agent: received query — "${query}"`);
    await sleep(800);
    addLog("Discovery Agent: scanning 200+ crypto events globally...");
    await sleep(1000);
    addLog("Discovery Agent: filtering by X Layer ecosystem relevance...");
    await sleep(700);

    setPhase("evaluate");
    addLog("Evaluation Agent: scoring by audience fit, ROI, chain activity...");

    // Fetch credibility score in parallel with fake delay
    const [, credScore] = await Promise.all([
      sleep(1200),
      address ? getCredibilityScore(address).catch(() => null) : Promise.resolve(null),
    ]);

    if (credScore) {
      addLog(`Evaluation Agent: wallet credibility score — ${credScore.score}/100 (${credScore.txCount} txs · age ${credScore.ageScore}pts · assets ${credScore.assetScore}pts)`);
    }
    addLog("Evaluation Agent: cross-referencing onchain sponsor history...");
    await sleep(800);

    const scored = scoreEvents(query).slice(0, 3);
    setResults(scored);
    addLog(`Evaluation Agent: top match → ${scored[0].title} (score ${scored[0].score})`);
    setPhase("confirm"); // Wait for user to confirm
  };

  const handleConfirm = async () => {
    if (!selected || !selectedPlan) return;
    if (!isConnected) { connect(); return; }
    setPaying(true);
    setPhase("pay");
    addLog(`Payment Agent: preparing reservation on X Layer...`);
    await sleep(900);
    addLog(`Payment Agent: initiating x402 gas-free payment — $${selectedPlan.price} USDG...`);
    const [accounts] = await Promise.all([
      (window.okxwallet || window.ethereum).request({ method: 'eth_accounts' })
    ]);
    const from = accounts[0];

    // x402 agentic payment — gas-free on X Layer via OKX Facilitator
    let result;
    try {
      result = await agentPayX402({
        from,
        payTo:     CONTRACT_ADDRESS,
        amountUSD: selectedPlan.price,
      });
    } catch (err) {
      console.error('[x402 error]', err);
      addLog(`Payment Agent: ❌ ${err.message}`);
      setPhase("confirm");
      setPaying(false);
      return;
    }

    setTxHash(result.txHash);
    setTxMeta({ protocol: result.protocol, asset: result.asset, network: result.network });
    addLog(`Payment Agent: ✅ x402 settled — ${result.txHash.slice(0, 20)}...`);

    // Record sponsorship onchain (best-effort)
    recordSponsorship({
      eventId:    selected.id,
      planId:     selectedPlan.id,
      eventTitle: selected.title,
      planTitle:  selectedPlan.title,
      price:      selectedPlan.price,
    }).then(() => {
      addLog(`Payment Agent: ✅ Sponsorship recorded onchain`);
    }).catch(() => {});
    addLog(`Payment Agent: verified via OKX x402 Protocol · Gas Free · ${result.network}`);
    const event = getEventById(selected.id);
    const loc = event?.location;
    const enriched = [{
      eventId:       selected.id,
      eventTitle:    selected.title,
      eventDate:     event?.date || null,
      eventLocation: loc ? (typeof loc === 'object' ? loc.name : loc) : null,
      planId:        selectedPlan.id,
      planTitle:     selectedPlan.title,
      price:         selectedPlan.price,
    }];
    addToCart(enriched[0]);
    recordPurchases(enriched, result.txHash);
    setPhase("done");
    setPaying(false);
  };

  const reset = () => { setPhase(null); setResults([]); setSelected(null); setSelectedPlan(null); setTxHash(null); setLog([]); setQuery(""); };

  const AGENTS = [
    { id: "discover", label: "Discovery" },
    { id: "evaluate", label: "Evaluation" },
    { id: "pay",      label: "Payment" },
  ];
  const phaseOrder = ["discover", "evaluate", "confirm", "pay", "done"];
  const phaseIdx = phaseOrder.indexOf(phase);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-[#0d0d0d] border border-[#1e1e1e] rounded-full px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] agent-pulse"></span>
            <span className="text-xs text-[#444]">Multi-Agent System · X Layer</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Sponsir AI Agent</h1>
          <p className="text-[#444] text-sm mt-2">Describe what you're looking for — agents match, you confirm, they pay.</p>
          {isConnected && isReady && (
            <div className="mt-3 inline-flex items-center gap-2 bg-[#0d0d0d] border border-[#1e1e1e] rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C076]"></span>
              <span className="text-xs text-[#555]">You have <span className="text-white font-semibold">{balance.toFixed(2)} USDG</span> available for gas-free sponsorship</span>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="mb-8 flex gap-3">
          <div className="flex-1 flex items-center bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 gap-3 focus-within:border-white transition-colors">
            <span className="text-[#333] shrink-0 text-lg">✦</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && phase === null && runDiscovery()}
              placeholder="e.g. x layer asia, defi bangkok, okx builder summit..."
              disabled={phase !== null && phase !== "confirm"}
              className="flex-1 bg-transparent py-3.5 text-sm text-white placeholder-[#333] outline-none disabled:opacity-40" />
          </div>
          <button onClick={runDiscovery} disabled={!query.trim() || (phase !== null && phase !== "confirm")}
            className={`px-5 py-3 text-sm font-bold rounded-xl transition-all ${
              !query.trim() || (phase !== null && phase !== "confirm") ? "bg-[#111] text-[#333] cursor-not-allowed" : "bg-white text-black hover:bg-gray-100"
            }`}>
            {phase && phase !== "confirm" ? "Running..." : "Search →"}
          </button>
        </div>

        {/* Agent status */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {AGENTS.map((a, i) => {
            const agentPhaseIdx = i; // 0=discover,1=evaluate,2=pay
            const currentAgentIdx = phase === "discover" ? 0 : phase === "evaluate" || phase === "confirm" ? 1 : phase === "pay" || phase === "done" ? 2 : -1;
            const isActive = currentAgentIdx === agentPhaseIdx && phase !== "confirm" && phase !== "done";
            const isDone = currentAgentIdx > agentPhaseIdx || phase === "done";
            return (
              <div key={a.id} className={`bg-[#0d0d0d] border rounded-xl p-4 transition-all ${isActive ? "border-white" : isDone ? "border-[#00C076]/30" : "border-[#1e1e1e]"}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white agent-pulse"></span>}
                  {isDone && <span className="w-1.5 h-1.5 rounded-full bg-[#00C076]"></span>}
                  {!isActive && !isDone && <span className="w-1.5 h-1.5 rounded-full bg-[#2a2a2a]"></span>}
                </div>
                <div className={`text-xs font-semibold ${isActive ? "text-white" : isDone ? "text-[#00C076]" : "text-[#333]"}`}>{a.label} Agent</div>
              </div>
            );
          })}
        </div>

        {/* Log */}
        {log.length > 0 && (
          <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-xl p-4 mb-6 font-mono text-xs space-y-1 max-h-40 overflow-y-auto">
            {log.map((l, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-[#2a2a2a] shrink-0">{l.t}</span>
                <span className={l.msg.includes("✅") ? "text-[#00C076]" : "text-[#666]"}>{l.msg}</span>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="mb-6 space-y-3">
            <div className="text-xs text-[#333] font-medium tracking-widest uppercase mb-3">Agent Recommendations — Select one to sponsor</div>
            {results.map((r) => (
              <div key={r.id}
                onClick={() => { if (phase === "confirm") { setSelected(r); setSelectedPlan(null); } }}
                className={`bg-[#0d0d0d] border rounded-xl p-4 transition-all ${
                  selected?.id === r.id ? "border-white" : "border-[#1e1e1e] hover:border-[#333]"
                } ${phase === "confirm" ? "cursor-pointer" : ""}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">{r.title}</span>
                      {selected?.id === r.id && <span className="text-[10px] px-2 py-0.5 bg-white/10 text-white rounded-full">Selected</span>}
                    </div>
                    <div className="text-xs text-[#444]">{r.date} · {r.location.name.split(",")[0]}</div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <div className="text-[#00C076] font-bold">{r.score}</div>
                    <div className="text-[10px] text-[#333]">score</div>
                  </div>
                </div>

                {/* Package selection — shown when this event is selected */}
                {selected?.id === r.id && phase === "confirm" && (
                  <div className="mt-4 pt-4 border-t border-[#1e1e1e] space-y-2">
                    <div className="text-xs text-[#444] mb-2">Choose a package:</div>
                    {r.sponsorship_plans.map((plan) => (
                      <div key={plan.id} onClick={(e) => { e.stopPropagation(); setSelectedPlan(plan); }}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedPlan?.id === plan.id ? "border-[#FF6B00]/50 bg-[#FF6B00]/5" : "border-[#1e1e1e] hover:border-[#333]"
                        }`}>
                        <span className="text-xs text-white">{plan.title}</span>
                        <span className="text-xs font-bold text-white">${plan.price} USDC</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Confirm CTA */}
        {phase === "confirm" && (
          <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-6 mb-6">
            <h3 className="text-sm font-semibold mb-1">Confirm Sponsorship</h3>
            <p className="text-xs text-[#444] mb-5">
              {selected && selectedPlan
                ? `${selected.title} — ${selectedPlan.title} · $${selectedPlan.price} USDC`
                : "Select an event and package above"}
            </p>
            {!isConnected ? (
              <button onClick={connect} className="w-full py-3.5 text-sm font-bold text-white rounded-xl hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#FF6B00,#FF9A00)" }}>
                Connect Wallet to Pay
              </button>
            ) : (
              <button onClick={handleConfirm} disabled={!selected || !selectedPlan}
                className={`w-full py-3.5 bg-white text-black text-sm font-bold rounded-xl transition-all ${
                  !selected || !selectedPlan ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100"
                }`}>
                Confirm & Pay on X Layer →
              </button>
            )}
          </div>
        )}

        {/* TX Proof */}
        {txHash && (
          <div className="bg-[#0a0a0a] border border-[#00C076]/20 rounded-xl p-5 mb-6 tx-glow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[#00C076]">✓</span>
                <span className="text-sm font-semibold">Settled on X Layer</span>
              </div>
              {txMeta && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#FF6B00]/30 text-[#FF6B00] font-medium">
                    x402
                  </span>
                  <span className="text-[10px] text-[#00C076] border border-[#00C076]/20 px-2 py-0.5 rounded-full">
                    Gas Free
                  </span>
                </div>
              )}
            </div>
            <div className="text-[10px] text-[#333] mb-1">Transaction Hash · {txMeta?.asset || 'USDG'} · X Layer</div>
            <div className="font-mono text-xs text-[#00C076] break-all mb-3">{txHash}</div>
            <div className="flex items-center gap-4 flex-wrap">
              <a href={`https://www.okx.com/explorer/xlayer/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
                className="text-xs text-[#2962FF] hover:underline">View on OKX Explorer →</a>
              {selected && <Link to={`/events/${selected.id}`} className="text-xs text-[#555] hover:text-white transition-colors">View Event →</Link>}
              <Link to="/my-sponsorships" className="text-xs text-[#555] hover:text-white transition-colors">My Sponsorships →</Link>
            </div>
          </div>
        )}

        {phase === "done" && (
          <button onClick={reset} className="w-full py-3 border border-[#1e1e1e] text-[#333] hover:text-white rounded-xl text-sm transition-colors">
            ↺ New search
          </button>
        )}

        {!isConnected && !phase && (
          <div className="mt-8 flex items-center gap-2 text-xs text-[#333]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#222]"></span>
            Wallet not connected —
            <button onClick={connect} className="text-[#FF6B00] hover:underline">Connect to enable payments</button>
          </div>
        )}
      </div>
    </div>
  );
}
