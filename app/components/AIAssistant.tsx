'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, MapPin, AlertTriangle, CheckCircle, Clock, TrendingUp, X } from 'lucide-react';
import type { Issue } from '../types/Issue';
import './AIAssistant.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  issues: Issue[];
  onViewChange: (view: string) => void;
}

// Simple rule-based AI response engine
function generateAIResponse(userMessage: string, issues: Issue[]): string {
  const msg = userMessage.toLowerCase().trim();

  const open = issues.filter(i => i.status === 'open').length;
  const inProgress = issues.filter(i => i.status === 'in-progress').length;
  const resolved = issues.filter(i => i.status === 'resolved').length;
  const urgent = issues.filter(i => i.priority === 'urgent' || i.priority === 'high').length;

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('namaste')) {
    return `Namaste! 🙏 I'm your Civic AI Assistant for Jansankalp. I can help you with:\n\n• 📊 Checking issue statistics\n• 🔍 Finding specific types of issues\n• 💡 Tips on reporting civic problems\n• 📍 Understanding issue categories\n• 🏆 Leaderboard information\n\nHow can I assist you today?`;
  }

  if (msg.includes('status') || msg.includes('summary') || msg.includes('overview')) {
    return `📊 **Current Issue Overview:**\n\n` +
      `• 🔴 Open Issues: **${open}**\n` +
      `• 🟡 In Progress: **${inProgress}**\n` +
      `• 🟢 Resolved: **${resolved}**\n` +
      `• ⚠️ Urgent/High Priority: **${urgent}**\n` +
      `• 📁 Total Issues: **${issues.length}**\n\n` +
      `Resolution rate: **${issues.length > 0 ? Math.round((resolved / issues.length) * 100) : 0}%**`;
  }

  if (msg.includes('urgent') || msg.includes('emergency') || msg.includes('critical')) {
    const urgentIssues = issues.filter(i => i.priority === 'urgent' || i.priority === 'high');
    if (urgentIssues.length === 0) {
      return `✅ Great news! There are currently no urgent or high-priority issues. The community is in good shape!`;
    }
    return `⚠️ **${urgentIssues.length} Urgent/High Priority Issues:**\n\n` +
      urgentIssues.slice(0, 3).map(i => `• **${i.title}** — ${i.location}`).join('\n') +
      (urgentIssues.length > 3 ? `\n• ...and ${urgentIssues.length - 3} more` : '') +
      `\n\nPlease visit the Admin Dashboard to address these promptly.`;
  }

  if (msg.includes('road') || msg.includes('pothole') || msg.includes('transport')) {
    const roadIssues = issues.filter(i => i.category.toLowerCase().includes('road') || i.category.toLowerCase().includes('transport'));
    return `🚗 **Road & Transportation Issues:**\n\n` +
      (roadIssues.length > 0
        ? roadIssues.map(i => `• **${i.title}** (${i.status}) — 👍 ${i.votes} votes`).join('\n')
        : `No road issues reported currently.`) +
      `\n\n💡 Tip: Road issues with many votes get prioritized faster. Encourage neighbors to vote!`;
  }

  if (msg.includes('water') || msg.includes('utility') || msg.includes('electricity') || msg.includes('light')) {
    const utilityIssues = issues.filter(i =>
      i.category.toLowerCase().includes('util') ||
      i.category.toLowerCase().includes('light') ||
      i.category.toLowerCase().includes('electric')
    );
    return `💡 **Utility Issues:**\n\n` +
      (utilityIssues.length > 0
        ? utilityIssues.map(i => `• **${i.title}** (${i.status}) — ${i.location}`).join('\n')
        : `No utility issues found.`) +
      `\n\nFor emergencies involving electricity, always call 1912 (Power emergency helpline).`;
  }

  if (msg.includes('waste') || msg.includes('garbage') || msg.includes('trash') || msg.includes('sanitation')) {
    const wasteIssues = issues.filter(i => i.category.toLowerCase().includes('waste'));
    return `🗑️ **Waste Management Issues:**\n\n` +
      (wasteIssues.length > 0
        ? wasteIssues.map(i => `• **${i.title}** (${i.status}) — 👍 ${i.votes} votes`).join('\n')
        : `No waste management issues currently.`) +
      `\n\n📞 MCD Helpline: 1800-11-0007 (Toll Free)\n💡 Report overflowing bins with photos for faster response!`;
  }

  if (msg.includes('report') || msg.includes('how to') || msg.includes('submit')) {
    return `📝 **How to Report a Civic Issue:**\n\n` +
      `1. Click **"Report Issue"** in the navigation\n` +
      `2. Fill in the **title** and **description** clearly\n` +
      `3. Select the appropriate **category**\n` +
      `4. Set the **priority level** (Low/Medium/High)\n` +
      `5. Add the exact **location** (street, landmark)\n` +
      `6. Upload a **photo** if available\n` +
      `7. Add your **contact info** for follow-ups\n\n` +
      `📌 Tips for effective reports:\n• Be specific about location\n• Describe safety risks clearly\n• For emergencies, call **100** immediately`;
  }

  if (msg.includes('category') || msg.includes('type') || msg.includes('kinds')) {
    return `📂 **Issue Categories Available:**\n\n` +
      `🚗 **Roads & Transportation** — Potholes, road damage, traffic signals\n` +
      `🔒 **Public Safety** — Unsafe areas, lighting, crime concerns\n` +
      `🏛️ **Public Property** — Damaged benches, broken railings, vandalism\n` +
      `🗑️ **Waste Management** — Garbage, illegal dumping, overflowing bins\n` +
      `🌳 **Parks & Recreation** — Overgrown plants, damaged equipment\n` +
      `💡 **Utilities** — Water leaks, power outages, sewage\n` +
      `📋 **Other** — Anything that doesn't fit above\n\n` +
      `Choosing the right category ensures faster resolution!`;
  }

  if (msg.includes('leaderboard') || msg.includes('top') || msg.includes('best') || msg.includes('citizen')) {
    const reporterCount: Record<string, number> = {};
    issues.forEach(i => {
      reporterCount[i.reportedBy] = (reporterCount[i.reportedBy] || 0) + 1;
    });
    const topReporters = Object.entries(reporterCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return `🏆 **Top Community Contributors:**\n\n` +
      topReporters.map(([name, count], idx) =>
        `${['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][idx]} **${name}** — ${count} issue${count > 1 ? 's' : ''} reported`
      ).join('\n') +
      `\n\nVisit the **Leaderboard** page for full rankings and civic points!`;
  }

  if (msg.includes('helpline') || msg.includes('contact') || msg.includes('number') || msg.includes('phone')) {
    return `📞 **Important Civic Helplines:**\n\n` +
      `🚨 Police Emergency: **100**\n` +
      `🔥 Fire Emergency: **101**\n` +
      `🚑 Ambulance: **102** / **108**\n` +
      `💧 Water (Delhi Jal Board): **1916**\n` +
      `⚡ Electricity Emergency: **1912**\n` +
      `🏙️ MCD (Municipal): **1800-11-0007**\n` +
      `🛣️ PWD Helpline: **1800-11-8888**\n` +
      `📱 National Civic Grievance: **1800-11-0001**\n\n` +
      `For non-emergency issues, use Jansankalp to report and track!`;
  }

  if (msg.includes('vote') || msg.includes('upvote') || msg.includes('support')) {
    return `👍 **About Voting on Issues:**\n\n` +
      `Voting helps prioritize issues! Here's how it works:\n\n` +
      `• Click the 👍 button on any issue card\n` +
      `• Issues with **more votes** get **higher priority**\n` +
      `• Votes are counted toward your civic score\n` +
      `• Admin dashboard sorts by votes to identify critical issues\n\n` +
      `The most voted issue right now: **"${issues.sort((a, b) => b.votes - a.votes)[0]?.title || 'None'}"** with ${issues.sort((a, b) => b.votes - a.votes)[0]?.votes || 0} votes!`;
  }

  if (msg.includes('resolved') || msg.includes('fixed') || msg.includes('done')) {
    const resolvedIssues = issues.filter(i => i.status === 'resolved');
    return `✅ **${resolvedIssues.length} Issues Successfully Resolved:**\n\n` +
      (resolvedIssues.length > 0
        ? resolvedIssues.slice(0, 4).map(i => `• **${i.title}** — Reported by ${i.reportedBy}`).join('\n')
        : `No issues resolved yet. Let's work together to fix our community!`) +
      `\n\n🙏 Thank you to all the citizens who reported and followed up!`;
  }

  // Default response
  return `🤔 I'm not sure about that specific query. Here are things I can help with:\n\n` +
    `• Type **"summary"** for an issue overview\n` +
    `• Type **"urgent"** for high-priority issues\n` +
    `• Type **"how to report"** for reporting guide\n` +
    `• Type **"helplines"** for emergency contacts\n` +
    `• Type **"categories"** to learn issue types\n` +
    `• Type **"leaderboard"** for top contributors\n\n` +
    `You can also ask about: roads, water, waste, lights, or any civic topic!`;
}

const QUICK_PROMPTS = [
  "Show issue summary",
  "Any urgent issues?",
  "How to report an issue?",
  "Show helpline numbers",
  "Top contributors",
  "Show resolved issues",
];

export function AIAssistant({ issues, onViewChange }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Namaste! 🙏 I'm your Civic AI Assistant for **Jansankalp**.\n\nI can help you understand civic issues in your area, guide you on reporting, provide statistics, and answer questions about community problems.\n\nWhat would you like to know?`,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(messageText, issues),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      const boldFormatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <p key={i} dangerouslySetInnerHTML={{ __html: boldFormatted }} />;
    });
  };

  return (
    <div className="ai-assistant">
      <div className="assistant-header">
        <div className="assistant-title">
          <div className="assistant-icon-wrapper">
            <Bot className="assistant-icon" />
            <div className="online-dot" />
          </div>
          <div>
            <h1>Civic AI Assistant</h1>
            <p>Powered by Jansankalp Intelligence</p>
          </div>
        </div>
        <div className="assistant-stats">
          <div className="stat-pill">
            <AlertTriangle size={14} />
            <span>{issues.filter(i => i.status === 'open').length} Open</span>
          </div>
          <div className="stat-pill success">
            <CheckCircle size={14} />
            <span>{issues.filter(i => i.status === 'resolved').length} Resolved</span>
          </div>
          <div className="stat-pill warning">
            <Clock size={14} />
            <span>{issues.filter(i => i.status === 'in-progress').length} In Progress</span>
          </div>
        </div>
      </div>

      <div className="chat-container">
        <div className="messages-area">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="message-avatar">
                  <Bot size={16} />
                </div>
              )}
              <div className="message-bubble">
                <div className="message-content">
                  {formatContent(msg.content)}
                </div>
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message assistant">
              <div className="message-avatar">
                <Bot size={16} />
              </div>
              <div className="message-bubble">
                <div className="typing-indicator">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="quick-prompts">
          <Sparkles size={14} className="sparkle-icon" />
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              className="quick-prompt-btn"
              onClick={() => handleSend(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="input-area">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about civic issues, report status, helplines..."
            rows={2}
            className="chat-input"
          />
          <button
            className="send-btn"
            onClick={() => handleSend()}
            disabled={!inputValue.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
