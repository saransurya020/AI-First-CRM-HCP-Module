import React, { useState } from "react";
import { Send, Mic } from "lucide-react";

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");
  const [isListening, setIsListening] = useState(false);

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

  const toggleListen = () => {
    if (isListening) return; // Speech API handles stopping automatically or we can add manual stop
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setValue(prev => (prev ? prev + " " + finalTranscript : finalTranscript));
      }
    };
    
    recognition.onerror = (event) => {
      console.error(event.error);
      setIsListening(false);
    };
    
    recognition.start();
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
          border: '1px solid rgba(148, 163, 184, 0.2)', 
          background: 'rgba(15, 23, 42, 0.6)',
          color: 'var(--text-main)',
          padding: '16px 16px 16px 60px', 
          outline: 'none', 
          resize: 'vertical',
          minHeight: '50px',
          maxHeight: '150px',
          fontFamily: 'inherit',
          fontSize: '14px'
        }}
        onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = 'rgba(15, 23, 42, 0.9)'; }}
        onBlur={(e) => { e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)'; e.target.style.background = 'rgba(15, 23, 42, 0.6)'; }}
      />
      <button
        type="button"
        onClick={toggleListen}
        disabled={disabled}
        title="Dictate message"
        style={{
          position: 'absolute',
          left: '16px',
          background: isListening ? 'linear-gradient(135deg, #06b6d4, #a855f7)' : 'rgba(6, 182, 212, 0.1)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          cursor: disabled ? 'default' : 'pointer',
          color: isListening ? '#ffffff' : '#06b6d4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          zIndex: 10,
          transition: 'all 0.3s',
          boxShadow: isListening ? '0 0 25px rgba(6, 182, 212, 0.8), 0 0 45px rgba(168, 85, 247, 0.6)' : 'none'
        }}
      >
        <Mic size={20} style={{ transform: isListening ? 'scale(1.1)' : 'scale(1)' }} />
        {isListening && (
          <div style={{
            position: 'absolute', top: '-10px', left: '-10px', right: '-10px', bottom: '-10px',
            borderRadius: '50%', border: '2px solid rgba(6, 182, 212, 0.5)',
            animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
          }}></div>
        )}
        {isListening && (
          <div style={{
            position: 'absolute', top: '-20px', left: '-20px', right: '-20px', bottom: '-20px',
            borderRadius: '50%', border: '1px solid rgba(168, 85, 247, 0.3)',
            animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
          }}></div>
        )}
      </button>
      <button 
        type="submit" 
        disabled={disabled || !value.trim()}
        style={{ 
          background: (!disabled && value.trim()) ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(148, 163, 184, 0.2)',
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
          fontSize: '14px',
          transition: 'all 0.3s'
        }}
      >
        Log
      </button>
    </form>
  );
}
