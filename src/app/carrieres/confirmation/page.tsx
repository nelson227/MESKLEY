import { Suspense } from "react";
import ConfirmationPage from "@/components/shared/ConfirmationPage";

function ConfirmationContent() {
  return (
    <ConfirmationPage
      title="Candidature envoyée !"
      description="Votre candidature a été soumise avec succès. Notre équipe RH l'examinera et vous contactera si votre profil correspond à nos besoins."
      backLink="/carrieres"
      backLabel="Retour aux carrières"
    />
  );
}

export default function CarrieresConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-32"><div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full" /></div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
