import { useState } from "react";
import { Link } from "react-router-dom";
import { useOrganizer } from "../../contexts/OrganizerContext";

const TABS = ["all", "published", "draft"];

export default function ManageEvents() {
  const { myEvents, publishEvent, deleteEvent } = useOrganizer();
  const [tab, setTab] = useState("all");

  const filtered = myEvents.filter((e) => tab === "all" || e.status === tab);

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) deleteEvent(id);
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      published: "text-[#00C076] bg-[#00C076]/10 border-[#00C076]/20",
      draft: "text-[#FF6B00] bg-[#FF6B00]/10 border-[#FF6B00]/20",
    };
    return (
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${styles[status] || "text-[#555] border-[#333]"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Manage Events</h1>
            <p className="text-[#444] text-sm mt-1">{myEvents.length} events in your account</p>
          </div>
          <Link to="/create-event">
            <button className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors">
              + List Event
            </button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-[#0a0a0a] border border-[#1e1e1e] rounded-xl p-1 w-fit">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                tab === t ? "bg-white text-black" : "text-[#555] hover:text-white"
              }`}>
              {t} ({t === "all" ? myEvents.length : myEvents.filter((e) => e.status === t).length})
            </button>
          ))}
        </div>

        {/* Events list */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 border border-[#1e1e1e] rounded-2xl">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-[#444] mb-5">No {tab === "all" ? "" : tab} events yet.</p>
            <Link to="/create-event">
              <button className="px-6 py-3 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-100">
                List Your First Event
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((event) => (
              <div key={event.id} className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-5 hover:border-[#2a2a2a] transition-colors">
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  {event.image && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Link to={`/events/${event.id}`}
                        className="text-sm font-semibold text-white hover:text-[#ccc] transition-colors truncate">
                        {event.title}
                      </Link>
                      <StatusBadge status={event.status} />
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-[#444] mt-1">
                      <span>📅 {event.date || (event.start_time ? new Date(event.start_time).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : "TBA")}</span>
                      <span>📍 {event.location?.name || "TBA"}</span>
                      <span>👥 {event.audience || "TBA"}</span>
                      <span className="text-[#FF6B00]">{event.sponsorship_plans?.length || 0} packages</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {event.status === "draft" && (
                      <button onClick={() => publishEvent(event.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors"
                        style={{ background: "linear-gradient(135deg,#FF6B00,#FF9A00)" }}>
                        Publish
                      </button>
                    )}
                    <Link to={`/events/${event.id}/sponsorship-plans`}>
                      <button className="px-3 py-1.5 text-xs font-medium text-[#555] border border-[#2a2a2a] rounded-lg hover:text-white hover:border-[#444] transition-colors">
                        Edit Plans
                      </button>
                    </Link>
                    <button onClick={() => handleDelete(event.id, event.title)}
                      className="px-3 py-1.5 text-xs font-medium text-[#555] border border-[#2a2a2a] rounded-lg hover:text-red-400 hover:border-red-400/30 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
