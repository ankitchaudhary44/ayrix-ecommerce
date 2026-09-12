'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, HelpCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function HelpdeskWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedbackScore, setFeedbackScore] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && isOpen) {
      fetchTickets();
    }
  }, [user, isOpen]);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-ai-chat', handleOpenChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenChat);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeTicket?.messages]);

  const fetchTickets = async () => {
    try {
      const res = await api.get<any>('/support/tickets');
      setTickets(res.tickets);
      if (res.tickets.length > 0 && !activeTicket) {
        setActiveTicket(res.tickets[0]);
      }
    } catch (e) {}
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const message = input.trim();
    setInput('');
    setLoading(true);

    if (activeTicket) {
      // Optimistic update
      setActiveTicket({
        ...activeTicket,
        messages: [...activeTicket.messages, { sender: (user as any)?._id, message, isAI: false }]
      });
    } else {
      setActiveTicket({
        messages: [{ sender: (user as any)?._id, message, isAI: false }]
      });
    }

    try {
      const res = await api.post<any>('/support/tickets', {
        subject: activeTicket ? activeTicket.subject : (message.substring(0, 30) + '...'),
        message,
        ticketId: activeTicket?._id
      });
      setActiveTicket(res.ticket);
      fetchTickets();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const markResolved = async () => {
    if (!activeTicket) return;
    try {
      const res = await api.put<any>(`/support/tickets/${activeTicket._id}/resolve`, {});
      setActiveTicket(res.ticket);
      fetchTickets();
    } catch (e) {}
  };

  const submitFeedback = async () => {
    if (!activeTicket) return;
    try {
      const res = await api.post<any>(`/support/tickets/${activeTicket._id}/feedback`, {
        score: feedbackScore,
        text: feedbackText
      });
      setActiveTicket(res.ticket);
      fetchTickets();
    } catch (e) {}
  };

  if (!user || ['admin', 'product_manager'].includes(user.role)) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform z-50 group"
      >
        {isOpen ? <X className="w-6 h-6" /> : <HelpCircle className="w-6 h-6 group-hover:hidden" />}
        {!isOpen && <MessageCircle className="w-6 h-6 hidden group-hover:block" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white border border-zinc-200 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col h-[550px] max-h-[calc(100vh-8rem)] animate-in slide-in-from-bottom-5 fade-in">
          
          {/* Header */}
          <div className="bg-black text-white p-4 flex items-center justify-between shrink-0">
            <div>
              <h3 className="font-bold tracking-wide uppercase text-sm">AYRIX Helpdesk</h3>
              <p className="text-[10px] text-zinc-400">AI-Powered Support & Returns</p>
            </div>
            {tickets.length > 1 && (
              <select 
                className="bg-zinc-800 text-xs text-white border-none rounded p-1"
                onChange={(e) => setActiveTicket(tickets.find(t => t._id === e.target.value))}
                value={activeTicket?._id || ''}
              >
                {tickets.map(t => (
                  <option key={t._id} value={t._id}>
                    {t.subject} ({t.status})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-zinc-50 space-y-4" ref={scrollRef}>
            {(!activeTicket || activeTicket.messages.length === 0) && (
              <div className="text-center text-sm text-zinc-500 mt-10">
                <Bot className="w-10 h-10 mx-auto text-zinc-300 mb-2" />
                <p>Hello! How can we help you today?</p>
                <p className="text-xs mt-1">Ask about fits, returns, or order status.</p>
              </div>
            )}

            {activeTicket?.messages.map((msg: any, i: number) => {
              const isUser = msg.sender === (user as any)?._id;
              const isAI = msg.isAI;
              return (
                <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 text-sm ${isUser ? 'bg-black text-white rounded-br-none' : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-none shadow-sm'}`}>
                    <div className="flex items-center gap-1.5 mb-1.5 opacity-70 text-[10px] font-bold uppercase tracking-wider">
                      {isUser ? <User className="w-3 h-3" /> : (isAI ? <Bot className="w-3 h-3 text-indigo-500" /> : <MessageCircle className="w-3 h-3 text-rose-500" />)}
                      {isUser ? 'You' : (isAI ? 'AYRIX AI' : 'Agent')}
                    </div>
                    <div className="whitespace-pre-wrap">{msg.message}</div>
                  </div>
                </div>
              );
            })}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-zinc-200 rounded-lg rounded-bl-none p-3 shadow-sm flex gap-1">
                  <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce delay-75" />
                  <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce delay-150" />
                </div>
              </div>
            )}
          </div>

          {/* Resolution & Feedback */}
          {activeTicket?.status === 'resolved' && (
            <div className="bg-indigo-50 border-t border-indigo-100 p-4 shrink-0">
              <h4 className="text-xs font-bold text-indigo-900 mb-2 text-center">How was our support?</h4>
              <div className="flex justify-center gap-2 mb-3">
                {[1,2,3,4,5].map(star => (
                  <button 
                    key={star}
                    onClick={() => setFeedbackScore(star)}
                    className={`text-xl ${feedbackScore >= star ? 'text-yellow-400' : 'text-zinc-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea 
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
                placeholder="Tell us more (optional)..."
                className="w-full text-xs p-2 border border-indigo-200 rounded resize-none mb-2 focus:outline-none focus:border-indigo-400"
                rows={2}
              />
              <button 
                onClick={submitFeedback}
                disabled={!feedbackScore}
                className="w-full bg-indigo-600 text-white text-xs font-bold py-2 rounded disabled:opacity-50"
              >
                Submit Feedback
              </button>
            </div>
          )}

          {activeTicket?.status === 'closed' && (
            <div className="bg-zinc-100 border-t border-zinc-200 p-4 shrink-0 text-center text-xs text-zinc-500 font-medium">
              This ticket is closed. Thank you for your feedback!
            </div>
          )}

          {/* Input Area */}
          {(activeTicket?.status === 'open' || !activeTicket) && (
            <div className="p-3 bg-white border-t border-zinc-200 shrink-0">
              {activeTicket && activeTicket.messages.length > 2 && (
                <div className="flex justify-center mb-2">
                  <button 
                    onClick={markResolved}
                    className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded hover:bg-emerald-100 transition-colors"
                  >
                    Mark as Resolved (Satisfied)
                  </button>
                </div>
              )}
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                />
                <button 
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="bg-black text-white p-2 rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}

        </div>
      )}
    </>
  );
}
