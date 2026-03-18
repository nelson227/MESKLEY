import type { Metadata } from "next";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="pt-32 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={[{ label: "Politique de confidentialité" }]} />
        <h1 className="text-3xl font-bold text-black mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
          Politique de Confidentialité
        </h1>
        <div className="prose prose-sm max-w-none text-gray space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-black">1. Collecte des données</h2>
            <p>
              MESKLEY LOCATION collecte vos données personnelles uniquement lorsque vous remplissez un formulaire
              (demande de location, candidature, contact). Les données collectées incluent : nom, email, téléphone,
              informations professionnelles et documents éventuels.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-black">2. Utilisation des données</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Traiter votre demande de location ou candidature</li>
              <li>Vous contacter pour le suivi de votre dossier</li>
              <li>Répondre à vos messages via le formulaire de contact</li>
              <li>Améliorer nos services</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-black">3. Conservation des données</h2>
            <p>
              Vos données sont conservées pour la durée nécessaire au traitement de votre demande,
              puis supprimées dans un délai maximum de 24 mois après le dernier contact.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-black">4. Partage des données</h2>
            <p>
              Vos données ne sont jamais vendues ni partagées avec des tiers à des fins commerciales.
              Elles peuvent être partagées avec nos partenaires techniques (hébergeur, service email) uniquement
              dans le cadre du fonctionnement du service.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-black">5. Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données
              contre tout accès non autorisé, perte ou altération. Les données sensibles sont chiffrées.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-black">6. Vos droits</h2>
            <p>Conformément à la réglementation, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Droit d&apos;accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit de suppression</li>
              <li>Droit d&apos;opposition au traitement</li>
            </ul>
            <p>Pour exercer ces droits, contactez-nous à : contact@meskley-location.com</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-black">7. Modifications</h2>
            <p>
              Cette politique peut être mise à jour. La dernière version en vigueur est toujours accessible sur cette page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
