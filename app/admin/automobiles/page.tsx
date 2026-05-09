"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Car, RefreshCw } from "lucide-react";
import DataTable, { Column } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useRouter } from "next/navigation";

interface CarRow {
  id: string;
  title: string;
  brand: string;
  price: number;
  city: string;
  status: string;
  featured: boolean;
  priceType: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "text-emerald-400 bg-emerald-400/10",
  INACTIVE: "text-white/40 bg-white/5",
  SOLD: "text-red-400 bg-red-400/10",
  PENDING: "text-yellow-400 bg-yellow-400/10",
};
const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Actif", INACTIVE: "Inactif", SOLD: "Vendu", PENDING: "En attente",
};

export default function AutomobilesAdmin() {
  const router = useRouter();
  const [cars, setCars] = useState<CarRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<CarRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/cars?status=&limit=200");
    const data = await res.json();
    setCars(data.cars || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/cars/${deleteTarget.id}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteTarget(null);
    load();
  };

  const columns: Column<CarRow>[] = [
    {
      key: "title", label: "Véhicule", sortable: true,
      render: (row) => (
        <div>
          <p className="text-white font-medium text-sm">{row.title}</p>
          <p className="text-white/30 text-xs">{row.brand}</p>
        </div>
      ),
    },
    {
      key: "price", label: "Prix", sortable: true,
      render: (row) => (
        <span className="text-white font-medium">
          {row.price.toLocaleString("fr-FR")} CFA
          {row.priceType === "RENT" && <span className="text-white/40 text-xs ml-1">/mois</span>}
        </span>
      ),
    },
    { key: "city", label: "Ville", sortable: true, render: (r) => <span className="text-white/60">{r.city || "—"}</span> },
    {
      key: "status", label: "Statut",
      render: (row) => (
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[row.status] || "text-white/40"}`}>
          {STATUS_LABELS[row.status] || row.status}
        </span>
      ),
    },
    {
      key: "featured", label: "Mise en avant",
      render: (row) => (
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${row.featured ? "text-yellow-400 bg-yellow-400/10" : "text-white/20 bg-white/5"}`}>
          {row.featured ? "⭐ Oui" : "Non"}
        </span>
      ),
    },
    {
      key: "createdAt", label: "Créé le", sortable: true,
      render: (r) => <span className="text-white/40 text-xs">{new Date(r.createdAt).toLocaleDateString("fr-FR")}</span>,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold flex items-center gap-2">
            <Car size={20} className="text-nova-red" /> Automobile
          </h1>
          <p className="text-white/40 text-sm mt-0.5">{cars.length} véhicule{cars.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <RefreshCw size={15} />
          </button>
          <Link href="/admin/automobiles/nouveau" className="flex items-center gap-2 px-4 py-2 bg-nova-red hover:bg-nova-red/90 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-nova-red/20">
            <Plus size={16} /> Nouvelle voiture
          </Link>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={cars}
        loading={loading}
        searchable
        searchKeys={["title", "brand", "city"]}
        onEdit={(row) => router.push(`/admin/automobiles/${row.id}`)}
        onDelete={setDeleteTarget}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Supprimer ce véhicule ?"
        message={`"${deleteTarget?.title}" sera définitivement supprimé.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
