"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Building2, RefreshCw } from "lucide-react";
import DataTable, { Column } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useRouter } from "next/navigation";

interface PropRow {
  id: string; title: string; type: string; price: number;
  city: string; status: string; featured: boolean;
  priceType: string; createdAt: string; surface: number;
}

const TYPE_LABELS: Record<string, string> = {
  HOUSE: "Maison", APARTMENT: "Appartement", LAND: "Terrain",
  STUDIO: "Studio", VILLA: "Villa", OFFICE: "Bureau",
};
const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "text-emerald-400 bg-emerald-400/10",
  SOLD: "text-red-400 bg-red-400/10",
  RENTED: "text-blue-400 bg-blue-400/10",
  PENDING: "text-yellow-400 bg-yellow-400/10",
  INACTIVE: "text-white/30 bg-white/5",
};
const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Disponible", SOLD: "Vendu", RENTED: "Loué",
  PENDING: "En attente", INACTIVE: "Inactif",
};

export default function ImmobilierAdmin() {
  const router = useRouter();
  const [props, setProps] = useState<PropRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<PropRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/properties?limit=200");
    const data = await res.json();
    setProps(data.properties || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/properties/${deleteTarget.id}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteTarget(null);
    load();
  };

  const columns: Column<PropRow>[] = [
    {
      key: "title", label: "Bien", sortable: true,
      render: (r) => (
        <div>
          <p className="text-white font-medium text-sm">{r.title}</p>
          <p className="text-white/30 text-xs">{TYPE_LABELS[r.type] || r.type}</p>
        </div>
      ),
    },
    {
      key: "price", label: "Prix", sortable: true,
      render: (r) => (
        <span className="text-white font-medium">
          {r.price.toLocaleString("fr-FR")} CFA
          {r.priceType === "RENT" && <span className="text-white/40 text-xs ml-1">/mois</span>}
        </span>
      ),
    },
    { key: "surface", label: "Surface", render: (r) => <span className="text-white/60">{r.surface ? `${r.surface} m²` : "—"}</span> },
    { key: "city", label: "Ville", sortable: true, render: (r) => <span className="text-white/60">{r.city || "—"}</span> },
    {
      key: "status", label: "Statut",
      render: (r) => (
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[r.status] || "text-white/40"}`}>
          {STATUS_LABELS[r.status] || r.status}
        </span>
      ),
    },
    {
      key: "featured", label: "Vedette",
      render: (r) => <span className={`text-xs ${r.featured ? "text-yellow-400" : "text-white/20"}`}>{r.featured ? "⭐" : "—"}</span>,
    },
    {
      key: "createdAt", label: "Date", sortable: true,
      render: (r) => <span className="text-white/40 text-xs">{new Date(r.createdAt).toLocaleDateString("fr-FR")}</span>,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold flex items-center gap-2">
            <Building2 size={20} className="text-nova-orange" /> Immobilier
          </h1>
          <p className="text-white/40 text-sm mt-0.5">{props.length} bien{props.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <RefreshCw size={15} />
          </button>
          <Link href="/admin/immobilier/nouveau" className="flex items-center gap-2 px-4 py-2 bg-nova-orange hover:bg-nova-orange/90 text-white text-sm font-semibold rounded-lg transition-colors">
            <Plus size={16} /> Nouveau bien
          </Link>
        </div>
      </div>

      <DataTable columns={columns} data={props} loading={loading} searchable searchKeys={["title", "city", "type"]}
        onEdit={(r) => router.push(`/admin/immobilier/${r.id}`)}
        onDelete={setDeleteTarget}
      />

      <ConfirmDialog
        open={!!deleteTarget} title="Supprimer ce bien ?"
        message={`"${deleteTarget?.title}" sera définitivement supprimé.`}
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting}
      />
    </div>
  );
}
