import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editInteraction } from "../redux/slices/interactionSlice";
import FormFields from "./StructuredForm/FormFields";

export default function EditInteractionModal({ interactionId, onClose }) {
  const dispatch = useDispatch();
  const existing = useSelector((state) =>
    state.interactions.items.find((i) => i.id === interactionId)
  );
  
  const [formData, setFormData] = useState({
    hcp_name: existing?.hcp_name || "",
    interaction_type: existing?.interaction_type || "Meeting",
    interaction_date: existing?.interaction_date || "",
    interaction_time: existing?.interaction_time || "",
    attendees: existing?.attendees || "",
    materials_shared: existing?.materials_shared || "",
    samples_distributed: existing?.samples_distributed || "",
    topics_discussed: existing?.topics_discussed || "",
    summary: existing?.summary || "",
    sentiment: existing?.sentiment || "neutral",
    follow_up_date: existing?.follow_up_date || "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await dispatch(editInteraction({ id: interactionId, data: formData }));
    onClose();
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.4)", display: "flex",
      alignItems: "center", justifyContent: "center", zIndex: 50,
    }}>
      <div className="card" style={{ width: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ marginTop: 0, marginBottom: '24px' }}>Edit Interaction #{interactionId}</h3>
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', marginBottom: '20px' }}>
          <FormFields formData={formData} onChange={handleChange} />
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer' }}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
