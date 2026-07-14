import React, { useState } from "react";
import { Mic, Search, PackagePlus, Clock, Calendar, Plus } from "lucide-react";

export default function FormFields({ formData, onChange }) {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const current = formData.topics_discussed || "";
      onChange("topics_discussed", current ? `${current} ${transcript}` : transcript);
    };
    
    recognition.onerror = (event) => {
      console.error(event.error);
      setIsListening(false);
    };
    
    recognition.start();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* SECTION: Interaction Details */}
      <section>
        <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '16px', marginTop: 0 }}>
          Interaction Details
        </h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div className="form-field" style={{ marginBottom: 0 }}>
            <label>HCP Name</label>
            <input
              type="text"
              value={formData.hcp_name}
              onChange={(e) => onChange("hcp_name", e.target.value)}
              placeholder="Search or select HCP..."
            />
          </div>
          <div className="form-field" style={{ marginBottom: 0 }}>
            <label>Interaction Type</label>
            <select
              value={formData.interaction_type || "Meeting"}
              onChange={(e) => onChange("interaction_type", e.target.value)}
            >
              <option value="Meeting">Meeting</option>
              <option value="Call">Call</option>
              <option value="Email">Email</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div className="form-field" style={{ marginBottom: 0 }}>
            <label>Date</label>
            <div style={{ position: 'relative' }}>
              <input
                type="date"
                value={formData.interaction_date || ""}
                onChange={(e) => onChange("interaction_date", e.target.value)}
              />
            </div>
          </div>
          <div className="form-field" style={{ marginBottom: 0 }}>
            <label>Time</label>
            <div style={{ position: 'relative' }}>
              <input
                type="time"
                value={formData.interaction_time || ""}
                onChange={(e) => onChange("interaction_time", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-field">
          <label>Attendees</label>
          <input
            type="text"
            value={formData.attendees || ""}
            onChange={(e) => onChange("attendees", e.target.value)}
            placeholder="Enter names or search..."
          />
        </div>

        <div className="form-field" style={{ marginBottom: '8px' }}>
          <label>Topics Discussed</label>
          <div style={{ position: 'relative' }}>
            <textarea
              rows={3}
              value={formData.topics_discussed}
              onChange={(e) => onChange("topics_discussed", e.target.value)}
              placeholder="Enter key discussion points..."
              style={{ resize: 'none' }}
            />
            <Mic size={16} color="#94a3b8" style={{ position: 'absolute', bottom: '12px', right: '12px' }} />
          </div>
        </div>
        
        <button 
          type="button" 
          onClick={startListening}
          style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '6px', 
          background: isListening ? 'rgba(239, 68, 68, 0.1)' : 'rgba(30, 41, 59, 0.6)', 
          border: '1px solid', borderColor: isListening ? 'rgba(239, 68, 68, 0.2)' : 'var(--border)', 
          color: isListening ? '#ef4444' : 'var(--text-main)', 
          padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' 
        }}>
          <Mic size={14} className={isListening ? "pulse-animation" : ""} /> 
          {isListening ? "Listening..." : "Summarize from Voice Note (Requires Consent)"}
        </button>
      </section>

      {/* SECTION: Materials / Samples */}
      <section>
        <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 12px 0' }}>
          Materials Shared / Samples Distributed
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-main)', marginBottom: '4px' }}>Materials Shared</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: formData.materials_shared ? 'normal' : 'italic' }}>
                {formData.materials_shared || "No materials added."}
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => {
                const item = window.prompt("Enter material name:");
                if (item) {
                  const current = formData.materials_shared || "";
                  onChange("materials_shared", current ? `${current}, ${item}` : item);
                }
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(30, 41, 59, 0.9)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', color: 'var(--text-main)' }}>
              <Search size={14} /> Search/Add
            </button>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-main)', marginBottom: '4px' }}>Samples Distributed</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: formData.samples_distributed ? 'normal' : 'italic' }}>
                {formData.samples_distributed || "No samples added."}
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => {
                const item = window.prompt("Enter sample name/quantity:");
                if (item) {
                  const current = formData.samples_distributed || "";
                  onChange("samples_distributed", current ? `${current}, ${item}` : item);
                }
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', color: '#475569' }}>
              <PackagePlus size={14} /> Add Sample
            </button>
          </div>
        </div>
      </section>

      {/* SECTION: Sentiment */}
      <section>
        <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 12px 0' }}>
          Observed/Inferred HCP Sentiment
        </h4>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['positive', 'neutral', 'negative'].map((sent) => (
            <label key={sent} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--text-muted)' }}>
              <input
                type="radio"
                name="sentiment"
                value={sent}
                checked={formData.sentiment === sent}
                onChange={(e) => onChange("sentiment", e.target.value)}
                style={{ cursor: 'pointer', accentColor: '#3b82f6', width: '16px', height: '16px' }}
              />
              <span style={{ textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {sent === 'positive' ? '😊 Positive' : sent === 'neutral' ? '😐 Neutral' : '😞 Negative'}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* SECTION: Outcomes */}
      <section>
        <div className="form-field" style={{ marginBottom: 0 }}>
          <label style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 8px 0' }}>Outcomes</label>
          <textarea
            rows={2}
            value={formData.summary}
            onChange={(e) => onChange("summary", e.target.value)}
            placeholder="Key outcomes or agreements..."
            style={{ resize: 'none' }}
          />
        </div>
      </section>

      {/* SECTION: Follow-up */}
      <section>
        <div className="form-field" style={{ marginBottom: '8px' }}>
          <label style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 8px 0' }}>Follow-up Actions</label>
          <textarea
            rows={2}
            value={formData.follow_up_date}
            onChange={(e) => onChange("follow_up_date", e.target.value)}
            placeholder="Enter next steps or tasks..."
            style={{ resize: 'none' }}
          />
        </div>
        
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>AI Suggested Follow-ups:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div 
              onClick={() => onChange("follow_up_date", formData.follow_up_date ? `${formData.follow_up_date}\n- Schedule follow-up meeting in 2 weeks` : "- Schedule follow-up meeting in 2 weeks")}
              style={{ color: 'var(--primary)', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Plus size={14} /> Schedule follow-up meeting in 2 weeks
            </div>
            <div 
              onClick={() => onChange("follow_up_date", formData.follow_up_date ? `${formData.follow_up_date}\n- Send OncoBoost Phase III PDF` : "- Send OncoBoost Phase III PDF")}
              style={{ color: 'var(--primary)', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Plus size={14} /> Send OncoBoost Phase III PDF
            </div>
            <div 
              onClick={() => onChange("follow_up_date", formData.follow_up_date ? `${formData.follow_up_date}\n- Add Dr. Sharma to advisory board invite list` : "- Add Dr. Sharma to advisory board invite list")}
              style={{ color: 'var(--primary)', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Plus size={14} /> Add Dr. Sharma to advisory board invite list
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
