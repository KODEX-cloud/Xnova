"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Trash2, MessageSquare, CreditCard, Star, Settings, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface Notification {
  id: string; type: string; title: string; body: string | null;
  link: string | null; isRead: boolean; createdAt: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  MESSAGE:      <MessageSquare size={16} className="text-blue-500" />,
  PAYMENT:      <CreditCard size={16} className="text-green-500" />,
  SUBSCRIPTION: <Star size={16} className="text-amber-500" />,
  LISTING:      <FileText size={16} className="text-purple-500" />,
  SYSTEM:       <Settings size={16} className="text-gray-500" />,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/notifications").then(r => r.json()).then(d => { setNotifications(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const markAll = async () => {
    await fetch("/api/user/notifications", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markOne = async (id: string) => {
    await fetch("/api/user/notifications", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: [id] }) });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Notifications</h1>
          <p className="text-gray-500 text-sm mt-0.5">{unread > 0 ? `${unread} non lue${unread > 1 ? "s" : ""}` : "Tout est à jour"}</p>
        </div>
        {unread > 0 && (
          <button onClick={markAll} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors">
            <Check size={14} /> Tout marquer comme lu
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-nova-red/20 border-t-nova-red rounded-full animate-spin" /></div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-12 text-center">
          <Bell size={40} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-gray-900 font-bold text-lg mb-2">Aucune notification</h2>
          <p className="text-gray-500 text-sm">Vous serez notifié des nouvelles activités ici.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} onClick={() => !n.isRead && markOne(n.id)}
              className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${n.isRead ? "bg-white border-gray-100" : "bg-blue-50/50 border-blue-100"}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${n.isRead ? "bg-gray-100" : "bg-white shadow-sm"}`}>
                {ICON_MAP[n.type] ?? ICON_MAP.SYSTEM}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${n.isRead ? "text-gray-700 font-medium" : "text-gray-900 font-bold"}`}>{n.title}</p>
                {n.body && <p className="text-gray-500 text-xs mt-0.5">{n.body}</p>}
                <p className="text-gray-400 text-xs mt-1">{formatDate(n.createdAt)}</p>
              </div>
              {n.link && (
                <Link href={n.link} onClick={e => e.stopPropagation()} className="text-nova-red text-xs font-medium hover:underline flex-shrink-0">
                  Voir →
                </Link>
              )}
              {!n.isRead && <div className="w-2 h-2 rounded-full bg-nova-red flex-shrink-0 mt-1.5" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
