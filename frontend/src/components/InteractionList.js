import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInteractions, removeInteraction } from "../redux/slices/interactionSlice";
import EditInteractionModal from "./EditInteractionModal";

export default function InteractionList() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.interactions);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchInteractions());
  }, [dispatch]);

  return (
    <>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', paddingBottom: 0 }}>
        <h3 style={{ margin: 0, paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
          Logged Interactions
        </h3>
        <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '12px', paddingBottom: '32px', paddingTop: '16px' }}>
        {status === "loading" && <p>Loading...</p>}
        {items.length === 0 && status === "succeeded" && (
          <p style={{ color: "#98a2b3" }}>No interactions logged yet.</p>
        )}
        {items.map((item) => (
          <div className="interaction-list-item" key={item.id}>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '4px' }}>
                <strong style={{ fontSize: '15px' }}>{item.hcp_name || `HCP #${item.hcp_id}`}</strong>
                <span style={{ color: "#64748b", marginLeft: '8px', fontSize: '13px' }}>
                  ({item.interaction_type || "Meeting"})
                </span>
                <span style={{ float: 'right', color: "#94a3b8", fontSize: '13px' }}>
                  {item.interaction_date || new Date(item.date).toLocaleDateString()} {item.interaction_time && `at ${item.interaction_time}`}
                </span>
              </div>
              
              {item.attendees && (
                <div style={{ fontSize: '13px', color: '#475569', marginBottom: '4px' }}>
                  <strong>Attendees:</strong> {item.attendees}
                </div>
              )}
              
              {item.topics_discussed && (
                <div style={{ fontSize: '13px', color: '#475569', marginBottom: '4px' }}>
                  <strong>Topics:</strong> {item.topics_discussed}
                </div>
              )}

              {item.materials_shared && (
                <div style={{ fontSize: '13px', color: '#475569', marginBottom: '4px' }}>
                  <strong>Materials:</strong> {item.materials_shared}
                </div>
              )}

              {item.samples_distributed && (
                <div style={{ fontSize: '13px', color: '#475569', marginBottom: '4px' }}>
                  <strong>Samples:</strong> {item.samples_distributed}
                </div>
              )}

              <div style={{ fontSize: '13px', color: '#475569', marginTop: '8px' }}>
                <strong>Outcomes:</strong> {item.summary || "(no outcomes logged)"}
              </div>

              {item.sentiment && (
                <div style={{ fontSize: '13px', marginTop: '4px', textTransform: 'capitalize' }}>
                  <strong>Sentiment:</strong> {item.sentiment}
                </div>
              )}
              
              {item.follow_up_date && (
                <div style={{ fontSize: '13px', color: '#3b82f6', marginTop: '4px' }}>
                  <strong>Follow-up:</strong> {item.follow_up_date}
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button 
                onClick={() => setEditingId(item.id)}
                style={{ background: 'white', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s' }}
                onMouseOver={e => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = '#94a3b8'; }}
                onMouseOut={e => { e.target.style.background = 'white'; e.target.style.borderColor = '#cbd5e1'; }}
              >
                Edit
              </button>
              <button 
                onClick={() => dispatch(removeInteraction(item.id))}
                style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s' }}
                onMouseOver={e => { e.target.style.background = '#fee2e2'; e.target.style.borderColor = '#fca5a5'; }}
                onMouseOut={e => { e.target.style.background = '#fef2f2'; e.target.style.borderColor = '#fecaca'; }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        </div>
      </div>

      {editingId && (
        <EditInteractionModal
          interactionId={editingId}
          onClose={() => setEditingId(null)}
        />
      )}
    </>
  );
}
