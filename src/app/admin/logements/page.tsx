"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit, Eye } from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { apiUrl } from "@/lib/api";
import { formatPrice, getStatusLabel, getStatusColor } from "@/lib/utils";
import { toast } from "sonner";

interface ListingItem {
  _id: string;
  title: string;
  type: string;
  price: number;
  city: string;
  neighborhood: string;
  status: string;
  reference: string;
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(apiUrl("/api/logements?limit=100"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setListings(data.data || []);
    } catch {
      // Silencieux
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce logement ?")) return;
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(apiUrl(`/api/logements/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setListings((prev) => prev.filter((l) => l._id !== id));
        toast.success("Logement supprimé");
      }
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Logements</h1>
        <Link href="/admin/logements/nouveau" className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg font-semibold text-sm hover:bg-gold-dark transition-colors">
          <Plus className="w-4 h-4" /> Nouveau logement
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Réf.</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Titre</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Localisation</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Prix</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Statut</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listings.map((listing) => (
                <tr key={listing._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gold font-medium">{listing.reference}</td>
                  <td className="px-4 py-3 font-medium max-w-[200px] truncate">{listing.title}</td>
                  <td className="px-4 py-3 text-gray-500">{listing.neighborhood}, {listing.city}</td>
                  <td className="px-4 py-3">{formatPrice(listing.price)}/mois</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                      {getStatusLabel(listing.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/logements/${listing._id}`} className="p-1.5 hover:bg-gray-100 rounded" title="Voir">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </Link>
                      <Link href={`/admin/logements/${listing._id}/edit`} className="p-1.5 hover:bg-gray-100 rounded" title="Modifier">
                        <Edit className="w-4 h-4 text-blue-500" />
                      </Link>
                      <button onClick={() => handleDelete(listing._id)} className="p-1.5 hover:bg-gray-100 rounded" title="Supprimer">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {listings.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            Aucun logement. <Link href="/admin/logements/nouveau" className="text-gold">Créer le premier →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
