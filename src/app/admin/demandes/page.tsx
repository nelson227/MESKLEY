"use client";

import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { apiUrl } from "@/lib/api";
import ApplicationsTable from "@/components/admin/ApplicationsTable";
import { toast } from "sonner";
import type { RentalApplication } from "@/types/application";

export default function AdminDemandesPage() {
  const [applications, setApplications] = useState<RentalApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(apiUrl("/api/demandes-location"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setApplications(data.data || []);
    } catch {
      // Silencieux
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(apiUrl(`/api/demandes-location/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setApplications((prev) => prev.map((a) => a._id === id ? { ...a, status: status as RentalApplication["status"] } : a));
        toast.success("Statut mis à jour");
      }
    } catch {
      toast.error("Erreur");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette demande ?")) return;
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(apiUrl(`/api/demandes-location/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setApplications((prev) => prev.filter((a) => a._id !== id));
        toast.success("Demande supprimée");
      }
    } catch {
      toast.error("Erreur");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Demandes de location</h1>
      <ApplicationsTable applications={applications} onStatusChange={handleStatusChange} onDelete={handleDelete} />
    </div>
  );
}
