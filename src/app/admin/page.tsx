"use client";

import { useEffect, useState } from "react";
import StatsCards from "@/components/admin/StatsCards";
import { apiUrl } from "@/lib/api";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { formatDate, getStatusLabel, getStatusColor } from "@/lib/utils";
import Link from "next/link";

interface StatsData {
  totalListings: number;
  availableListings: number;
  totalApplications: number;
  pendingApplications: number;
  totalCandidatures: number;
  unreadMessages: number;
  recentApplications: Array<{
    _id: string;
    dossierId: string;
    fullName: string;
    status: string;
    createdAt: string;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch(apiUrl("/api/admin/stats"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setStats(data.data);
      } catch {
        // Silencieux
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!stats) {
    return <p className="text-gray-500">Impossible de charger les statistiques.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tableau de bord</h1>
      <StatsCards stats={stats} />

      {/* Dernières demandes */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Dernières demandes de location</h2>
          <Link href="/admin/demandes" className="text-sm text-gold hover:underline">Voir tout →</Link>
        </div>
        <div className="space-y-3">
          {stats.recentApplications?.map((app) => (
            <Link
              key={app._id}
              href={`/admin/demandes/${app._id}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{app.fullName}</p>
                <p className="text-xs text-gray-400">{app.dossierId} — {formatDate(app.createdAt)}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(app.status)}`}>
                {getStatusLabel(app.status)}
              </span>
            </Link>
          ))}
          {(!stats.recentApplications || stats.recentApplications.length === 0) && (
            <p className="text-sm text-gray-400 text-center py-4">Aucune demande récente</p>
          )}
        </div>
      </div>
    </div>
  );
}
