import React, { useState } from "react";
import { useDispatch } from "react-redux";
import FormFields from "./FormFields";
import { submitInteraction } from "../../redux/slices/interactionSlice";

const initialFormState = {
  hcp_name: "",
  interaction_type: "Meeting",
  interaction_date: new Date().toISOString().split('T')[0],
  interaction_time: "19:36",
  attendees: "",
  materials_shared: "",
  samples_distributed: "",
  topics_discussed: "",
  summary: "", // for Outcomes
  sentiment: "neutral",
  follow_up_date: "", // for follow-up actions
  mode: "form",
};

export default function StructuredForm() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialFormState);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(submitInteraction(formData));
    setSubmitted(true);
    setFormData(initialFormState);
    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <form className="card" onSubmit={handleSubmit} style={{ height: '600px', display: 'flex', flexDirection: 'column', margin: 0 }}>
      <h3 style={{ marginTop: 0, marginBottom: '24px', color: 'var(--text-main)' }}>Log HCP Interaction</h3>
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
        <FormFields formData={formData} onChange={handleChange} />
      </div>
      <div style={{ marginTop: '20px' }}>
        <button className="btn-primary" type="submit" style={{ width: '100%' }}>Save Interaction</button>
        {submitted && <p style={{ color: "#10b981", marginTop: 12, textAlign: 'center', fontWeight: 500 }}>Saved successfully!</p>}
      </div>
    </form>
  );
}
