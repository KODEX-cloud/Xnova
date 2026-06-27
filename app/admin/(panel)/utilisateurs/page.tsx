"use client";

import { useEffect, useState, useCallback } from "react";
import { Users, Plus, RefreshCw, Loader2 } from "lucide-react";
import { ROLE_LABELS } from "@/lib/permissions";
import DataTable, { Column } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface UserRow { id: string; email: string; name: string; role: string; isActive: boolean; createdAt: string; }

export default function UtilisateursPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "EDITOR" });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/users");
    setUsers(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    setShowForm(false);
    setForm({ name: "", email: "", password: "", role: "EDITOR" });
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/users/${deleteTarget.id}`, { method: "DELETE" });
    setDeleteTarget(null);
    load();
  };

  const toggleActive = async (user: UserRow) => {
    await fetch(`/api/users/${user.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !user.isActive }) });
    load();
  };

  const columns: Column<UserRow>[] = [
    {
      key: "name", label: "Utilisateur", sortable: true,
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nova-red to-nova-orange flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
            {(r.name || r.email)[0].toUpperCase()}
          </div>
          <div>
            <p className="text-white font-medium text-sm">{r.name || "—"}</p>
            <p className="text-white/30 text-xs">{r.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role", label: "Rôle",
      render: (r) => {
        const roleInfo = (ROLE_LABELS as any)[r.role] || { label: r.role, color: "text-white/50 bg-white/5" };
        return (
          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${roleInfo.color}`}>
            {roleInfo.label}
          </span>
        );
      },
    },
    {
      key: "isActive", label: "Statut",
      render: (r) => (
        <button onClick={() => toggleActive(r)} className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${r.isActive ? "text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20" : "text-white/30 bg-white/5 hover:bg-white/10"}`}>
          {r.isActive ? "Actif" : "Inactif"}
        </button>
      ),
    },
    {
      key: "createdAt", label: "Inscrit le", sortable: true,
      render: (r) => <span className="text-white/40 text-xs">{new Date(r.createdAt).toLocaleDateString("fr-FR")}</span>,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold flex items-center gap-2"><Users size={20} className="text-purple-400" /> Utilisateurs</h1>
          <p className="text-white/40 text-sm mt-0.5">{users.length} compte{users.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"><RefreshCw size={15} /></button>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold rounded-lg transition-colors">
            <Plus size={16} /> Nouvel utilisateur
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
          <h2 className="text-white font-semibold text-sm mb-4">Créer un compte</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
            {[
              { label: "Nom", field: "name", type: "text", placeholder: "Jean Kouadio" },
              { label: "Email *", field: "email", type: "email", placeholder: "jean@nova.ci" },
              { label: "Mot de passe *", field: "password", type: "password", placeholder: "••••••••" },
            ].map(({ label, field, type, placeholder }) => (
              <div key={field}>
                <label className="block text-white/60 text-sm mb-1.5">{label}</label>
                <input type={type} placeholder={placeholder} value={(form as any)[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} required={field !== "name"}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-nova-red/50" />
              </div>
            ))}
            <div>
              <label className="block text-white/60 text-sm mb-1.5">Rôle</label>
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                className="w-full bg-[#1F2937] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-nova-red/50">
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ADMIN">Administrateur</option>
                <option value="EDITOR">Éditeur</option>
                <option value="AGENT_AUTO">Agent Auto</option>
                <option value="AGENT_IMMO">Agent Immobilier</option>
              </select>
            </div>
            <div className="col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-white/60 hover:text-white text-sm transition-colors">Annuler</button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
                {saving ? <Loader2 size={14} className="animate-spin" /> : null} Créer
              </button>
            </div>
          </form>
        </div>
      )}

      <DataTable columns={columns} data={users} loading={loading} searchable searchKeys={["name", "email"]}
        onDelete={(r) => r.role !== "ADMIN" ? setDeleteTarget(r) : undefined} />

      <ConfirmDialog open={!!deleteTarget} title="Supprimer cet utilisateur ?" message={`Le compte de "${deleteTarget?.email}" sera supprimé.`}
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
