"use client";

import { useEffect, useState, useCallback } from "react";
import {
  MessageSquare, RefreshCw, Mail, MailOpen, Trash2, Send,
  Users, X, Loader2, User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactMsg {
  id: string; name: string; email: string; phone: string;
  subject: string; message: string; isRead: boolean; createdAt: string;
}

interface InternalMsg {
  id: string; body: string; subject: string | null; isRead: boolean; createdAt: string;
  sender:   { id: string; name: string | null; email: string; avatar: string | null };
  receiver: { id: string; name: string | null; email: string; avatar: string | null };
}

interface AppUser {
  id: string; name: string | null; email: string; avatar: string | null; role: string;
}

export default function MessagesPage() {
  const [tab, setTab] = useState<"contact" | "internal">("contact");

  // ── Contact messages ──────────────────────────────────────────────────────
  const [contacts, setContacts] = useState<ContactMsg[]>([]);
  const [selContact, setSelContact] = useState<ContactMsg | null>(null);
  const [loadingC, setLoadingC] = useState(true);

  const loadContacts = useCallback(async () => {
    setLoadingC(true);
    const res = await fetch("/api/contact");
    setContacts(await res.json());
    setLoadingC(false);
  }, []);

  useEffect(() => { loadContacts(); }, [loadContacts]);

  const markRead = async (msg: ContactMsg) => {
    await fetch("/api/contact", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: msg.id, isRead: true }) });
    setSelContact({ ...msg, isRead: true });
    setContacts(m => m.map(x => x.id === msg.id ? { ...x, isRead: true } : x));
  };

  // ── Internal messages ─────────────────────────────────────────────────────
  const [convos, setConvos] = useState<InternalMsg[]>([]);
  const [selUserId, setSelUserId] = useState<string | null>(null);
  const [thread, setThread] = useState<InternalMsg[]>([]);
  const [loadingI, setLoadingI] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  // Compose new
  const [composeOpen, setComposeOpen] = useState(false);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [composeUserId, setComposeUserId] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");

  const loadConvos = useCallback(async () => {
    setLoadingI(true);
    const res = await fetch("/api/admin/messages");
    setConvos(await res.json());
    setLoadingI(false);
  }, []);

  useEffect(() => {
    if (tab === "internal") loadConvos();
  }, [tab, loadConvos]);

  const openThread = async (userId: string) => {
    setSelUserId(userId);
    const res = await fetch(`/api/admin/messages?userId=${userId}`);
    setThread(await res.json());
    setConvos(prev => prev.map(m => {
      const partner = m.sender.id === userId ? m.sender : m.receiver;
      return partner.id === userId ? { ...m, isRead: true } : m;
    }));
  };

  const sendReply = async () => {
    if (!selUserId || !reply.trim()) return;
    setSending(true);
    const res = await fetch("/api/admin/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: selUserId, body: reply }),
    });
    const msg = await res.json();
    setThread(prev => [...prev, msg]);
    setReply("");
    setSending(false);
  };

  const openCompose = async () => {
    setComposeOpen(true);
    if (users.length === 0) {
      const res = await fetch("/api/users?limit=100");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : (data.users || []));
    }
  };

  const sendCompose = async () => {
    if (!composeUserId || !composeBody.trim()) return;
    setSending(true);
    await fetch("/api/admin/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: composeUserId, body: composeBody, subject: composeSubject }),
    });
    setComposeOpen(false);
    setComposeUserId(""); setComposeSubject(""); setComposeBody("");
    setSending(false);
    loadConvos();
  };

  const unreadC = contacts.filter(m => !m.isRead).length;
  const unreadI = convos.filter(m => !m.isRead).length;

  const selUser = selUserId ? (thread[0]?.sender.id === selUserId ? thread[0]?.sender : thread[0]?.receiver) : null;

  return (
    <div className="space-y-4">
      {/* Header + tabs */}
      <div className="flex items-center justify-between">
        <h1 className="text-white text-xl font-bold flex items-center gap-2">
          <MessageSquare size={20} className="text-emerald-400" /> Messages
        </h1>
        <div className="flex items-center gap-2">
          {tab === "internal" && (
            <button onClick={openCompose} className="flex items-center gap-2 px-3 py-1.5 text-xs bg-nova-red/10 text-nova-red border border-nova-red/20 rounded-lg hover:bg-nova-red/20 transition-colors">
              <Send size={12} /> Nouveau message
            </button>
          )}
          <button onClick={() => tab === "contact" ? loadContacts() : loadConvos()}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <div className="flex gap-1 bg-[#111827] border border-white/5 rounded-xl p-1 w-fit">
        <button onClick={() => setTab("contact")} className={cn("px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5", tab === "contact" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70")}>
          <Mail size={14} /> Contact {unreadC > 0 && <span className="text-[10px] bg-nova-red text-white px-1.5 py-0.5 rounded-full">{unreadC}</span>}
        </button>
        <button onClick={() => setTab("internal")} className={cn("px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5", tab === "internal" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70")}>
          <Users size={14} /> Interne {unreadI > 0 && <span className="text-[10px] bg-nova-red text-white px-1.5 py-0.5 rounded-full">{unreadI}</span>}
        </button>
      </div>

      {/* ── CONTACT tab ───────────────────────────────────────────────────── */}
      {tab === "contact" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[#111827] border border-white/5 rounded-xl overflow-hidden">
            {loadingC ? <div className="p-8 text-center"><Loader2 className="animate-spin text-white/30 mx-auto" /></div>
              : contacts.length === 0 ? <div className="p-12 text-center text-white/30 text-sm">Aucun message reçu</div>
              : <div className="divide-y divide-white/5">
                {contacts.map(msg => (
                  <button key={msg.id} onClick={() => { setSelContact(msg); if (!msg.isRead) markRead(msg); }}
                    className={cn("w-full text-left px-4 py-3 hover:bg-white/[0.03] transition-colors", selContact?.id === msg.id ? "bg-white/[0.05] border-l-2 border-nova-red" : "")}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {!msg.isRead ? <Mail size={13} className="text-nova-red flex-shrink-0" /> : <MailOpen size={13} className="text-white/20 flex-shrink-0" />}
                        <p className={cn("text-sm truncate", msg.isRead ? "text-white/50" : "text-white font-medium")}>{msg.name}</p>
                      </div>
                      <span className="text-white/25 text-xs flex-shrink-0">{new Date(msg.createdAt).toLocaleDateString("fr-FR")}</span>
                    </div>
                    {msg.subject && <p className="text-white/40 text-xs mt-0.5 truncate pl-5">{msg.subject}</p>}
                    <p className="text-white/30 text-xs mt-0.5 truncate pl-5">{msg.message}</p>
                  </button>
                ))}
              </div>}
          </div>
          <div className="bg-[#111827] border border-white/5 rounded-xl p-5 min-h-[300px]">
            {!selContact ? <div className="h-full flex items-center justify-center text-white/20 text-sm">Sélectionnez un message</div> : (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-semibold">{selContact.name}</h3>
                    <p className="text-white/40 text-sm">{selContact.email}</p>
                    {selContact.phone && <p className="text-white/40 text-sm">{selContact.phone}</p>}
                  </div>
                  <span className="text-white/30 text-xs">{new Date(selContact.createdAt).toLocaleString("fr-FR")}</span>
                </div>
                {selContact.subject && <div className="bg-white/[0.03] rounded-lg px-4 py-2"><p className="text-white/40 text-xs mb-0.5">Sujet</p><p className="text-white text-sm font-medium">{selContact.subject}</p></div>}
                <div className="bg-white/[0.03] rounded-lg px-4 py-3"><p className="text-white/40 text-xs mb-1">Message</p><p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{selContact.message}</p></div>
                <a href={`mailto:${selContact.email}?subject=Re: ${selContact.subject || "Votre message"}`}
                  className="flex items-center justify-center gap-2 py-2.5 bg-nova-red/10 hover:bg-nova-red/20 text-nova-red text-sm font-medium rounded-xl transition-colors">
                  <Mail size={14} /> Répondre par email
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── INTERNAL tab ──────────────────────────────────────────────────── */}
      {tab === "internal" && (
        <div className="flex gap-4 bg-[#111827] border border-white/5 rounded-xl overflow-hidden" style={{ minHeight: 500 }}>
          {/* Convos list */}
          <div className="w-64 flex-shrink-0 border-r border-white/5 flex flex-col">
            {loadingI ? <div className="p-8 text-center"><Loader2 className="animate-spin text-white/30 mx-auto" /></div>
              : convos.length === 0 ? <div className="p-8 text-center text-white/30 text-sm">Aucune conversation</div>
              : <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
                {convos.map(m => {
                  const other = m.sender.id === selUserId ? m.receiver : m.sender;
                  return (
                    <button key={m.id} onClick={() => openThread(other.id)}
                      className={cn("w-full text-left px-4 py-3 hover:bg-white/[0.03] transition-colors", selUserId === other.id ? "bg-white/5 border-l-2 border-nova-red" : "")}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {other.avatar ? <img src={other.avatar} className="w-full h-full object-cover" alt="" /> : <User size={14} className="text-white/40" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm truncate", !m.isRead ? "text-white font-medium" : "text-white/60")}>{other.name || other.email}</p>
                          <p className="text-white/30 text-xs truncate">{m.body.slice(0, 40)}</p>
                        </div>
                        {!m.isRead && <span className="w-2 h-2 rounded-full bg-nova-red flex-shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>}
          </div>

          {/* Thread */}
          <div className="flex-1 flex flex-col">
            {!selUserId ? (
              <div className="flex-1 flex items-center justify-center text-white/20 text-sm">Sélectionnez une conversation</div>
            ) : (
              <>
                <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <User size={14} className="text-white/40" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{selUser?.name || selUser?.email}</p>
                    <p className="text-white/30 text-xs">{selUser?.email}</p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {thread.map(m => {
                    const isAdmin = m.sender.id !== selUserId;
                    return (
                      <div key={m.id} className={cn("max-w-sm", isAdmin ? "ml-auto" : "")}>
                        <div className={cn("px-4 py-2.5 rounded-2xl text-sm", isAdmin ? "bg-nova-red text-white rounded-br-md" : "bg-white/[0.07] text-white/80 rounded-bl-md")}>
                          {m.body}
                        </div>
                        <p className={cn("text-[10px] mt-1 text-white/30", isAdmin ? "text-right" : "")}>{new Date(m.createdAt).toLocaleString("fr-FR")}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="px-4 py-3 border-t border-white/5 flex gap-2">
                  <input value={reply} onChange={e => setReply(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendReply()}
                    placeholder="Votre message..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/40" />
                  <button onClick={sendReply} disabled={sending || !reply.trim()}
                    className="w-10 h-10 rounded-xl bg-nova-red text-white flex items-center justify-center disabled:opacity-50 hover:bg-nova-red/90 transition-colors">
                    {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Compose modal ─────────────────────────────────────────────────── */}
      {composeOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold">Nouveau message</h3>
              <button onClick={() => setComposeOpen(false)} className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-white/40 text-xs mb-1 block">Destinataire</label>
                <select value={composeUserId} onChange={e => setComposeUserId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-nova-red/40 appearance-none">
                  <option value="">Choisir un utilisateur...</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name || u.email} ({u.role})</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/40 text-xs mb-1 block">Sujet (optionnel)</label>
                <input value={composeSubject} onChange={e => setComposeSubject(e.target.value)}
                  placeholder="Sujet du message"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-nova-red/40 placeholder-white/20" />
              </div>
              <div>
                <label className="text-white/40 text-xs mb-1 block">Message</label>
                <textarea value={composeBody} onChange={e => setComposeBody(e.target.value)} rows={5}
                  placeholder="Votre message..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-nova-red/40 placeholder-white/20 resize-none" />
              </div>
              <button onClick={sendCompose} disabled={sending || !composeUserId || !composeBody.trim()}
                className="w-full py-3 bg-nova-red hover:bg-nova-red/90 text-white font-bold rounded-xl text-sm disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
