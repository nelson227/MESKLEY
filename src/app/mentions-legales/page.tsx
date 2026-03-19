import type { Metadata } from "next";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

export const metadata: Metadata = {
  title: "Mentions Légales",
};

export default function MentionsLegalesPage() {
  return (
    <div className="pt-32 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={[{ label: "Mentions légales" }]} />
        <h1 className="text-3xl font-bold text-black mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
          Mentions Légales
        </h1>
        <div className="prose prose-sm max-w-none text-gray space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-black">1. Éditeur du site</h2>
            <p>
              Le site <strong>MESKLEY LOCATION</strong> est édité par MESKLEY LOCATION, entreprise enregistrée au Québec, Canada.<br />
              Adresse : Montréal, QC, Canada<br />
              Email : contact@meskley-location.com<br />
              Téléphone : +1 438 387 1029
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-black">2. Hébergeur</h2>
            <p>Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-black">3. Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble des contenus (textes, images, logo, design) présents sur ce site sont la propriété exclusive de MESKLEY LOCATION.
              Toute reproduction, même partielle, est interdite sans autorisation préalable.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-black">4. Données personnelles</h2>
            <p>
              Les données collectées via les formulaires du site sont traitées conformément à notre politique de confidentialité.
              Elles sont utilisées uniquement pour le traitement des demandes et ne sont pas transmises à des tiers sans consentement.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-black">5. Responsabilité</h2>
            <p>
              MESKLEY LOCATION s&apos;efforce de fournir des informations exactes et à jour. Cependant, nous ne pouvons garantir
              l&apos;exactitude de toutes les informations. L&apos;utilisation du site se fait sous la responsabilité de l&apos;utilisateur.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-black">6. Cookies</h2>
            <p>
              Ce site utilise des cookies techniques nécessaires à son fonctionnement.
              Aucun cookie publicitaire ou de traçage n&apos;est utilisé.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
