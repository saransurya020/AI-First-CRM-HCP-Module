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
      <div className="card">
        <h3>Logged Interactions</h3>
        {status === "loading" && <p>Loading...</p>}
        {items.length === 0 && status === "succeeded" && (
          <p style={{ color: "#98a2b3" }}>No interactions logged yet.</p>
        )}
        {items.map((item) => (
          <div className="interaction-list-item" key={item.id}>
            <div>
              <strong>#{item.id}</strong> — {item.summary || "(no summary)"}{" "}
              <span style={{ color: "#98a2b3", fontSize: 12 }}>
                [{item.mode}] {new Date(item.date).toLocaleDateString()}
              </span>
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

      {editingId && (
        <EditInteractionModal
          interactionId={editingId}
          onClose={() => setEditingId(null)}
        />
      )}
    </>
  );
}
