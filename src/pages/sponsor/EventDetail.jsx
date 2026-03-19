import { useParams, Link, useNavigate } from "react-router-dom";
import { useEvents } from "../../contexts/OrganizerContext";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useWallet } from "../../contexts/WalletContext";
import { useWalletBalance } from "../../hooks/useWalletBalance";

export default function EventDetail() {
  const { eventId } = useParams();
  const { getEventById } = useEvents();
  const { isAuthenticated } = useAuth();
  const { addToCart, cartItems } = useCart();
  const { isConnected, connect, address } = useWallet();
  const { balance, isReady, canSponsor } = useWalletBalance(address);
  const navigate = useNavigate();
  const event = getEventById(eventId);

  if (!event) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-[#555]">
      Event not found. <Link to="/events" className="ml-2 text-white underline">Go back</Link>
    </div>
  );

  const isInCart = (planId) => cartItems.some((i) => i.planId === planId);
  const handleAdd = (plan) => {
    if (!isAuthenticated) { navigate("/login"); return; }
    addToCart({ eventId: event.id, eventTitle: event.title, planId: plan.id, planTitle: plan.title, price: plan.price });
  };

  const dateStr = event.date || (event.start_time
    ? new Date(event.start_time).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "TBA");

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <div className="h-56 sm:h-72 overflow-hidden relative">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-6xl mx-auto px-5 sm:px-8 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[11px] font-semibold text-[#FF6B00] bg-black/60 border border-[#FF6B00]/40 px-2.5 py-1 rounded-full backdrop-blur-sm">{event.category}</span>
            <div className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-sm">
              <span className="text-[10px] text-[#555]">AI Score</span>
              <span className="text-xs font-bold text-[#00C076]">{event.score}</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow">{event.title}</h1>
        </div>
      </div>

      <div className="border-b border-[#1e1e1e]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3 flex items-center gap-2 text-xs text-[#444]">
          <Link to="/events" className="hover:text-white">Events</Link>
          <span>/</span>
          <span className="text-white truncate">{event.title}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Left */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex flex-wrap gap-5 text-sm text-[#555]">
              <span>📅 {dateStr}</span>
              <span>📍 {event.location?.name || "TBA"}</span>
              <span>👥 {event.audience || "TBA"} audience</span>
            </div>
            <div className="h-px bg-[#1e1e1e]" />
            <div>
              <h2 className="text-base font-semibold mb-3">About This Event</h2>
              <p className="text-[#555] text-sm leading-relaxed">{event.description}</p>
            </div>
            {event.location?.address && (
              <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl p-4 text-xs text-[#444]">📍 {event.location.address}</div>
            )}

            {/* Event deck / media */}
            {event.deckUrl && (
              <div>
                <h2 className="text-base font-semibold mb-3">Event Deck</h2>
                <a href={event.deckUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl text-sm text-white hover:border-white transition-colors">
                  📄 View Event Deck
                </a>
              </div>
            )}

            {/* Past sponsors / social proof */}
            {event.pastSponsors && event.pastSponsors.length > 0 && (
              <div>
                <h2 className="text-base font-semibold mb-3">Past Sponsors</h2>
                <div className="flex flex-wrap gap-2">
                  {event.pastSponsors.map((s) => (
                    <span key={s} className="px-3 py-1.5 bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg text-xs text-[#666]">{s}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="inline-flex items-center gap-2 bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl px-4 py-3">
              <span className="w-2 h-2 rounded-full bg-[#00C076]"></span>
              <span className="text-xs text-[#555]">Sponsorship reserved on <strong className="text-white">X Layer</strong> via OKX Onchain OS</span>
            </div>
          </div>

          {/* Right: packages */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Sponsorship Packages</h2>
            </div>
            <p className="text-xs text-[#444]">All prices in USDC · Settled on X Layer · Gas Free</p>

            {/* Wallet Readiness Indicator */}
            <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isConnected ? "bg-[#00C076]" : "bg-[#333]"}`}></span>
                <span className={isConnected ? "text-[#00C076]" : "text-[#444]"}>Wallet connected</span>
                {!isConnected && (
                  <button onClick={connect} className="ml-auto text-[#FF6B00] hover:underline text-[11px]">Connect →</button>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isReady && balance > 0 ? "bg-[#00C076]" : "bg-[#333]"}`}></span>
                <span className={isReady && balance > 0 ? "text-[#00C076]" : "text-[#444]"}>
                  {isConnected
                    ? isReady
                      ? `${balance.toFixed(2)} USDG available`
                      : "Checking balance..."
                    : "USDG balance"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isConnected ? "bg-[#00C076]" : "bg-[#333]"}`}></span>
                <span className={isConnected ? "text-[#00C076]" : "text-[#444]"}>Eligible for gas-free checkout</span>
              </div>
            </div>

            {event.sponsorship_plans?.length > 0 ? (
              event.sponsorship_plans.map((plan) => {
                const soldOut = plan.slots !== undefined && plan.slotsUsed >= plan.slots;
                const inCart = isInCart(plan.id);
                const hasFunds = canSponsor(plan.price);
                return (
                  <div key={plan.id} className={`bg-[#0d0d0d] border rounded-2xl p-5 transition-all ${inCart ? "border-[#00C076]/40" : soldOut ? "border-[#333] opacity-60" : "border-[#1e1e1e] hover:border-[#333]"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-sm">{plan.title}</h3>
                      <div className="text-right">
                        <div className="font-bold text-white">${plan.price}</div>
                        <div className="text-[10px] text-[#444]">USDC</div>
                      </div>
                    </div>
                    {plan.slots !== undefined && (
                      <div className="text-[10px] text-[#555] mb-2">
                        {soldOut ? <span className="text-red-400">Sold out</span> : <span className="text-[#00C076]">{plan.slots - (plan.slotsUsed || 0)} of {plan.slots} slots left</span>}
                      </div>
                    )}
                    <p className="text-xs text-[#444] leading-relaxed mb-4">{plan.description}</p>
                    {plan.benefits?.length > 0 && (
                      <ul className="space-y-1.5 mb-5">
                        {plan.benefits.map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-[#555]">
                            <span className="text-[#00C076] shrink-0">✓</span>{b}
                          </li>
                        ))}
                      </ul>
                    )}
                    <button
                      onClick={() => {
                        if (!soldOut && !inCart) {
                          if (isConnected && isReady && !hasFunds) {
                            // Not enough — show top-up hint but still allow add to cart
                          }
                          handleAdd(plan);
                        }
                      }}
                      disabled={inCart || soldOut}
                      className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        inCart ? "bg-[#00C076]/10 text-[#00C076] border border-[#00C076]/20 cursor-default"
                        : soldOut ? "bg-[#111] text-[#333] cursor-not-allowed"
                        : isConnected && isReady && hasFunds
                          ? "text-black font-bold hover:opacity-90"
                          : "bg-white text-black hover:bg-gray-100"
                      }`}
                      style={isConnected && isReady && hasFunds && !inCart && !soldOut
                        ? { background: "linear-gradient(135deg,#FF6B00,#FF9A00)" }
                        : undefined}
                    >
                      {inCart ? "✓ Added to Cart"
                        : soldOut ? "Sold Out"
                        : isConnected && isReady && hasFunds
                          ? "⚡ Instant sponsor — gas free"
                          : isConnected && isReady && !hasFunds
                            ? `Add to Cart · Need ${(plan.price - balance).toFixed(2)} more USDG`
                            : "Add to Cart"}
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-6 text-center text-xs text-[#444]">
                No packages available yet.
              </div>
            )}

            {cartItems.length > 0 && (
              <Link to="/cart">
                <button className="w-full py-3 border border-[#2a2a2a] text-white text-sm font-semibold rounded-xl hover:bg-[#111] transition-colors mt-2">
                  View Cart ({cartItems.length}) →
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
