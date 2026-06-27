"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Inbox, Mail, Phone, CheckCircle, Trash2, Loader2, MessageSquare,
  Car, Building2, Kanban, List, User, Flag, StickyNote, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Lead {
  id: string; type: string; name: string | null; email: string | null;
  phone: string | null; subject: string | null; message: string | null;
  source: string | null; listingType: string | null; listingId: string | null;
  isRead: boolean; pipelineStatus: string; priority: string;
  notes: string | null; expectedValue: number | null; createdAt: string;
  assignedTo: { id: string; name: string | null; email: string } | null;
}

const PIPELINE = [
  { id: "NOUVEAU",   label: "Nouveau",   color: "border-gray-500 bg-gray-500/10 text-gray-400" },
  { id: "CONTACTÉ",  label: "Contacté",  color: "border-blue-500 bg-blue-500/10 text-blue-400" },
  { id: "EN_COURS",  label: "En cours",  color: "border-amber-500 bg-amber-500/10 text-amber-400" },
  { id: "QUALIFIÉ",  label: "Qualifié",  color: "border-violet-500 bg-violet-500/10 text-violet-400" },
  { id: "CONVERTI",  label: "Converti",  color: "border-emerald-500 bg-emerald-500/10 text-emerald-400" },
  { id: "PERDU",     label: "Perdu",     color: "border-red-500 bg-red-500/10 text-red-400" },
];

const PRIORITY = {
  LOW:    { label: "Basse",   cls: "text-gray-400" },
  MEDIUM: { label: "Moyenne", cls: "text-blue-400" },
  HIGH:   { label: "Haute",   cls: "text-amber-400" },
  URGENT: { label: "Urgent",  cls: "text-red-400" },
};

const TYPE_ICON: Record<string, React.ElementType> = {
  CONTACT: Mail, WHATSAPP: MessageSquare, CAR_INQUIRY: Car, PROPERTY_INQUIRY: Building2,
};

export default function LeadsAdmin() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [view, setView] = useState<"inbox" | "pipeline">("inbox");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [editNotes, setEditNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = filter === "unread" ? "?isRead=false&limit=100" : filter === "read" ? "?isRead=true&limit=100" : "?limit=100";
    const res = await fetch(`/api/leads${params}`);
    const data = await res.json();
    setLeads(data.leads || []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const patch = async (id: string, body: Record<string, unknown>) => {
    const res = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const updated = await res.json();
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updated } : l));
    if (selected?.id === id) setSelected(s => s ? { ...s, ...updated } : null);
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Supprimer ce lead ?")) return;
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    setLeads(prev => prev.filter(l => l.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const openLead = (lead: Lead) => {
    setSelected(lead);
    setEditNotes(lead.notes || "");
    if (!lead.isRead) patch(lead.id, { isRead: true });
  };

  const saveNotes = async () => {
    if (!selected) return;
    setSavingNotes(true);
    await patch(selected.id, { notes: editNotes });
    setSavingNotes(false);
  };

  const unreadCount = leads.filter(l => !l.isRead).length;

  // ── PIPELINE VIEW ──────────────────────────────────────────────────────────
  if (view === "pipeline") {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white font-bold text-lg flex items-center gap-2">
            <Kanban size={18} className="text-nova-red" /> Pipeline CRM
          </h1>
          <button onClick={() => setView("inbox")} className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
            <List size={14} /> Vue liste
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="animate-spin text-white/30" /></div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {PIPELINE.map(stage => {
              const stageLeads = leads.filter(l => l.pipelineStatus === stage.id);
              return (
                <div key={stage.id} className="flex-shrink-0 w-64">
                  <div className={cn("flex items-center justify-between px-3 py-2 rounded-xl border mb-3", stage.color)}>
                    <span className="text-xs font-bold">{stage.label}</span>
                    <span className="text-xs font-bold opacity-70">{stageLeads.length}</span>
                  </div>
                  <div className="space-y-2">
                    {stageLeads.map(lead => {
                      const TypeIcon = TYPE_ICON[lead.type] || Mail;
                      const pri = PRIORITY[lead.priority as keyof typeof PRIORITY] || PRIORITY.MEDIUM;
                      return (
                        <div key={lead.id}
                          onClick={() => { setView("inbox"); openLead(lead); }}
                          className="bg-[#111827] border border-white/5 rounded-xl p-3 cursor-pointer hover:border-nova-red/30 transition-all">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="text-white text-sm font-medium truncate">{lead.name || "—"}</p>
                            <Flag size={12} className={pri.cls} />
                          </div>
                          <div className="flex items-center gap-2">
                            <TypeIcon size={12} className="text-white/40" />
                            <p className="text-white/40 text-xs truncate">{lead.subject || lead.message?.slice(0, 40) || "—"}</p>
                          </div>
                          {lead.assignedTo && (
                            <div className="flex items-center gap-1.5 mt-2">
                              <User size={11} className="text-white/30" />
                              <span className="text-white/30 text-xs">{lead.assignedTo.name || lead.assignedTo.email}</span>
                            </div>
                          )}
                          {/* Pipeline quick-move */}
                          <div className="flex gap-1 mt-3 flex-wrap">
                            {PIPELINE.filter(s => s.id !== stage.id).map(s => (
                              <button key={s.id}
                                onClick={e => { e.stopPropagation(); patch(lead.id, { pipelineStatus: s.id }); }}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white/40 transition-colors">
                                → {s.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ── INBOX VIEW ─────────────────────────────────────────────────────────────
  return (
    <div className="flex h-full -m-6 overflow-hidden">
      {/* List */}
      <div className="w-72 flex-shrink-0 border-r border-white/5 flex flex-col bg-[#080D14]">
        <div className="px-4 py-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-white font-bold flex items-center gap-2">
              <Inbox size={16} className="text-nova-red" /> Leads
              {unreadCount > 0 && <span className="text-[10px] bg-nova-red text-white px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
            </h1>
            <button onClick={() => setView("pipeline")} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors">
              <Kanban size={13} /> Pipeline
            </button>
          </div>
          <div className="flex gap-1">
            {(["all", "unread", "read"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={cn("flex-1 py-1.5 text-xs rounded-lg transition-colors", filter === f ? "bg-nova-red/15 text-nova-red" : "text-white/40 hover:text-white/60")}>
                {f === "all" ? "Tous" : f === "unread" ? "Non lus" : "Lus"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-white/20" /></div>
          ) : leads.length === 0 ? (
            <div className="text-center py-12 text-white/25 text-sm">Aucun lead</div>
          ) : leads.map(lead => {
            const TypeIcon = TYPE_ICON[lead.type] || Mail;
            const stage = PIPELINE.find(s => s.id === lead.pipelineStatus);
            return (
              <button key={lead.id} onClick={() => openLead(lead)}
                className={cn("w-full text-left px-4 py-3 transition-colors hover:bg-white/[0.03]",
                  selected?.id === lead.id ? "bg-nova-red/5 border-l-2 border-nova-red" : "",
                  !lead.isRead ? "bg-white/[0.02]" : "")}>
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <TypeIcon size={13} className="text-white/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn("text-sm truncate", !lead.isRead ? "font-semibold text-white" : "text-white/60")}>
                        {lead.name || "Anonyme"}
                      </p>
                      {!lead.isRead && <span className="w-1.5 h-1.5 rounded-full bg-nova-red flex-shrink-0" />}
                    </div>
                    <p className="text-white/30 text-xs truncate mt-0.5">{lead.subject || lead.message?.slice(0, 50) || "—"}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {stage && <span className={cn("text-[10px] px-1.5 py-0.5 rounded border", stage.color)}>{stage.label}</span>}
                      <span className="text-white/20 text-[10px]">{new Date(lead.createdAt).toLocaleDateString("fr-FR")}</span>
                    </div>
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
                <h2 className="text-white text-lg font-semibold">{selected.name || "Anonyme"}</h2>
                <div className="flex items-center gap-3 mt-1">
                  {selected.email && <a href={`mailto:${selected.email}`} className="text-nova-red text-sm flex items-center gap-1 hover:underline"><Mail size={12} /> {selected.email}</a>}
                  {selected.phone && <a href={`tel:${selected.phone}`} className="text-white/40 text-sm flex items-center gap-1 hover:text-white/70"><Phone size={12} /> {selected.phone}</a>}
                </div>
              </div>
              <button onClick={() => deleteLead(selected.id)} className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                <Trash2 size={15} />
              </button>
            </div>

            {/* Pipeline + Priority */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#111827] border border-white/5 rounded-xl p-3">
                <p className="text-xs text-white/30 mb-2 flex items-center gap-1"><Kanban size={11} /> Étape pipeline</p>
                <div className="relative">
                  <select value={selected.pipelineStatus}
                    onChange={e => patch(selected.id, { pipelineStatus: e.target.value })}
                    className="w-full bg-transparent text-white text-sm appearance-none pr-5 focus:outline-none cursor-pointer">
                    {PIPELINE.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                </div>
              </div>
              <div className="bg-[#111827] border border-white/5 rounded-xl p-3">
                <p className="text-xs text-white/30 mb-2 flex items-center gap-1"><Flag size={11} /> Priorité</p>
                <div className="relative">
                  <select value={selected.priority}
                    onChange={e => patch(selected.id, { priority: e.target.value })}
                    className="w-full bg-transparent text-white text-sm appearance-none pr-5 focus:outline-none cursor-pointer">
                    {Object.entries(PRIORITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Type", val: selected.type },
                { label: "Source", val: selected.source || "—" },
                { label: "Date", val: new Date(selected.createdAt).toLocaleDateString("fr-FR") },
              ].map(c => (
                <div key={c.label} className="bg-[#111827] border border-white/5 rounded-xl p-3">
                  <p className="text-xs text-white/30 mb-1">{c.label}</p>
                  <p className="text-white text-sm">{c.val}</p>
                </div>
              ))}
            </div>

            {selected.subject && (
              <div className="bg-[#111827] border border-white/5 rounded-xl p-4">
                <p className="text-xs text-white/30 mb-1">Sujet</p>
                <p className="text-white text-sm">{selected.subject}</p>
              </div>
            )}

            <div className="bg-[#111827] border border-white/5 rounded-xl p-4">
              <p className="text-xs text-white/30 mb-2">Message</p>
              <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{selected.message || "—"}</p>
            </div>

            {/* Notes CRM */}
            <div className="bg-[#111827] border border-white/5 rounded-xl p-4">
              <p className="text-xs text-white/30 mb-2 flex items-center gap-1"><StickyNote size={11} /> Notes internes</p>
              <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={4}
                placeholder="Ajouter des notes sur ce lead..."
                className="w-full bg-transparent text-white/80 text-sm placeholder-white/20 focus:outline-none resize-none" />
              <div className="flex justify-end mt-2">
                <button onClick={saveNotes} disabled={savingNotes}
                  className="text-xs px-3 py-1.5 bg-nova-red/20 text-nova-red border border-nova-red/30 rounded-lg hover:bg-nova-red/30 transition-colors disabled:opacity-50 flex items-center gap-1.5">
                  {savingNotes ? <Loader2 size={11} className="animate-spin" /> : <CheckCircle size={11} />} Sauvegarder
                </button>
              </div>
            </div>

            {selected.listingType && (
              <div className="bg-[#111827] border border-white/5 rounded-xl p-4">
                <p className="text-xs text-white/30 mb-1">Annonce concernée</p>
                <p className="text-white text-sm">{selected.listingType} · {selected.listingId}</p>
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
