'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Send, User, Bot, CheckCircle2 } from 'lucide-react';

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get<any>('/support/tickets');
      setTickets(res.tickets);
    } catch (e) {}
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    
    try {
      await api.post(`/support/tickets/${selectedTicket._id}/reply`, { message: replyText });
      setReplyText('');
      fetchTickets();
      // Update local state for immediate feedback
      setSelectedTicket({
        ...selectedTicket,
        messages: [...selectedTicket.messages, { message: replyText, isAI: false, sender: 'me' }]
      });
    } catch (e) {}
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight uppercase">Support Inbox</h1>
        <p className="text-sm text-zinc-500 font-medium mt-1">Manage customer queries and feedback</p>
      </div>
      
      <div className="flex bg-white border border-zinc-200 rounded-lg shadow-sm h-[600px] overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-zinc-200 overflow-y-auto">
          {tickets.map(t => (
            <div 
              key={t._id} 
              onClick={() => setSelectedTicket(t)}
              className={`p-4 border-b border-zinc-100 cursor-pointer transition-colors ${selectedTicket?._id === t._id ? 'bg-zinc-50' : 'hover:bg-zinc-50/50'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-sm text-zinc-900">{t.customer?.name || 'Customer'}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${t.status === 'open' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {t.status}
                </span>
              </div>
              <p className="text-xs text-zinc-600 font-medium truncate">{t.subject}</p>
              <p className="text-[10px] text-zinc-400 mt-2">{new Date(t.updatedAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
        
        {/* Chat Area */}
        <div className="w-2/3 flex flex-col">
          {selectedTicket ? (
            <>
              <div className="p-4 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="font-bold text-zinc-900">{selectedTicket.customer?.name}</h3>
                  <p className="text-xs text-zinc-500">{selectedTicket.customer?.email}</p>
                </div>
                {selectedTicket.status === 'resolved' && (
                  <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" /> Resolved (Score: {selectedTicket.feedbackScore}/5)
                  </div>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                {selectedTicket.messages.map((msg: any, i: number) => {
                  const isCustomer = msg.sender && msg.sender !== 'me' && typeof msg.sender === 'object';
                  const isSystem = msg.isAI || msg.sender === null;
                  
                  return (
                    <div key={i} className={`flex ${!isCustomer && !isSystem ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-3 rounded-lg text-sm ${!isCustomer && !isSystem ? 'bg-black text-white rounded-br-none' : (isSystem ? 'bg-indigo-50 border border-indigo-100 text-indigo-900 rounded-bl-none' : 'bg-zinc-100 text-zinc-900 rounded-bl-none')}`}>
                         <div className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1 flex items-center gap-1">
                           {isCustomer ? <User className="w-3 h-3" /> : (isSystem ? <Bot className="w-3 h-3" /> : 'You')}
                           {isCustomer ? 'Customer' : (isSystem ? 'AYRIX AI' : '')}
                         </div>
                         <div className="whitespace-pre-wrap">{msg.message}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="p-4 bg-zinc-50 border-t border-zinc-200 shrink-0">
                <form onSubmit={handleReply} className="flex gap-2">
                  <input 
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Reply to customer..."
                    className="flex-1 px-4 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:border-black"
                  />
                  <button type="submit" disabled={!replyText.trim()} className="bg-black text-white px-4 py-2 rounded-lg hover:bg-zinc-800 disabled:opacity-50">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-400 text-sm font-medium">
              Select a ticket to view conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
