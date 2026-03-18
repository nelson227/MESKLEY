"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { formatDate, formatPrice, getStatusLabel, getStatusColor } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import type { RentalApplication } from "@/types/application";

export default function DemandeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [app, setApp] = useState<RentalApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch(`/api/demandes-location/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setApp(data.data);
      } catch {
        // Silencieux
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, [id]);

  const updateStatus = async (status: string) => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`/api/demandes-location/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setApp((prev) => prev ? { ...prev, status: status as RentalApplication["status"] } : null);
        toast.success("Statut mis à jour");
      }
    } catch {
      toast.error("Erreur");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  if (!app) return <p className="text-gray-500">Demande introuvable.</p>;

  const info = (label: string, value: string | number | null | undefined) => (
    value ? <div className="flex justify-between py-2 border-b border-gray-100">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div> : null
  );

  return (
    <div>
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gold mb-4">
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dossier {app.dossierId}</h1>
          <p className="text-sm text-gray-400">Soumis le {formatDate(app.createdAt)}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
          {getStatusLabel(app.status)}
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold mb-4">Identité</h3>
          {info("Nom complet", app.fullName)}
          {info("Date de naissance", app.birthDate)}
          {info("Téléphone", app.phone)}
          {info("Email", app.email)}
          {info("N° Pièce d'identité", app.idNumber)}
          {info("Nationalité", app.nationality)}
          {info("Situation familiale", app.familyStatus)}
          {info("Taille du foyer", app.householdSize)}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold mb-4">Emploi</h3>
          {info("Statut", app.employmentStatus)}
          {info("Employeur", app.employerName)}
          {info("Poste", app.jobTitle)}
          {info("Revenu mensuel", app.monthlyIncome ? formatPrice(app.monthlyIncome) : null)}
          {info("Ancienneté", app.employmentDuration)}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold mb-4">Logement souhaité</h3>
          {info("Date d'emménagement", app.desiredMoveIn)}
          {info("Durée", app.desiredDuration)}
          {info("Budget max", formatPrice(app.maxBudget))}
          {info("Adresse actuelle", app.currentAddress)}
          {info("Statut actuel", app.currentStatus)}
          {info("Raison du déménagement", app.movingReason)}
        </div>

        {app.hasGuarantor && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Garant</h3>
            {info("Nom", app.guarantorName)}
            {info("Lien", app.guarantorRelation)}
            {info("Téléphone", app.guarantorPhone)}
            {info("Revenu", app.guarantorIncome ? formatPrice(app.guarantorIncome) : null)}
          </div>
        )}
      </div>

      {app.message && (
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold mb-2">Message</h3>
          <p className="text-sm text-gray-600 whitespace-pre-line">{app.message}</p>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button onClick={() => updateStatus("en_cours")} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200">
          En cours
        </button>
        <button onClick={() => updateStatus("approuve")} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200">
          Approuver
        </button>
        <button onClick={() => updateStatus("refuse")} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200">
          Refuser
        </button>
      </div>
    </div>
  );
}
