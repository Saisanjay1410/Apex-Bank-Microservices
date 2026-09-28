import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Bot, MessageSquare } from 'lucide-react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '../common/Toast';
import { ChatBotDrawer } from '../chatbot/ChatBotDrawer';

export const AppLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="app-shell bg-mesh">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Column */}
      <div className="main-content">
        <Navbar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <main className="page-container">
          <Outlet />
        </main>
      </div>

      {/* Discreet Sleek AI Assistant Trigger */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.8125rem',
            zIndex: 90,
            transition: 'all var(--transition-fast)',
          }}
          title="Open AI Assistant"
        >
          <Bot size={17} />
          <span>Ask AI</span>
          <span
            className="pulse-dot"
            style={{ width: '6px', height: '6px', backgroundColor: '#34D399' }}
          />
        </button>
      )}

      {/* Interactive AI Chatbot Drawer */}
      <ChatBotDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Global Toast Container */}
      <ToastContainer />
    </div>
  );
};