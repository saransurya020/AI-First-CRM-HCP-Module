import React from "react";
import ReactMarkdown from "react-markdown";

export default function MessageBubble({ role, content }) {
  const isUser = role === "user";
  
  // Determine background color based on content (simple heuristic for success message)
  const isSuccess = !isUser && content.includes("Interaction logged successfully");
  const aiBgColor = isSuccess ? '#e6f4ea' : '#eaf2fa'; // light green vs light blue
  
  return (
    <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column' }}>
      <div 
        style={{ 
          background: isUser ? '#f4f5f7' : aiBgColor, 
          padding: '16px 20px', 
          borderRadius: '8px', 
          borderLeft: isUser ? '4px solid #3b82f6' : 'none',
          color: '#334155',
          fontSize: '15px',
          lineHeight: '1.5',
          width: '100%',
        }}
      >
        <div className="message-content">
          {isUser ? (
            <p style={{ margin: 0 }}>{content}</p>
          ) : (
            <ReactMarkdown
              components={{
                p: ({node, ...props}) => <p style={{ margin: '0 0 8px 0', lastChild: {marginBottom: 0} }} {...props} />,
                ul: ({node, ...props}) => <ul style={{ margin: '0 0 8px 0', paddingLeft: '20px' }} {...props} />,
                ol: ({node, ...props}) => <ol style={{ margin: '0 0 8px 0', paddingLeft: '20px' }} {...props} />,
                li: ({node, ...props}) => <li style={{ marginBottom: '4px' }} {...props} />,
                strong: ({node, ...props}) => <strong style={{ color: isSuccess ? '#166534' : 'inherit' }} {...props} />
              }}
            >
              {isSuccess ? `✅ ${content}` : content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}
