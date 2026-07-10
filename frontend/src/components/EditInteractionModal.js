import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editInteraction } from "../redux/slices/interactionSlice";

export default function EditInteractionModal({ interactionId, onClose }) {
  const dispatch = useDispatch();
  const existing = useSelector((state) =>
    state.interactions.items.find((i) => i.id === interactionId)
  );
  const [summary, setSummary] = useState(existing?.summary || "");
  const [sentiment, setSentiment] = useState(existing?.sentiment || "neutral");

  const handleSave = async () => {
    await dispatch(editInteraction({ id: interactionId, data: { summary, sentiment } }));
    onClose();
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.4)", display: "flex",
      alignItems: "center", justifyContent: "center", zIndex: 50,
    }}>
      <div className="card" style={{ width: 400 }}>
        <h3>Edit Interaction #{interactionId}</h3>
        <div className="form-field">
          <label>Summary</label>
          <textarea rows={4} value={summary} onChange={(e) => setSummary(e.target.value)} />
        </div>
        <div className="form-field">
          <label>Sentiment</label>
          <select value={sentiment} onChange={(e) => setSentiment(e.target.value)}>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
