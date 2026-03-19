import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrganizer } from "../../contexts/OrganizerContext";

const ic = "w-full bg-[#0a0a09] border border-[#2a2826] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444] outline-none focus:border-white transition-colors";
const lc = "text-xs text-[#555] block mb-1.5";

const PLAN_PRESETS = ["Title Sponsor", "Gold Sponsor", "Silver Sponsor", "Bronze Sponsor", "Side Event Partner", "Booth Sponsor", "Media Partner", "Community Partner"];

const DEFAULT_FORM = { title: "", price: "1", slots: "", description: "", benefits: "" };

export default function CreateSponsorshipPlans() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { getEventById, addPlanToEvent } = useOrganizer();

  const event = getEventById(eventId);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!event) return (
    <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center text-[#555]">
      Event not found.{" "}
      <button onClick={() => navigate("/manage-events")} className="ml-2 text-white underline">Go back</button>
    </div>
  );

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Required";
    if (!form.price || isNaN(parseFloat(form.price))) e.price = "Enter a valid price";
    if (!form.description.trim()) e.description = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    addPlanToEvent(eventId, {
      title: form.title,
      price: parseFloat(form.price),
      slots: form.slots ? parseInt(form.slots) : undefined,
      description: form.description,
      benefits: form.benefits ? form.benefits.split("\n").filter(Boolean) : [],
    });
    setForm(DEFAULT_FORM);
    setErrors({});
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const plans = event.sponsorship_plans || [];

  return (
    <div className="min-h-screen bg-[#0c0a09] text-white">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="text-[11px] text-[#FF6B00] tracking-[0.2em] uppercase font-medium mb-2">Edit Plans</div>
            <h1 className="text-3xl font-black tracking-tight">{event.title}</h1>
            <p className="text-[#555] text-sm mt-1">{plans.length} package{plans.length !== 1 ? "s" : ""} currently listed</p>
          </div>
          <button
            onClick={() => navigate("/manage-events")}
            className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors shrink-0"
          >
            Done →
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Add plan form */}
          <div>
            <h2 className="text-sm font-semibold mb-5">Add New Package</h2>
            <form onSubmit={handleAdd} className="bg-[#100e0c] border border-[#1e1c1a] rounded-2xl p-6 space-y-4">

              {/* Presets */}
              <div className="flex flex-wrap gap-1.5">
                {PLAN_PRESETS.map((p) => (
                  <button key={p} type="button"
                    onClick={() => setForm((prev) => ({ ...prev, title: p }))}
                    className={`px-2.5 py-1 text-[10px] rounded-full border transition-colors ${
                      form.title === p
                        ? "border-[#FF6B00]/50 text-[#FF6B00] bg-[#FF6B00]/10"
                        : "border-[#1e1c1a] text-[#444] hover:text-white hover:border-[#333]"
                    }`}
                  >{p}</button>
                ))}
              </div>

              <div>
                <label className={lc}>Package Name *</label>
                <input value={form.title} onChange={set("title")} placeholder="e.g. Gold Sponsor" className={ic} />
                {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lc}>Price (USDC) *</label>
                  <input type="number" min="0" value={form.price} onChange={set("price")} placeholder="1" className={ic} />
                  {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className={lc}>Slots</label>
                  <input type="number" min="1" value={form.slots} onChange={set("slots")} placeholder="∞" className={ic} />
                </div>
              </div>

              <div>
                <label className={lc}>Description *</label>
                <input value={form.description} onChange={set("description")} placeholder="What does this package include?" className={ic} />
                {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className={lc}>Benefits <span className="text-[#333]">(one per line)</span></label>
                <textarea value={form.benefits} onChange={set("benefits")} rows={3}
                  placeholder={"Logo on event website\nSpeaking slot (15 min)\n3 VIP passes"}
                  className={ic + " resize-none"} />
              </div>

              <button type="submit" disabled={saving}
                className={`w-full py-3 text-sm font-bold rounded-xl transition-all ${
                  saving ? "bg-white/30 text-black/40" : saved ? "bg-[#00C076] text-black" : "bg-white text-black hover:bg-gray-100"
                }`}>
                {saving ? "Adding..." : saved ? "✓ Added!" : "+ Add Package"}
              </button>
            </form>
          </div>

          {/* Existing plans */}
          <div>
            <h2 className="text-sm font-semibold mb-5">Current Packages</h2>
            {plans.length === 0 ? (
              <div className="bg-[#100e0c] border border-[#1e1c1a] rounded-2xl p-8 text-center text-[#444] text-sm">
                No packages yet. Add your first one →
              </div>
            ) : (
              <div className="space-y-3">
                {plans.map((plan) => (
                  <div key={plan.id} className="bg-[#100e0c] border border-[#1e1c1a] rounded-2xl p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-sm">{plan.title}</h3>
                      <div className="text-right shrink-0 ml-4">
                        <div className="font-bold font-mono-custom">${plan.price}</div>
                        <div className="text-[10px] text-[#444]">USDC</div>
                      </div>
                    </div>
                    {plan.slots && (
                      <div className="text-[10px] text-[#00C076] mb-1">{plan.slots} slots</div>
                    )}
                    <p className="text-xs text-[#555] mb-3">{plan.description}</p>
                    {plan.benefits?.length > 0 && (
                      <ul className="space-y-1">
                        {plan.benefits.map((b, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-[#444]">
                            <span className="text-[#00C076] shrink-0">✓</span>{b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
