import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";

const STATUS_COLORS = {
  confirmed: { dot: "bg-[#00C076]", text: "text-[#00C076]", label: "Confirmed" },
  pending: { dot: "bg-[#FF9A00]", text: "text-[#FF9A00]", label: "Pending" },
  completed: { dot: "bg-[#2962FF]", text: "text-[#2962FF]", label: "Completed" },
};

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return (
    <span className={`flex items-center gap-1.5 text-xs font-medium ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function BrandAssetPanel({ purchase, onUpdate }) {
  const [form, setForm] = useState({ ...purchase.brandAssets });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdate(purchase.id, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const field = (key, label, placeholder, type = "text") => (
    <div key={key}>
      <label className="block text-xs text-[#555] mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#FF6B00]/50"
      />
    </div>
  );

  return (
    <div className="mt-5 pt-5 border-t border-[#1a1a1a] space-y-3">
      <p className="text-xs text-[#555] font-medium uppercase tracking-wider">Brand Assets</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {field("logoUrl", "Logo URL", "https://your-brand.com/logo.png", "url")}
        {field("bannerUrl", "Banner URL", "https://your-brand.com/banner.png", "url")}
        {field("website", "Website", "https://your-brand.com", "url")}
        {field("twitter", "Twitter / X", "@yourbrand")}
        {field("telegram", "Telegram", "@yourchannel")}
      </div>
      <div>
        <label className="block text-xs text-[#555] mb-1">Brand Bio</label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          placeholder="Short description of your brand (1–2 sentences shown on event page)"
          rows={2}
          className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#FF6B00]/50 resize-none"
        />
      </div>
      <button
        onClick={handleSave}
        className={`px-5 py-2 text-sm font-semibold rounded-xl transition-colors ${
          saved
            ? "bg-[#00C076]/10 text-[#00C076] border border-[#00C076]/20"
            : "bg-white text-black hover:bg-gray-100"
        }`}
      >
        {saved ? "✓ Saved" : "Save Assets"}
      </button>
    </div>
  );
}

function PurchaseCard({ purchase, onUpdate }) {
  const [expanded, setExpanded] = useState(false);

  const date = purchase.eventDate
    ? new Date(purchase.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={purchase.status} />
            </div>
            <h3 className="text-white font-semibold text-base leading-snug">{purchase.eventTitle}</h3>
            <p className="text-[#FF6B00] text-sm font-medium mt-0.5">{purchase.planTitle}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
              {date && (
                <span className="text-xs text-[#555]">
                  <span className="text-[#333] mr-1">📅</span>{date}
                </span>
              )}
              {purchase.eventLocation && (
                <span className="text-xs text-[#555]">
                  <span className="text-[#333] mr-1">📍</span>
                  {typeof purchase.eventLocation === "object"
                    ? purchase.eventLocation.name
                    : purchase.eventLocation}
                </span>
              )}
              <span className="text-xs text-[#555]">
                <span className="text-[#333] mr-1">💳</span>${purchase.price} USDC
              </span>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-lg font-bold text-white">${purchase.price}</div>
            <div className="text-xs text-[#444]">USDC</div>
          </div>
        </div>

        {/* TX Hash */}
        <div className="mt-4 bg-[#111] border border-[#1a1a1a] rounded-xl px-3 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[10px] text-[#444] mb-0.5">TX Hash · X Layer</div>
              <div className="font-mono text-xs text-[#00C076] truncate">{purchase.txHash}</div>
            </div>
            <a
              href={`https://www.okx.com/explorer/xlayer/tx/${purchase.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-xs text-[#2962FF] hover:underline whitespace-nowrap"
            >
              Explorer →
            </a>
          </div>
        </div>

        {/* Deliverables */}
        <div className="mt-4 space-y-1.5">
          <div className="text-xs text-[#444] font-medium uppercase tracking-wider mb-2">Sponsorship Rights</div>
          {[
            "Logo on event page & materials",
            "Booth / exhibition slot",
            "Social media shoutout (3×)",
            "Dedicated email blast to attendees",
            "Speaking slot (if Title / Gold tier)",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-[#666]">
              <span className="text-[#00C076] mt-0.5">✓</span>
              {item}
            </div>
          ))}
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 text-xs text-[#444] hover:text-white transition-colors flex items-center gap-1"
        >
          {expanded ? "▲ Hide" : "▼ Upload brand assets"}
        </button>
      </div>

      {/* Expandable brand assets panel */}
      {expanded && (
        <div className="px-5 pb-5">
          <BrandAssetPanel purchase={purchase} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
}

export default function MySponsorship() {
  const { purchases, updateBrandAssets } = useCart();

  const stats = {
    total: purchases.length,
    confirmed: purchases.filter((p) => p.status === "confirmed").length,
    spent: purchases.reduce((s, p) => s + p.price, 0),
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16">

        {/* Header */}
        <div className="mb-10">
          <div className="text-xs text-[#555] uppercase tracking-wider mb-2">Sponsor Dashboard</div>
          <h1 className="text-3xl font-bold text-white">My Sponsorships</h1>
          <p className="text-[#555] text-sm mt-1">Manage your active event sponsorships on X Layer</p>
        </div>

        {purchases.length === 0 ? (
          /* Empty state */
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-[#0d0d0d] border border-[#1e1e1e] flex items-center justify-center text-2xl mx-auto mb-5">
              🎯
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">No sponsorships yet</h2>
            <p className="text-[#555] text-sm mb-8">Browse events and reserve a sponsorship package to get started.</p>
            <Link to="/events">
              <button
                className="px-8 py-3.5 rounded-xl text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg, #FF6B00, #FF9A00)" }}
              >
                Browse Events
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { label: "Active", value: stats.confirmed, color: "text-[#00C076]" },
                { label: "Total", value: stats.total, color: "text-white" },
                { label: "Spent (USDC)", value: `$${stats.spent}`, color: "text-[#FF6B00]" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-4 text-center">
                  <div className={`text-2xl font-bold ${color}`}>{value}</div>
                  <div className="text-xs text-[#555] mt-1">{label}</div>
                </div>
              ))}
            </div>

            {/* Purchase cards */}
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <PurchaseCard
                  key={purchase.id}
                  purchase={purchase}
                  onUpdate={updateBrandAssets}
                />
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link to="/events">
                <button className="px-6 py-3 border border-[#1e1e1e] rounded-xl text-sm text-[#555] hover:text-white hover:border-[#333] transition-colors">
                  + Add Another Sponsorship
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
