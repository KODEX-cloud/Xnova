"use client";

import { useEffect, useState } from "react";
import { Heart, Car, Home, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Favorite { id: string; type: string; itemId: string; createdAt: string; }

export default function FavorisPage() {
  const [favs, setFavs] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/favorites").then(r => r.json()).then(d => { setFavs(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const remove = async (id: string, type: string, itemId: string) => {
    await fetch("/api/user/favorites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, itemId }) });
    setFavs(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Mes favoris</h1>
        <p className="text-gray-500 text-sm mt-0.5">{favs.length} annonce{favs.length > 1 ? "s" : ""} sauvegardée{favs.length > 1 ? "s" : ""}</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-nova-red/20 border-t-nova-red rounded-full animate-spin" /></div>
      ) : favs.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-12 text-center">
          <Heart size={40} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-gray-900 font-bold text-lg mb-2">Aucun favori</h2>
          <p className="text-gray-500 text-sm mb-6">Ajoutez des annonces à vos favoris pour les retrouver facilement.</p>
          <Link href="/annonces" className="inline-flex items-center gap-2 px-6 py-3 bg-nova-red text-white font-bold rounded-xl text-sm hover:bg-nova-red/90 transition-colors">
            Parcourir les annonces <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favs.map(f => (
            <div key={f.id} className="bg-white rounded-2xl border-2 border-gray-100 p-5 flex flex-col gap-3 hover:border-orange-200 transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.type === "CAR" ? "bg-orange-50" : "bg-blue-50"}`}>
                  {f.type === "CAR" ? <Car size={18} className="text-nova-red" /> : <Home size={18} className="text-blue-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-gray-600 text-xs font-medium">{f.type === "CAR" ? "Automobile" : "Immobilier"}</p>
                  <p className="text-gray-400 text-xs font-mono">{f.itemId.slice(0, 8)}…</p>
                </div>
                <button onClick={() => remove(f.id, f.type, f.itemId)} className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors">
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
              <Link href={f.type === "CAR" ? `/automobile/${f.itemId}` : `/immobilier/${f.itemId}`}
                className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-xl transition-colors">
                Voir l'annonce <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
