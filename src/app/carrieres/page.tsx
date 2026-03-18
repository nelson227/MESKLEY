import type { Metadata } from "next";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import JobApplicationForm from "@/components/forms/JobApplicationForm";
import { Briefcase, Users, TrendingUp, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Carrières",
  description: "Rejoignez l'équipe MESKLEY LOCATION. Découvrez nos offres d'emploi et postulez en ligne.",
};

const values = [
  { icon: Users, title: "Esprit d'équipe", description: "Nous croyons en la force du collectif pour atteindre l'excellence." },
  { icon: TrendingUp, title: "Évolution", description: "Des opportunités de développement professionnel à chaque étape." },
  { icon: Heart, title: "Passion", description: "L'immobilier est notre passion, le service client notre mission." },
  { icon: Briefcase, title: "Professionnalisme", description: "Rigueur et exigence dans chaque aspect de notre travail." },
];

export default function CarrieresPage() {
  return (
    <div className="pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={[{ label: "Carrières" }]} />

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-black mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Rejoignez Notre Équipe
          </h1>
          <p className="text-gray max-w-2xl mx-auto">
            MESKLEY LOCATION est en pleine croissance. Nous recherchons des talents passionnés par l&apos;immobilier pour renforcer notre équipe.
          </p>
        </div>

        {/* Nos valeurs */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {values.map((v) => (
            <div key={v.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-light text-center">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <v.icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-semibold text-black mb-2">{v.title}</h3>
              <p className="text-sm text-gray">{v.description}</p>
            </div>
          ))}
        </div>

        {/* Formulaire */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-black mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Candidature Spontanée
          </h2>
          <p className="text-gray">Envoyez-nous votre candidature, nous la traiterons avec attention.</p>
        </div>
        <JobApplicationForm />
      </div>
    </div>
  );
}
