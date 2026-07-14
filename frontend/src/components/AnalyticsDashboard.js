import React from "react";
import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, TrendingUp } from "lucide-react";

const COLORS = ["#10b981", "#3b82f6", "#ef4444"]; // Positive, Neutral, Negative

export default function AnalyticsDashboard() {
  const { items } = useSelector((state) => state.interactions);

  // Compute sentiment data
  const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
  items.forEach(i => {
    if (i.sentiment) sentimentCounts[i.sentiment.toLowerCase()] = (sentimentCounts[i.sentiment.toLowerCase()] || 0) + 1;
  });
  const sentimentData = [
    { name: "Positive", value: sentimentCounts.positive },
    { name: "Neutral", value: sentimentCounts.neutral },
    { name: "Negative", value: sentimentCounts.negative },
  ].filter(d => d.value > 0);

  // Compute upcoming follow-ups
  const followUps = items.filter(i => i.follow_up_date && i.follow_up_date.trim() !== "").map(i => ({
    id: i.id,
    doctor: i.hcp_name || "Unknown HCP",
    actionText: i.follow_up_date,
    loggedDate: i.interaction_date || new Date(i.date).toLocaleDateString(),
    type: i.interaction_type || "Meeting"
  }));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '24px' }}>
      
      {/* Sentiment Chart */}
      <div className="card" style={{ padding: '24px', margin: 0, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} color="var(--primary)" /> Sentiment Overview
        </h3>
        {sentimentData.length > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', height: '220px', width: '100%' }}>
            <div style={{ width: '200px', height: '100%', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sentimentData} innerRadius={65} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                    {sentimentData.map((entry, index) => {
                      const color = entry.name === "Positive" ? "#10b981" : entry.name === "Neutral" ? "#3b82f6" : "#ef4444";
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }} itemStyle={{ color: 'white' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-main)' }}>{items.length}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, paddingLeft: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)' }}></div>
                  <div style={{ color: 'var(--text-main)', fontSize: '14px', fontWeight: 500 }}>Positive</div>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600 }}>{Math.round((sentimentCounts.positive / items.length) * 100) || 0}%</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)' }}></div>
                  <div style={{ color: 'var(--text-main)', fontSize: '14px', fontWeight: 500 }}>Neutral</div>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600 }}>{Math.round((sentimentCounts.neutral / items.length) * 100) || 0}%</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)' }}></div>
                  <div style={{ color: 'var(--text-main)', fontSize: '14px', fontWeight: 500 }}>Negative</div>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600 }}>{Math.round((sentimentCounts.negative / items.length) * 100) || 0}%</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            No sentiment data yet.
          </div>
        )}
      </div>

      {/* Follow-Ups */}
      <div className="card" style={{ padding: '24px', margin: 0, display: 'flex', flexDirection: 'column', maxHeight: '310px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} color="var(--primary)" /> Upcoming Follow-ups
        </h3>
        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '8px' }}>
          {followUps.length > 0 ? followUps.map(f => (
            <div key={f.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', border: '1px solid var(--border)', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '12px', marginBottom: '12px', transition: 'all 0.3s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(30, 41, 59, 0.4)'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px' }}>{f.doctor}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'inline-block', padding: '2px 8px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '4px', color: 'var(--primary)' }}>{f.type}</div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'right' }}>
                  Logged: {f.loggedDate}
                </div>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.5', marginTop: '4px', borderTop: '1px solid rgba(148,163,184,0.1)', paddingTop: '8px' }}>
                {f.actionText}
              </div>
            </div>
          )) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', height: '100%' }}>
              No upcoming follow-ups scheduled.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
