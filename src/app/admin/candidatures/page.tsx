"use client";

import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { formatDate, getStatusLabel, getStatusColor } from "@/lib/utils";
import { Eye, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Candidature {
  _id: string;
  referenceId: string;
  fullName: string;
  email: string;
  phone: string;
  desiredPosition: string;
  educationLevel: string;
  availability: string;
  status: string;
  createdAt: string;
}

export default function AdminCandidaturesPage() {
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch("/api/candidatures", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setCandidatures(data.data || []);
      } catch {
        // Silencieux
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`/api/candidatures/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setCandidatures((prev) => prev.map((c) => c._id === id ? { ...c, status } : c));
        toast.success("Statut mis à jour");
      }
    } catch {
      toast.error("Erreur");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Candidatures</h1>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Réf.</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Candidat</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Poste</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Disponibilité</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Statut</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {candidatures.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gold">{c.referenceId}</td>
                  <td className="px-4 py-3">{c.fullName}</td>
                  <td className="px-4 py-3">{c.desiredPosition}</td>
                  <td className="px-4 py-3">{c.availability}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}>
                      {getStatusLabel(c.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(c.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => updateStatus(c._id, "en_cours")} className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                        En cours
                      </button>
                      <button onClick={() => updateStatus(c._id, "retenu")} className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100">
                        Retenu
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {candidatures.length === 0 && (
          <div className="text-center py-12 text-gray-400">Aucune candidature reçue</div>
        )}
      </div>
    </div>
  );
}
