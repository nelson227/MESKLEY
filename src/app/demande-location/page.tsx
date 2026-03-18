import type { Metadata } from "next";
import { Suspense } from "react";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import RentalApplicationForm from "@/components/forms/RentalApplicationForm";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export const metadata: Metadata = {
  title: "Demande de Location",
  description: "Remplissez votre dossier de location en ligne. Processus simple et sécurisé avec MESKLEY LOCATION.",
};

export default function DemandeLocationPage() {
  return (
    <div className="pt-32 pb-16 bg-white-off min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={[{ label: "Demande de location" }]} />

        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-black mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Demande de Location
          </h1>
          <p className="text-gray max-w-xl mx-auto">
            Remplissez ce formulaire pour constituer votre dossier. Toutes les informations sont traitées de manière confidentielle.
          </p>
        </div>

        <Suspense fallback={<div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>}>
          <RentalApplicationForm />
        </Suspense>
      </div>
    </div>
  );
}
