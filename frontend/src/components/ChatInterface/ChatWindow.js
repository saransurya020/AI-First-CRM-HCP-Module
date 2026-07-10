import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, Loader2, Sparkles, AlertCircle, Bot } from "lucide-react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { sendMessage, clearChat } from "../../redux/slices/chatSlice";

export default function ChatWindow() {
  const dispatch = useDispatch();
  const { messages, status } = useSelector((state) => state.chat);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (message) => {
    dispatch(sendMessage({ message, sessionId: "default", repId: null }));
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear this chat?")) {
      dispatch(clearChat());
    }
  };

  const suggestedPrompts = [
    "Met Dr. Rao today, discussed the new trial dosage",
    "Schedule a follow up with Dr. Smith next week",
    "Log a call with the pharmacy about inventory"
  ];

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '600px', maxHeight: '80vh', padding: '0' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#fff', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', fontSize: '18px', fontWeight: 600 }}>
          🤖 AI Assistant
        </h3>
        <div style={{ color: '#64748b', fontSize: '13px', marginTop: '4px', marginLeft: '32px' }}>
          Log Interaction details here via chat
        </div>
      </div>
      
      <div className="chat-window" style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        {messages.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ 
              background: '#eaf2fa', 
              padding: '16px 20px', 
              borderRadius: '8px', 
              color: '#334155',
              fontSize: '15px',
              lineHeight: '1.5',
              width: '100%',
              marginBottom: '16px'
            }}>
              Log interaction details here (e.g., "Met Dr. Smith, discussed Prodo-X efficacy, positive sentiment, shared brochure") or ask for help.
            </div>
          </div>
        )}
        {messages.map((m, idx) => (
          <MessageBubble key={idx} role={m.role} content={m.content} />
        ))}
        
        {status === "loading" && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#64748b', fontSize: '13px', padding: '12px', alignSelf: 'flex-start', background: '#f8fafc', borderRadius: '16px', borderBottomLeftRadius: '0' }}>
            <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
            AI is thinking...
          </div>
        )}
        
        {status === "failed" && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#ef4444', fontSize: '13px', padding: '12px', alignSelf: 'flex-start', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fee2e2' }}>
            <AlertCircle size={16} />
            Failed to send message. Please try again.
          </div>
        )}
        
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: '16px 20px', borderTop: '1px solid #e5e7eb', backgroundColor: '#fff', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
        <ChatInput onSend={handleSend} disabled={status === "loading"} />
      </div>
    </div>
  );
}
