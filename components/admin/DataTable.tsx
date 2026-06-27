"use client";

import React, { useState } from "react";
import { Search, ChevronUp, ChevronDown, Trash2, Edit, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  loading?: boolean;
}

export default function DataTable<T extends { id: string }>({
  columns, data, onEdit, onDelete, onView, searchable = true, searchKeys = [], loading,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);

  const filtered = data.filter((row) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return searchKeys.some((k) => String(row[k] ?? "").toLowerCase().includes(q));
  });

  const sorted = sort
    ? [...filtered].sort((a, b) => {
        const av = (a as any)[sort.key] ?? "";
        const bv = (b as any)[sort.key] ?? "";
        return sort.dir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      })
    : filtered;

  const toggleSort = (key: string) => {
    setSort((prev) =>
      prev?.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
  };

  if (loading) {
    return (
      <div className="bg-[#111827] border border-white/5 rounded-xl p-8 text-center">
        <div className="w-8 h-8 border-2 border-nova-red border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-white/40 text-sm mt-3">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111827] border border-white/5 rounded-xl overflow-hidden">
      {searchable && (
        <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-nova-red/50"
            />
          </div>
          <span className="text-white/30 text-xs">{sorted.length} résultats</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  onClick={() => col.sortable && toggleSort(String(col.key))}
                  className={cn(
                    "text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider",
                    col.sortable && "cursor-pointer hover:text-white/70 select-none"
                  )}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sort?.key === String(col.key) && (
                      sort.dir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    )}
                  </span>
                </th>
              ))}
              {(onEdit || onDelete || onView) && (
                <th className="text-right px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-12 text-white/30 text-sm">
                  Aucun élément trouvé
                </td>
              </tr>
            ) : (
              sorted.map((row, i) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors",
                    i % 2 === 0 ? "bg-transparent" : "bg-white/[0.01]"
                  )}
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3 text-sm text-white/70">
                      {col.render ? col.render(row) : String((row as any)[col.key] ?? "—")}
                    </td>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {onView && (
                          <button
                            onClick={() => onView(row)}
                            className="w-7 h-7 flex items-center justify-center rounded text-white/30 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <Eye size={14} />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="w-7 h-7 flex items-center justify-center rounded text-white/30 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                          >
                            <Edit size={14} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="w-7 h-7 flex items-center justify-center rounded text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
