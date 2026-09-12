'use client';

import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  link: string;
  createdAt: string;
}

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Check every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get<{ notifications: Notification[], unreadCount: number }>('/notifications');
      setNotifications(res.notifications);
      setUnreadCount(res.unreadCount);
    } catch (e) {
      console.error(e);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`, {});
      fetchNotifications();
    } catch (e) {}
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all', {});
      fetchNotifications();
    } catch (e) {}
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col items-center gap-1 text-zinc-600 hover:text-black transition-colors relative"
      >
        <div className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold tracking-widest uppercase">Alerts</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-zinc-200 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="bg-zinc-50 border-b border-zinc-200 p-3 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllRead}
                className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-zinc-500">
                You have no notifications.
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {notifications.map(notif => (
                  <div 
                    key={notif._id} 
                    className={`p-3 transition-colors ${!notif.isRead ? 'bg-indigo-50/30' : 'hover:bg-zinc-50'}`}
                    onClick={() => {
                      if (!notif.isRead) markAsRead(notif._id);
                      setIsOpen(false);
                    }}
                  >
                    <Link href={notif.link || '#'} className="block">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={`text-xs font-bold ${!notif.isRead ? 'text-zinc-900' : 'text-zinc-700'}`}>
                          {notif.title}
                        </h4>
                        {!notif.isRead && <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1" />}
                      </div>
                      <p className="text-xs text-zinc-600 mb-1">{notif.message}</p>
                      <span className="text-[10px] text-zinc-400 font-medium">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
