import { Suspense } from "react";
import ConfirmationPage from "@/components/shared/ConfirmationPage";

function ConfirmationContent() {
  return (
    <ConfirmationPage
      title="Demande envoyée avec succès !"
      description="Votre dossier de location a été soumis. Notre équipe l'examinera dans les plus brefs délais et vous contactera pour la suite."
      backLink="/logements"
      backLabel="Retour aux logements"
    />
  );
}

export default function DemandeConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-32"><div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full" /></div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
