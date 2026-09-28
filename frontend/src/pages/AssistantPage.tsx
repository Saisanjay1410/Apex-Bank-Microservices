import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RotateCcw, 
  HelpCircle, 
  Cpu, 
  CheckCircle2,
  Lightbulb
} from 'lucide-react';
import { chatApi } from '../api/chatApi';
import { useAuthStore } from '../store/useAuthStore';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import type { ChatMessage } from '../types';

const SUGGESTED_QUESTIONS = [
  'What are the active microservice ports and endpoints?',
  'How do I deposit funds or initiate a transfer?',
  'Explain how payroll communicates with Kafka.',
  'How can an Admin create a new HR user account?',
  'What is the structure of the JWT auth token?',
];

export const AssistantPage: React.FC = () => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hello ${user?.username || 'there'}! I am your Apex AI Financial Assistant. How can I assist you with your banking operations, accounts, or liquidity analysis today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!messageText) setInput('');
    setIsTyping(true);

    try {
      const response = await chatApi.sendMessage({
        message: text.trim(),
        userId: user?.username || 'executive-user',
      });

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'bot',
        text: 'Unable to communicate with the AI Chatbot service. Switched to offline assistant knowledge base.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
              AI Financial Assistant
            </h1>
            <Badge variant="cyan" dot>
              Apex AI Advisor
            </Badge>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Query banking operations, account rules, payroll events, and microservice status
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            setMessages([
              {
                id: 'welcome-reset',
                sender: 'bot',
                text: 'Conversation thread refreshed. What can I assist you with?',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ])
          }
          leftIcon={<RotateCcw size={14} />}
        >
          Reset Conversation
        </Button>
      </div>

      {/* Main Chat Interface */}
      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        {/* Messages Stream */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            background: 'var(--bg-primary)',
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: '0.875rem',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  background:
                    msg.sender === 'user'
                      ? 'linear-gradient(135deg, #10B981, #059669)'
                      : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  boxShadow: 'var(--shadow-sm)',
                  flexShrink: 0,
                }}
              >
                {msg.sender === 'user' ? (user?.username?.charAt(0).toUpperCase() || 'U') : <Bot size={20} />}
              </div>

              {/* Message Bubble */}
              <div
                style={{
                  maxWidth: '75%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    padding: '0.875rem 1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor:
                      msg.sender === 'user'
                        ? 'var(--primary)'
                        : 'var(--bg-secondary)',
                    color: msg.sender === 'user' ? '#FFFFFF' : 'var(--text-primary)',
                    border: msg.sender === 'bot' ? '1px solid var(--border-color)' : 'none',
                    boxShadow: 'var(--shadow-md)',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.text}
                </div>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '4px', padding: '0 4px' }}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bot size={20} />
              </div>
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  gap: '5px',
                  alignItems: 'center',
                }}
              >
                <span className="pulse-dot" style={{ backgroundColor: 'var(--primary)' }} />
                <span className="pulse-dot" style={{ backgroundColor: 'var(--primary)', animationDelay: '0.2s' }} />
                <span className="pulse-dot" style={{ backgroundColor: 'var(--primary)', animationDelay: '0.4s' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Chips */}
        <div
          style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '4px' }}>
            <Lightbulb size={14} style={{ color: 'var(--accent-amber)' }} />
            <span>Suggested:</span>
          </div>
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isTyping}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={11} style={{ color: 'var(--accent-amber)' }} />
              {q}
            </button>
          ))}
        </div>

        {/* Text Input Row */}
        <div
          style={{
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Ask anything about your accounts, liquidity, or transactions..."
            className="form-control"
            style={{ fontSize: '0.9rem', padding: '0.75rem 1rem' }}
          />
          <Button
            variant="primary"
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            isLoading={isTyping}
            rightIcon={<Send size={16} />}
          >
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
};
