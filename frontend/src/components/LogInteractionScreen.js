import React from "react";
import StructuredForm from "./StructuredForm/StructuredForm";
import ChatWindow from "./ChatInterface/ChatWindow";
import InteractionList from "./InteractionList";
import AnalyticsDashboard from "./AnalyticsDashboard";

export default function LogInteractionScreen() {
  return (
    <div className="app-container" style={{ maxWidth: '1200px' }}>
      <div className="header">
        <h2>HCP — CRM Dashboard</h2>
      </div>

      <AnalyticsDashboard />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        <div>
          <StructuredForm />
        </div>
        <div>
          <ChatWindow />
        </div>
      </div>

      <InteractionList />
    </div>
  );
}
