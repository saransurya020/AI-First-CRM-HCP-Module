import React, { useState } from "react";
import { Send } from "lucide-react";

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="chat-input-row" onSubmit={handleSubmit} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px' }}>
      <textarea
        placeholder="Describe Interaction..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
        style={{ 
          flex: 1, 
          borderRadius: '16px', 
          border: '1px solid #d1d5db', 
          padding: '16px', 
          outline: 'none', 
          resize: 'vertical',
          minHeight: '50px',
          maxHeight: '150px',
          fontFamily: 'inherit',
          fontSize: '14px'
        }}
        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
      />
      <button 
        type="submit" 
        disabled={disabled || !value.trim()}
        style={{ 
          background: (!disabled && value.trim()) ? '#007bff' : '#9ca3af',
          color: 'white',
          border: 'none',
          borderRadius: '16px',
          height: '50px',
          padding: '0 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: (!disabled && value.trim()) ? 'pointer' : 'default',
          fontWeight: 600,
          fontSize: '14px'
        }}
      >
        Log
      </button>
    </form>
  );
}
