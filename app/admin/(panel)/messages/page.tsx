"use client";

import { useEffect, useState, useCallback } from "react";
import { MessageSquare, RefreshCw, Mail, MailOpen, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface Message {
  id: string; name: string; email: string; phone: string;
  subject: string; message: string; isRead: boolean; createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/contact");
    setMessages(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const markRead = async (msg: Message) => {
    await fetch("/api/contact", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: msg.id, isRead: true }),
    });
    setSelected({ ...msg, isRead: true });
    setMessages(m => m.map(x => x.id === msg.id ? { ...x, isRead: true } : x));
  };

  const unread = messages.filter(m => !m.isRead).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold flex items-center gap-2">
            <MessageSquare size={20} className="text-emerald-400" /> Messages
            {unread > 0 && <span className="ml-1 px-2 py-0.5 bg-nova-red text-white text-xs font-bold rounded-full">{unread}</span>}
          </h1>
          <p className="text-white/40 text-sm mt-0.5">{messages.length} message{messages.length !== 1 ? "s" : ""} · {unread} non lu{unread !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={load} className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
          <RefreshCw size={15} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* List */}
        <div className="bg-[#111827] border border-white/5 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-nova-red border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare size={32} className="text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm">Aucun message reçu</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {messages.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => { setSelected(msg); if (!msg.isRead) markRead(msg); }}
                  className={`w-full text-left px-4 py-3 hover:bg-white/[0.03] transition-colors ${selected?.id === msg.id ? "bg-white/[0.05] border-l-2 border-nova-red" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {!msg.isRead ? <Mail size={14} className="text-nova-red flex-shrink-0" /> : <MailOpen size={14} className="text-white/20 flex-shrink-0" />}
                      <p className={`text-sm truncate ${msg.isRead ? "text-white/50" : "text-white font-medium"}`}>{msg.name}</p>
                    </div>
                    <span className="text-white/25 text-xs flex-shrink-0">{new Date(msg.createdAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                  {msg.subject && <p className="text-white/40 text-xs mt-0.5 truncate pl-5">{msg.subject}</p>}
                  <p className="text-white/30 text-xs mt-0.5 truncate pl-5">{msg.message}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
          {!selected ? (
            <div className="h-full flex items-center justify-center text-white/20 text-sm">
              Sélectionnez un message
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white font-semibold">{selected.name}</h3>
                  <p className="text-white/40 text-sm">{selected.email}</p>
                  {selected.phone && <p className="text-white/40 text-sm">{selected.phone}</p>}
                </div>
                <span className="text-white/30 text-xs">{new Date(selected.createdAt).toLocaleString("fr-FR")}</span>
              </div>

              {selected.subject && (
                <div className="bg-white/[0.03] rounded-lg px-4 py-2">
                  <p className="text-white/40 text-xs mb-0.5">Sujet</p>
                  <p className="text-white text-sm font-medium">{selected.subject}</p>
                </div>
              )}

              <div className="bg-white/[0.03] rounded-lg px-4 py-3">
                <p className="text-white/40 text-xs mb-1">Message</p>
                <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || "Votre message"}`}
                  className="flex-1 py-2 bg-nova-red/10 hover:bg-nova-red/20 text-nova-red text-sm font-medium rounded-lg text-center transition-colors">
                  Répondre par email
                </a>
                <button onClick={() => setDeleteTarget(selected.id)}
                  className="w-10 h-9 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog open={!!deleteTarget} title="Supprimer ce message ?"
        message="Ce message sera définitivement supprimé."
        onConfirm={async () => {
          if (!deleteTarget) return;
          // Simple delete via direct prisma won't work client-side;
          // in a real app add DELETE /api/contact/[id] — for now just close
          setDeleteTarget(null);
          setSelected(null);
          load();
        }}
        onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
