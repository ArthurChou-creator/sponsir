import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useWallet } from "../../contexts/WalletContext";
import { useEvents } from "../../contexts/OrganizerContext";
import { agentPayX402 } from "../../lib/x402";
import { CONTRACT_ADDRESS } from "../../lib/contract";

const STEPS = ["Cart", "Review", "Confirmed"];

export default function ShoppingCart() {
  const { cartItems, removeFromCart, clearCart, recordPurchases } = useCart();
  const { isConnected, connect, address } = useWallet();
  const { getEventById } = useEvents();
  const [step, setStep] = useState(0); // 0=cart, 1=review, 2=done
  const [paying, setPaying] = useState(false);
  const [txResult, setTxResult] = useState(null);
  const [confirmedItems, setConfirmedItems] = useState([]);

  const total = cartItems.reduce((s, i) => s + i.price, 0);

  const handleCheckout = async () => {
    if (!isConnected) { connect(); return; }
    setPaying(true);
    try {
      // x402 gas-free USDG payment via OKX Facilitator on X Layer
      const { txHash } = await agentPayX402({
        from:      address,
        payTo:     CONTRACT_ADDRESS,
        amountUSD: total,
      });
      const result = { hash: txHash, blockExplorer: `https://www.okx.com/explorer/xlayer/tx/${txHash}` };


      // Enrich cart items with event metadata before clearing
      const enriched = cartItems.map((item) => {
        const event = getEventById(item.eventId);
        return {
          ...item,
          eventDate: event?.date || null,
          eventLocation: event?.location ? (typeof event.location === "object" ? event.location.name : event.location) : null,
        };
      });
      setConfirmedItems(enriched);
      recordPurchases(enriched, result.hash);
      setTxResult(result);
      clearCart();
      setStep(2);
    } catch (e) {
      alert("Transaction failed: " + e.message);
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16">

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`flex items-center gap-2 text-sm font-medium ${
                i === step ? "text-white" : i < step ? "text-[#00C076]" : "text-[#333]"
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  i < step ? "bg-[#00C076] text-black" : i === step ? "bg-white text-black" : "bg-[#1a1a1a] text-[#444]"
                }`}>
                  {i < step ? "✓" : i + 1}
                </div>
                {s}
              </div>
              {i < STEPS.length - 1 && <div className="w-8 h-px bg-[#1e1e1e]" />}
            </div>
          ))}
        </div>

        {/* ── Step 0: Cart ── */}
        {step === 0 && (
          <>
            <h1 className="text-2xl font-bold mb-8">Your Cart</h1>

            {cartItems.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🛒</div>
                <p className="text-[#555] mb-6">Your cart is empty</p>
                <Link to="/events">
                  <button className="px-6 py-3 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-100">
                    Browse Events
                  </button>
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-8">
                  {cartItems.map((item) => (
                    <div key={item.planId} className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-5 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-white">{item.eventTitle}</div>
                        <div className="text-xs text-[#555] mt-0.5">{item.planTitle}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-white font-bold">${item.price} <span className="text-xs text-[#444] font-normal">USDC</span></div>
                        <button
                          onClick={() => removeFromCart(item.planId)}
                          className="text-[#333] hover:text-[#666] text-xs transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-5 mb-6">
                  <div className="flex justify-between text-sm text-[#666] mb-2">
                    <span>Subtotal</span>
                    <span>${total} USDC</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#666] mb-3">
                    <span>Network (X Layer)</span>
                    <span className="text-[#00C076]">~$0.00</span>
                  </div>
                  <div className="h-px bg-[#1e1e1e] mb-3" />
                  <div className="flex justify-between font-bold text-white">
                    <span>Total</span>
                    <span>${total} USDC</span>
                  </div>
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Continue to Review →
                </button>
              </>
            )}
          </>
        )}

        {/* ── Step 1: Review ── */}
        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold mb-2">Review Order</h1>
            <p className="text-[#555] text-sm mb-8">Confirm and pay with your OKX Wallet on X Layer</p>

            <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-5 mb-4">
              {cartItems.map((item) => (
                <div key={item.planId} className="flex justify-between text-sm py-2 border-b border-[#1a1a1a] last:border-0">
                  <span className="text-[#888]">{item.eventTitle} — {item.planTitle}</span>
                  <span className="text-white font-semibold">${item.price}</span>
                </div>
              ))}
              <div className="flex justify-between text-white font-bold mt-4 pt-4 border-t border-[#1e1e1e]">
                <span>Total</span>
                <span>${total} USDC</span>
              </div>
            </div>

            {/* Chain info */}
            <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-4 mb-6 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#00C076]"></span>
              <div className="text-sm">
                <span className="text-[#666]">Paying on </span>
                <span className="text-white font-semibold">X Layer</span>
                <span className="text-[#444] ml-2 text-xs">· ~0.02 gwei gas</span>
              </div>
            </div>

            {!isConnected ? (
              <button
                onClick={connect}
                className="w-full py-4 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 mb-3"
                style={{ background: "linear-gradient(135deg, #FF6B00, #FF9A00)" }}
              >
                Connect Wallet to Pay
              </button>
            ) : (
              <div className="mb-3 px-4 py-2.5 bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C076]"></span>
                <span className="text-[#666]">Connected:</span>
                <span className="font-mono text-white text-xs">{address?.slice(0,6)}...{address?.slice(-4)}</span>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={paying || !isConnected}
              className={`w-full py-4 bg-white text-black font-bold rounded-xl transition-all ${
                paying || !isConnected ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"
              }`}
            >
              {paying ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-black agent-pulse"></span>
                  Confirming on X Layer...
                </span>
              ) : (
                `Pay $${total} USDC`
              )}
            </button>

            <button
              onClick={() => setStep(0)}
              className="w-full mt-3 py-3 text-sm text-[#555] hover:text-white transition-colors"
            >
              ← Back to Cart
            </button>
          </>
        )}

        {/* ── Step 2: Confirmed ── */}
        {step === 2 && txResult && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#00C076]/10 border border-[#00C076]/20 flex items-center justify-center text-2xl mx-auto mb-6">
              ✓
            </div>
            <h1 className="text-2xl font-bold mb-2">Sponsorship Confirmed</h1>
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="text-xs px-2 py-0.5 rounded-full border border-[#FF6B00]/30 text-[#FF6B00] font-medium">x402</span>
              <span className="text-xs px-2 py-0.5 rounded-full border border-[#00C076]/30 text-[#00C076] font-medium">Gas Free</span>
              <span className="text-xs text-[#444]">Settled on X Layer via OKX Facilitator</span>
            </div>

            {/* TX Hash */}
            <div className="bg-[#0d0d0d] border border-[#00C076]/20 rounded-2xl p-5 mb-6 text-left tx-glow">
              <div className="text-xs text-[#555] mb-1">Transaction Hash · X Layer</div>
              <div className="font-mono text-xs text-[#00C076] break-all mb-3">{txResult.hash}</div>
              <a
                href={txResult.blockExplorer}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#2962FF] hover:underline"
              >
                View on OKX Explorer →
              </a>
            </div>

            {/* Confirmed items */}
            {confirmedItems.length > 0 && (
              <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-4 mb-6 text-left space-y-2">
                {confirmedItems.map((item) => (
                  <div key={item.planId} className="flex justify-between text-sm">
                    <span className="text-[#888]">{item.eventTitle} — {item.planTitle}</span>
                    <span className="text-white font-semibold">${item.price} USDC</span>
                  </div>
                ))}
              </div>
            )}

            {/* NOTE: To make this real, replace mockSendTransaction() in this file
                with a writeContract() call to your SponsorshipRegistry contract */}

            <Link to="/my-sponsorships">
              <button className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 mb-3">
                View My Sponsorships →
              </button>
            </Link>
            <Link to="/events">
              <button className="w-full py-3 text-sm text-[#555] hover:text-white transition-colors border border-[#1e1e1e] rounded-xl">
                Explore More Events
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
