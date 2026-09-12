'use client';
import React, { useState } from 'react';
import { X, Bot, Mail, Send } from 'lucide-react';
import { api } from '@/lib/api';

export function SupportModal({ isOpen, onClose, openAiChat }: { isOpen: boolean, onClose: () => void, openAiChat: () => void }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDirectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      // We can just create a ticket directly with [HANDOFF] or create a special direct endpoint, 
      // but creating a normal ticket is fine. Admin will see it.
      await api.post('/support/tickets', {
        subject: subject,
        message: message + '\n\n[DIRECT TO ADMIN]'
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    } catch (e) {
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-5 border-b border-zinc-200">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-wide">Customer Support</h2>
            <p className="text-xs text-zinc-500 mt-1">How would you like to resolve your query?</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-black transition-colors"><X className="w-6 h-6"/></button>
        </div>

        {success ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 uppercase tracking-wide mb-2">Message Sent</h3>
            <p className="text-zinc-500">Your query has been sent directly to the Admin/PM team. You will be notified when they reply.</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row h-full">
            {/* Option 1: AI Chat */}
            <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-zinc-200 hover:bg-zinc-50 transition-colors flex flex-col items-center text-center justify-center cursor-pointer group" onClick={() => { onClose(); openAiChat(); }}>
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bot className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="font-bold text-zinc-900 uppercase tracking-wide mb-2">AYRIX AI Engine</h3>
              <p className="text-xs text-zinc-500">Get instant answers about fit, sizing, delivery, and returns 24/7.</p>
              <span className="mt-6 text-[10px] font-bold text-indigo-600 uppercase tracking-wider border border-indigo-200 px-4 py-2 rounded">Start Chat</span>
            </div>

            {/* Option 2: Direct Form */}
            <div className="flex-1 p-8 bg-zinc-50/50">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-zinc-600" />
                <h3 className="font-bold text-zinc-900 uppercase tracking-wide text-sm">Contact PM / Admin</h3>
              </div>
              <form onSubmit={handleDirectSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Subject</label>
                  <input required value={subject} onChange={e=>setSubject(e.target.value)} type="text" className="w-full border border-zinc-300 rounded p-2 text-sm focus:border-black focus:outline-none" placeholder="What is this regarding?" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">Message</label>
                  <textarea required value={message} onChange={e=>setMessage(e.target.value)} rows={4} className="w-full border border-zinc-300 rounded p-2 text-sm focus:border-black focus:outline-none resize-none" placeholder="Describe your issue in detail..." />
                </div>
                <button disabled={sending} type="submit" className="w-full bg-black text-white font-bold py-3 rounded text-xs uppercase tracking-wider hover:bg-zinc-800 disabled:opacity-50 flex items-center justify-center gap-2">
                  {sending ? 'Sending...' : <><Send className="w-4 h-4"/> Submit Ticket</>}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
