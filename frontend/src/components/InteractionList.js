import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInteractions, removeInteraction } from "../redux/slices/interactionSlice";
import EditInteractionModal from "./EditInteractionModal";
import { Clock, CheckCircle2, MessageSquare, AlertCircle } from "lucide-react";

export default function InteractionList() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.interactions);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchInteractions());
  }, [dispatch]);

  const getIcon = (type) => {
    if (type === 'Call') return <Clock size={16} color="var(--primary)" />;
    if (type === 'Email') return <MessageSquare size={16} color="var(--primary)" />;
    return <CheckCircle2 size={16} color="var(--primary)" />;
  };

  return (
    <>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: '32px' }}>
        <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', color: 'var(--text-main)', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
          Doctor History Timeline
        </h3>
        
        <div style={{ maxHeight: '800px', overflowY: 'auto', paddingRight: '16px', position: 'relative' }}>
          {status === "loading" && <p style={{ color: 'var(--text-muted)' }}>Loading timeline...</p>}
          {items.length === 0 && status === "succeeded" && (
            <p style={{ color: "var(--text-muted)", textAlign: 'center', padding: '40px' }}>No interactions logged yet.</p>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', position: 'relative', zIndex: 1, padding: '24px 0' }}>
            {/* Timeline Line */}
            {items.length > 0 && (
              <div style={{ position: 'absolute', top: '24px', bottom: '24px', left: '50%', transform: 'translateX(-50%)', width: '2px', background: 'var(--primary)', boxShadow: '0 0 8px var(--primary)', zIndex: 0 }}></div>
            )}
            {items.map((item, index) => {
              const isLeft = index % 2 === 0;
              return (
              <div key={item.id} style={{ display: 'flex', justifyContent: isLeft ? 'flex-start' : 'flex-end', position: 'relative', width: '100%' }}>
                
                {/* Timeline Node Center */}
                <div style={{ 
                  position: 'absolute', left: '50%', top: '24px', transform: 'translate(-50%, -50%)',
                  width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(15, 23, 42, 0.9)', 
                  border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)', zIndex: 2
                }}>
                  {getIcon(item.interaction_type)}
                </div>

                {/* Timeline Card Container */}
                <div style={{ width: '46%', position: 'relative' }}>
                  
                  {/* Pointer Triangle */}
                  <div style={{ 
                    position: 'absolute', top: '24px', [isLeft ? 'right' : 'left']: '-12px', transform: 'translateY(-50%)',
                    width: 0, height: 0, borderTop: '12px solid transparent', borderBottom: '12px solid transparent',
                    [isLeft ? 'borderLeft' : 'borderRight']: '12px solid rgba(30, 41, 59, 0.8)'
                  }}></div>

                  <div style={{ 
                    background: 'rgba(30, 41, 59, 0.6)', border: '1px solid var(--border)', borderRadius: '16px', 
                    padding: '24px', position: 'relative', transition: 'all 0.3s',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = 'rgba(30, 41, 59, 0.9)'; e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = isLeft ? 'translateX(-6px)' : 'translateX(6px)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid rgba(148,163,184,0.1)', paddingBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '6px' }}>
                          {item.interaction_type || "Meeting"} - "{item.hcp_name || `HCP #${item.hcp_id}`}"
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                          {item.attendees ? `Attendees: ${item.attendees}` : 'No attendees listed'}
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--primary)', textAlign: 'right' }}>
                        {item.interaction_date || new Date(item.date).toLocaleDateString()}
                        <br/>
                        <span style={{ color: 'var(--text-muted)' }}>{item.interaction_time || ''}</span>
                      </div>
                    </div>
                    
                    <div style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                      {item.topics_discussed && (
                        <div style={{ marginBottom: '8px' }}>
                          <strong style={{ color: 'var(--text-main)' }}>Key Points:</strong> {item.topics_discussed}
                        </div>
                      )}
                      {item.summary && (
                        <div style={{ marginBottom: '8px' }}>
                          <strong style={{ color: 'var(--text-main)' }}>Brief excerpt:</strong> {item.summary}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 12, marginTop: '20px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => setEditingId(item.id)}
                        style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', transition: 'all 0.2s' }}
                        onMouseOver={e => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.borderColor = 'var(--primary)'; }}
                        onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'var(--border)'; }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => { if(window.confirm("Delete this interaction?")) dispatch(removeInteraction(item.id)); }}
                        style={{ background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', transition: 'all 0.2s' }}
                        onMouseOver={e => { e.target.style.background = 'rgba(239, 68, 68, 0.1)'; e.target.style.borderColor = '#ef4444'; }}
                        onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(239, 68, 68, 0.3)'; }}
                      >
                        Delete
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            )})}
          </div>
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
