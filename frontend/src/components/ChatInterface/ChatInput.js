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
        type="button"
        onClick={toggleListen}
        disabled={disabled}
        title="Dictate message"
        style={{
          position: 'absolute',
          right: '80px',
          background: 'none',
          border: 'none',
          cursor: disabled ? 'default' : 'pointer',
          color: isListening ? '#ef4444' : '#9ca3af',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px'
        }}
      >
        <Mic size={20} className={isListening ? "pulse-animation" : ""} />
      </button>
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
