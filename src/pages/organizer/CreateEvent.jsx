import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useOrganizer } from "../../contexts/OrganizerContext";

const ic = "w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#333] outline-none focus:border-white transition-colors";
const lc = "text-xs text-[#555] block mb-1.5";
const ec = "text-xs text-red-400 mt-1";

const DEFAULT_PLAN = { title: "", price: "1", slots: "", description: "", benefits: "" };
const PLAN_PRESETS = ["Title Sponsor", "Gold Sponsor", "Silver Sponsor", "Bronze Sponsor", "Side Event Partner", "Booth Sponsor", "Media Partner", "Community Partner"];
const CATEGORIES = ["Crypto", "DeFi", "X Layer", "NFT", "Gaming", "DAO", "Web3 Infra"];

export default function CreateEvent() {
  const navigate = useNavigate();
  const { addEvent } = useOrganizer();
  const imageRef = useRef();

  const [form, setForm] = useState({
    title: "", description: "", start_time: "", end_time: "",
    location_name: "", location_address: "", category: "Crypto", audience: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [deckName, setDeckName] = useState("");
  const [plans, setPlans] = useState([{ ...DEFAULT_PLAN, id: Date.now() }]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDeck = (e) => {
    const file = e.target.files[0];
    if (file) setDeckName(file.name);
  };

  const addPlan = () => setPlans((p) => [...p, { ...DEFAULT_PLAN, id: Date.now() }]);
  const removePlan = (id) => setPlans((p) => p.filter((pl) => pl.id !== id));
  const setPlan = (id, field, value) => setPlans((p) => p.map((pl) => pl.id === id ? { ...pl, [field]: value } : pl));
  const applyPreset = (id, preset) => setPlan(id, "title", preset);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Required";
    if (!form.description.trim()) e.description = "Required";
    if (!form.start_time) e.start_time = "Required";
    if (!form.end_time) e.end_time = "Required";
    if (form.start_time && form.end_time && form.start_time >= form.end_time) e.end_time = "Must be after start";
    if (!form.location_name.trim()) e.location_name = "Required";
    if (!form.location_address.trim()) e.location_address = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));

    const sponsorship_plans = plans
      .filter((p) => p.title.trim())
      .map((p, i) => ({
        id: `plan-${Date.now()}-${i}`,
        title: p.title,
        price: parseFloat(p.price) || 1,
        slots: p.slots ? parseInt(p.slots) : undefined,
        slotsUsed: 0,
        description: p.description,
        benefits: p.benefits ? p.benefits.split("\n").filter(Boolean) : [],
      }));

    addEvent({
      title: form.title,
      description: form.description,
      start_time: form.start_time,
      end_time: form.end_time,
      date: new Date(form.start_time).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      location: { name: form.location_name, address: form.location_address },
      category: form.category,
      audience: form.audience || "TBA",
      image: imagePreview || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      sponsorship_plans,
    });

    setSubmitting(false);
    navigate("/manage-events");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight">List an Event</h1>
          <p className="text-[#444] text-sm mt-2">Add your event and define sponsorship packages for brands to discover.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Event Details */}
          <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-6 space-y-5">
            <h2 className="text-sm font-semibold">Event Details</h2>
            <div>
              <label className={lc}>Event Title *</label>
              <input value={form.title} onChange={set("title")} placeholder="e.g. OKX Builder Meetup Bangkok" className={ic} />
              {errors.title && <p className={ec}>{errors.title}</p>}
            </div>
            <div>
              <label className={lc}>Description *</label>
              <textarea value={form.description} onChange={set("description")} rows={4}
                placeholder="Audience, focus, why sponsors should care, past sponsors..." className={ic + " resize-none"} />
              {errors.description && <p className={ec}>{errors.description}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lc}>Category</label>
                <select value={form.category} onChange={set("category")} className={ic + " cursor-pointer"}>
                  {CATEGORIES.map((c) => <option key={c} value={c} className="bg-[#111]">{c}</option>)}
                </select>
              </div>
              <div>
                <label className={lc}>Expected Audience</label>
                <input value={form.audience} onChange={set("audience")} placeholder="e.g. 500+" className={ic} />
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-6 space-y-5">
            <h2 className="text-sm font-semibold">Date & Time</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lc}>Start *</label>
                <input type="datetime-local" value={form.start_time} onChange={set("start_time")} className={ic + " [color-scheme:dark]"} />
                {errors.start_time && <p className={ec}>{errors.start_time}</p>}
              </div>
              <div>
                <label className={lc}>End *</label>
                <input type="datetime-local" value={form.end_time} onChange={set("end_time")} className={ic + " [color-scheme:dark]"} />
                {errors.end_time && <p className={ec}>{errors.end_time}</p>}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-6 space-y-5">
            <h2 className="text-sm font-semibold">Location</h2>
            <div>
              <label className={lc}>Venue Name *</label>
              <input value={form.location_name} onChange={set("location_name")} placeholder="e.g. Four Seasons Bangkok" className={ic} />
              {errors.location_name && <p className={ec}>{errors.location_name}</p>}
            </div>
            <div>
              <label className={lc}>Address *</label>
              <input value={form.location_address} onChange={set("location_address")} placeholder="e.g. 300/1 Charoen Krung Rd, Bangkok" className={ic} />
              {errors.location_address && <p className={ec}>{errors.location_address}</p>}
            </div>
          </div>

          {/* Media */}
          <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-6 space-y-5">
            <h2 className="text-sm font-semibold">Media & Materials</h2>

            {/* Cover photo */}
            <div>
              <label className={lc}>Event Cover Photo</label>
              <div className="flex gap-4 items-start">
                {imagePreview ? (
                  <div className="relative w-28 h-20 rounded-xl overflow-hidden shrink-0">
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full text-white text-xs flex items-center justify-center">✕</button>
                  </div>
                ) : (
                  <div onClick={() => imageRef.current?.click()}
                    className="w-28 h-20 rounded-xl border border-dashed border-[#2a2a2a] flex items-center justify-center cursor-pointer hover:border-white transition-colors shrink-0">
                    <span className="text-[#333] text-2xl">+</span>
                  </div>
                )}
                <div className="flex-1">
                  <button type="button" onClick={() => imageRef.current?.click()}
                    className="px-4 py-2 border border-[#2a2a2a] text-sm text-[#666] rounded-xl hover:text-white hover:border-[#444] transition-colors">
                    {imagePreview ? "Change photo" : "Upload photo"}
                  </button>
                  <p className="text-[10px] text-[#333] mt-2">JPG, PNG · Recommended 1200×630px</p>
                  <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
                </div>
              </div>
            </div>

            {/* Event deck */}
            <div>
              <label className={lc}>Event Deck / Sponsorship Deck</label>
              <div className="flex items-center gap-3">
                <label className="px-4 py-2 border border-[#2a2a2a] text-sm text-[#666] rounded-xl hover:text-white hover:border-[#444] transition-colors cursor-pointer">
                  {deckName ? "Change file" : "Upload deck"}
                  <input type="file" accept=".pdf,.ppt,.pptx" className="hidden" onChange={handleDeck} />
                </label>
                {deckName && <span className="text-xs text-[#00C076] truncate max-w-[200px]">✓ {deckName}</span>}
              </div>
              <p className="text-[10px] text-[#333] mt-1.5">PDF or PowerPoint · Max 20MB</p>
            </div>
          </div>

          {/* Sponsorship Packages */}
          <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-semibold">Sponsorship Packages</h2>
                <p className="text-xs text-[#444] mt-0.5">Define what sponsors can buy</p>
              </div>
              <button type="button" onClick={addPlan}
                className="px-3 py-1.5 text-xs font-medium border border-[#2a2a2a] text-[#666] hover:text-white hover:border-[#444] rounded-lg transition-colors">
                + Add Package
              </button>
            </div>

            <div className="space-y-5">
              {plans.map((plan, idx) => (
                <div key={plan.id} className="bg-black border border-[#1e1e1e] rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#444]">Package {idx + 1}</span>
                    {plans.length > 1 && (
                      <button type="button" onClick={() => removePlan(plan.id)} className="text-[#333] hover:text-red-400 text-xs transition-colors">Remove</button>
                    )}
                  </div>

                  {/* Preset pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {PLAN_PRESETS.map((p) => (
                      <button key={p} type="button" onClick={() => applyPreset(plan.id, p)}
                        className={`px-2.5 py-1 text-[10px] rounded-full border transition-colors ${
                          plan.title === p ? "border-[#FF6B00]/50 text-[#FF6B00] bg-[#FF6B00]/10" : "border-[#1e1e1e] text-[#444] hover:text-white hover:border-[#333]"
                        }`}>{p}</button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lc}>Package Name</label>
                      <input value={plan.title} onChange={(e) => setPlan(plan.id, "title", e.target.value)}
                        placeholder="e.g. Gold Sponsor" className={ic} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={lc}>Price (USDC)</label>
                        <input type="number" min="0" value={plan.price} onChange={(e) => setPlan(plan.id, "price", e.target.value)}
                          placeholder="1" className={ic} />
                      </div>
                      <div>
                        <label className={lc}>Slots</label>
                        <input type="number" min="1" value={plan.slots} onChange={(e) => setPlan(plan.id, "slots", e.target.value)}
                          placeholder="∞" className={ic} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={lc}>Description</label>
                    <input value={plan.description} onChange={(e) => setPlan(plan.id, "description", e.target.value)}
                      placeholder="What does this package include?" className={ic} />
                  </div>

                  <div>
                    <label className={lc}>Benefits <span className="text-[#333]">(one per line)</span></label>
                    <textarea value={plan.benefits} onChange={(e) => setPlan(plan.id, "benefits", e.target.value)}
                      rows={3} placeholder={"Logo on event website\nSpeaking slot (15 min)\n3 VIP passes"} className={ic + " resize-none"} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)}
              className="flex-1 py-3.5 border border-[#2a2a2a] text-[#555] hover:text-white rounded-xl text-sm transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className={`flex-1 py-3.5 bg-white text-black text-sm font-bold rounded-xl transition-all ${submitting ? "opacity-40" : "hover:bg-gray-100"}`}>
              {submitting ? "Creating..." : "Create Event →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
