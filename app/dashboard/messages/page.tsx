"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Send, User, ArrowLeft, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { formatDate } from "@/lib/utils";

interface Message {
  id: string; body: string; subject: string | null; isRead: boolean; createdAt: string;
  threadId: string | null;
  sender: { id: string; name: string | null; avatar: string | null; email: string };
  receiver: { id: string; name: string | null; avatar: string | null; email: string };
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const userId = (session?.user as any)?.id;

  useEffect(() => {
    fetch("/api/messages").then(r => r.json()).then(d => { setMessages(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const sendReply = async (receiverId: string, threadId: string | null) => {
    if (!reply.trim()) return;
    setSending(true);
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId, body: reply, threadId }),
    });
    if (res.ok) {
      const msg = await res.json();
      setMessages(prev => [{ ...msg, sender: { id: userId, name: (session?.user as any)?.name || "", avatar: (session?.user as any)?.image || null, email: (session?.user as any)?.email || "" }, receiver: { id: receiverId, name: "", avatar: null, email: "" } }, ...prev]);
      setReply("");
    }
    setSending(false);
  };

  const selectedMsg = messages.find(m => m.id === selected);
  const otherUserId = selectedMsg ? (selectedMsg.sender.id === userId ? selectedMsg.receiver.id : selectedMsg.sender.id) : null;
  const otherUser = selectedMsg ? (selectedMsg.sender.id === userId ? selectedMsg.receiver : selectedMsg.sender) : null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Messages</h1>
        <p className="text-gray-500 text-sm mt-0.5">{messages.filter(m => !m.isRead && m.receiver.id === userId).length} non lu{messages.filter(m => !m.isRead && m.receiver.id === userId).length > 1 ? "s" : ""}</p>
      </div>

      <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden" style={{ minHeight: 480 }}>
        {loading ? (
          <div className="flex justify-center items-center h-60"><div className="w-8 h-8 border-2 border-nova-red/20 border-t-nova-red rounded-full animate-spin" /></div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare size={40} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-gray-900 font-bold mb-2">Aucun message</h2>
            <p className="text-gray-500 text-sm">Vos conversations avec les acheteurs, vendeurs et l'équipe NOVA apparaîtront ici.</p>
          </div>
        ) : selected ? (
          <div className="flex flex-col h-full">
            {/* Thread header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"><ArrowLeft size={14} /></button>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                {otherUser?.avatar ? <img src={otherUser.avatar} className="w-full h-full rounded-full object-cover" alt="" /> : <User size={14} className="text-gray-500" />}
              </div>
              <div>
                <p className="text-gray-900 font-semibold text-sm">{otherUser?.name || otherUser?.email}</p>
              </div>
            </div>
            {/* Message body */}
            <div className="flex-1 p-4">
              <div className={`max-w-xs p-3 rounded-2xl text-sm ${selectedMsg?.sender.id === userId ? "bg-nova-red text-white ml-auto" : "bg-gray-100 text-gray-800"}`}>
                {selectedMsg?.body}
                <p className={`text-[10px] mt-1 ${selectedMsg?.sender.id === userId ? "text-white/60" : "text-gray-400"}`}>{formatDate(selectedMsg?.createdAt || "")}</p>
              </div>
            </div>
            {/* Reply box */}
            <div className="p-4 border-t border-gray-100 flex gap-2">
              <input value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendReply(otherUserId!, selectedMsg?.threadId || null)}
                placeholder="Votre réponse..." className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-nova-red/50" />
              <button onClick={() => sendReply(otherUserId!, selectedMsg?.threadId || null)} disabled={sending || !reply.trim()}
                className="w-10 h-10 rounded-xl bg-nova-red text-white flex items-center justify-center hover:bg-nova-red/90 disabled:opacity-50 transition-colors">
                {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {messages.map(m => {
              const isOwn = m.sender.id === userId;
              const other = isOwn ? m.receiver : m.sender;
              return (
                <button key={m.id} onClick={() => setSelected(m.id)} className={`w-full flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors text-left ${!m.isRead && !isOwn ? "bg-blue-50/30" : ""}`}>
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    {other.avatar ? <img src={other.avatar} className="w-full h-full rounded-full object-cover" alt="" /> : <User size={16} className="text-gray-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm ${!m.isRead && !isOwn ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>{other.name || other.email}</p>
                      <span className="text-gray-300 text-xs ml-auto">{formatDate(m.createdAt)}</span>
                    </div>
                    <p className={`text-xs mt-0.5 truncate ${!m.isRead && !isOwn ? "text-gray-800" : "text-gray-500"}`}>{m.body}</p>
                  </div>
                  {!m.isRead && !isOwn && <div className="w-2 h-2 rounded-full bg-nova-red flex-shrink-0 mt-2" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
