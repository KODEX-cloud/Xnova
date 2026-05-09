"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Car, Building2, Search, Filter, Eye, Pencil, Trash2, Star, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type Kind = "ALL" | "AUTO" | "IMMO";
type Status = "ALL" | "ACTIVE" | "INACTIVE" | "PENDING";

interface Listing {
  id: string;
  kind: "AUTO" | "IMMO";
  title: string;
  city: string;
  price: number;
  priceType: string;
  status: string;
  featured: boolean;
  image: string | null;
  createdAt: string;
  slug: string;
  category?: string;
}

interface ApiResponse {
  listings: Listing[];
  total: number;
  pages: number;
  page: number;
}

const KIND_LABELS: Record<string, string> = { AUTO: "Automobile", IMMO: "Immobilier" };
const PRICE_LABELS: Record<string, string> = { SALE: "Vente", RENT: "Location" };
const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  INACTIVE: "bg-gray-100 text-gray-500",
  PENDING: "bg-amber-100 text-amber-700",
};

function fmt(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}

export default function AdminAnnoncesPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [kind, setKind] = useState<Kind>("ALL");
  const [status, setStatus] = useState<Status>("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ kind, page: String(page), limit: "20" });
    if (status !== "ALL") params.set("status", status);
    const res = await fetch(`/api/annonces?${params}`);
    const data: ApiResponse = await res.json();
    setListings(data.listings || []);
    setTotal(data.total || 0);
    setPages(data.pages || 1);
    setLoading(false);
  }, [kind, page, status]);

  useEffect(() => { load(); }, [load]);

  const filtered = search
    ? listings.filter((l) =>
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.city.toLowerCase().includes(search.toLowerCase())
      )
    : listings;

  const handleDelete = async (item: Listing) => {
    if (!confirm(`Supprimer « ${item.title} » ?`)) return;
    setDeleting(item.id);
    const endpoint = item.kind === "AUTO" ? `/api/cars/${item.id}` : `/api/properties/${item.id}`;
    await fetch(endpoint, { method: "DELETE" });
    await load();
    setDeleting(null);
  };

  const editHref = (item: Listing) =>
    `/admin/listings-editor?type=${item.kind === "AUTO" ? "car" : "property"}&id=${item.id}`;

  const viewHref = (item: Listing) =>
    item.kind === "AUTO"
      ? `/automobile/${item.slug}`
      : `/immobilier/${item.slug}`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Toutes les annonces</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} annonce{total !== 1 ? "s" : ""} au total</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/automobiles/nouveau" className="flex items-center gap-2 px-4 py-2 bg-nova-red text-white rounded-lg text-sm font-medium hover:bg-nova-red/90">
            <Car size={15} /> + Auto
          </Link>
          <Link href="/admin/immobilier/nouveau" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            <Building2 size={15} /> + Immo
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-52">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une annonce..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-nova-red/30"
          />
        </div>

        {/* Kind filter */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          {(["ALL", "AUTO", "IMMO"] as Kind[]).map((k) => (
            <button
              key={k}
              onClick={() => { setKind(k); setPage(1); }}
              className={cn("px-3 py-2 text-sm font-medium transition-colors", kind === k ? "bg-nova-red text-white" : "text-gray-600 hover:bg-gray-50")}
            >
              {k === "ALL" ? "Tous" : k === "AUTO" ? "Auto" : "Immo"}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value as Status); setPage(1); }}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none"
        >
          <option value="ALL">Tous statuts</option>
          <option value="ACTIVE">Actif</option>
          <option value="INACTIVE">Inactif</option>
          <option value="PENDING">En attente</option>
        </select>

        <button onClick={load} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50">
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Annonce</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Prix</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3" colSpan={5}>
                    <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                  <Filter size={32} className="mx-auto mb-2 opacity-30" />
                  <p>Aucune annonce trouvée</p>
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <img src={item.image} alt="" className="w-12 h-9 object-cover rounded-lg flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.kind === "AUTO" ? <Car size={16} className="text-gray-400" /> : <Building2 size={16} className="text-gray-400" />}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900 line-clamp-1">{item.title}</div>
                        <div className="text-xs text-gray-400">{item.city}</div>
                      </div>
                      {item.featured && (
                        <Star size={13} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                      item.kind === "AUTO" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700")}>
                      {item.kind === "AUTO" ? <Car size={11} /> : <Building2 size={11} />}
                      {KIND_LABELS[item.kind]}
                    </span>
                    <span className="ml-1.5 text-xs text-gray-400">{PRICE_LABELS[item.priceType] || item.priceType}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-700 font-medium">
                    {fmt(item.price)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", STATUS_COLORS[item.status] || "bg-gray-100 text-gray-500")}>
                      {item.status === "ACTIVE" ? "Actif" : item.status === "INACTIVE" ? "Inactif" : item.status === "PENDING" ? "En attente" : item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <a href={viewHref(item)} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                        <Eye size={15} />
                      </a>
                      <Link href={editHref(item)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(item)}
                        disabled={deleting === item.id}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {pages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">Page {page} / {pages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">
                <ChevronLeft size={15} />
              </button>
              <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}
                className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
