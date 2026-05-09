"use client";

import { useEffect, useState } from "react";
import { Inbox, Mail, Phone, Clock, CheckCircle, Trash2, Filter, Loader2, MessageSquare, Car, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Lead {
  id: string;
  type: string;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  source: string | null;
  listingType: string | null;
  listingId: string | null;
  isRead: boolean;
  createdAt: string;
}

const TYPE_STYLES: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  CONTACT: { label: "Contact", color: "text-blue-400 bg-blue-400/10", icon: Mail },
  WHATSAPP: { label: "WhatsApp", color: "text-green-400 bg-green-400/10", icon: MessageSquare },
  CAR_INQUIRY: { label: "Voiture", color: "text-nova-red bg-nova-red/10", icon: Car },
  PROPERTY_INQUIRY: { label: "Immobilier", color: "text-orange-400 bg-orange-400/10", icon: Building2 },
};

export default function LeadsAdmin() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const fetchLeads = async () => {
    setLoading(true);
    const params = filter === "unread" ? "?isRead=false" : filter === "read" ? "?isRead=true" : "";
    const res = await fetch(`/api/leads${params}`);
    const data = await res.json();
    setLeads(data.leads || []);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, [filter]);

  const markRead = async (id: string) => {
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: true }),
    });
    setLeads(prev => prev.map(l => l.id === id ? { ...l, isRead: true } : l));
    if (selected?.id === id) setSelected(s => s ? { ...s, isRead: true } : null);
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Supprimer ce lead ?")) return;
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    setLeads(prev => prev.filter(l => l.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const openLead = (lead: Lead) => {
    setSelected(lead);
    if (!lead.isRead) markRead(lead.id);
  };

  const unreadCount = leads.filter(l => !l.isRead).length;

  return (
    <div className="flex h-full -m-6 overflow-hidden">
      {/* List */}
      <div className="w-80 flex-shrink-0 border-r border-white/5 flex flex-col bg-[#080D14]">
        <div className="px-4 py-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <h1 className="text-white font-bold flex items-center gap-2">
              <Inbox size={18} className="text-nova-red" /> Leads
              {unreadCount > 0 && <span className="text-xs bg-nova-red text-white px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
            </h1>
          </div>
          <div className="flex gap-1 mt-3">
            {(["all", "unread", "read"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={cn("flex-1 py-1.5 text-xs rounded-lg transition-colors", filter === f ? "bg-nova-red/15 text-nova-red" : "text-white/40 hover:text-white/60 hover:bg-white/5")}>
                {f === "all" ? "Tous" : f === "unread" ? "Non lus" : "Lus"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-white/20" /></div>
          ) : leads.length === 0 ? (
            <div className="text-center py-12 text-white/25 text-sm">Aucun lead</div>
          ) : leads.map(lead => {
            const typeInfo = TYPE_STYLES[lead.type] || TYPE_STYLES.CONTACT;
            const TypeIcon = typeInfo.icon;
            return (
              <button key={lead.id} onClick={() => openLead(lead)}
                className={cn("w-full text-left px-4 py-3 transition-colors hover:bg-white/[0.03]",
                  selected?.id === lead.id ? "bg-nova-red/5 border-l-2 border-nova-red" : "",
                  !lead.isRead ? "bg-white/[0.02]" : "")}>
                <div className="flex items-start gap-2.5">
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", typeInfo.color)}>
                    <TypeIcon size={13} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn("text-sm truncate", !lead.isRead ? "font-semibold text-white" : "text-white/70")}>{lead.name}</p>
                      {!lead.isRead && <span className="w-1.5 h-1.5 rounded-full bg-nova-red flex-shrink-0" />}
                    </div>
                    <p className="text-white/30 text-xs truncate mt-0.5">{lead.subject || lead.message.slice(0, 50)}</p>
                    <p className="text-white/20 text-xs mt-1">{new Date(lead.createdAt).toLocaleDateString("fr-FR")}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail */}
      <div className="flex-1 overflow-y-auto bg-[#0A0F1C]">
        {selected ? (
          <div className="p-6 max-w-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-white text-lg font-semibold">{selected.name}</h2>
                <div className="flex items-center gap-3 mt-1">
                  {selected.email && <a href={`mailto:${selected.email}`} className="text-nova-red text-sm flex items-center gap-1 hover:underline"><Mail size={13} /> {selected.email}</a>}
                  {selected.phone && <a href={`tel:${selected.phone}`} className="text-white/50 text-sm flex items-center gap-1 hover:text-white/80"><Phone size={13} /> {selected.phone}</a>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!selected.isRead && (
                  <button onClick={() => markRead(selected.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors">
                    <CheckCircle size={13} /> Marquer lu
                  </button>
                )}
                <button onClick={() => deleteLead(selected.id)} className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#111827] border border-white/5 rounded-xl p-3">
                <p className="text-xs text-white/40 mb-1">Type</p>
                <p className="text-sm text-white">{TYPE_STYLES[selected.type]?.label || selected.type}</p>
              </div>
              <div className="bg-[#111827] border border-white/5 rounded-xl p-3">
                <p className="text-xs text-white/40 mb-1">Source</p>
                <p className="text-sm text-white">{selected.source || "—"}</p>
              </div>
              <div className="bg-[#111827] border border-white/5 rounded-xl p-3">
                <p className="text-xs text-white/40 mb-1">Date</p>
                <p className="text-sm text-white">{new Date(selected.createdAt).toLocaleString("fr-FR")}</p>
              </div>
            </div>

            {selected.subject && (
              <div className="bg-[#111827] border border-white/5 rounded-xl p-4">
                <p className="text-xs text-white/40 mb-1">Sujet</p>
                <p className="text-white text-sm">{selected.subject}</p>
              </div>
            )}

            <div className="bg-[#111827] border border-white/5 rounded-xl p-4">
              <p className="text-xs text-white/40 mb-2">Message</p>
              <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>

            {selected.listingType && (
              <div className="bg-[#111827] border border-white/5 rounded-xl p-4">
                <p className="text-xs text-white/40 mb-1">Annonce concernée</p>
                <p className="text-white text-sm">{selected.listingType} — ID: {selected.listingId}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Inbox size={40} className="text-white/10 mb-3" />
            <p className="text-white/30">Sélectionnez un lead pour voir les détails</p>
          </div>
        )}
      </div>
    </div>
  );
}
