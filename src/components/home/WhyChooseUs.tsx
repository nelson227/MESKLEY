import { Home, CheckCircle, MapPin, MessageCircle } from "lucide-react";

const REASONS = [
  {
    icon: <Home className="w-8 h-8" />,
    title: "Large choix de biens",
    description: "Appartements, villas, studios, maisons... Trouvez le logement qui correspond parfaitement à vos besoins.",
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: "Annonces vérifiées",
    description: "Chaque annonce est vérifiée pour vous garantir des informations fiables et des biens de qualité.",
  },
  {
    icon: <MapPin className="w-8 h-8" />,
    title: "Localisation précise",
    description: "Carte interactive pour visualiser chaque bien et explorer les quartiers avant votre visite.",
  },
  {
    icon: <MessageCircle className="w-8 h-8" />,
    title: "Contact direct et rapide",
    description: "Contactez-nous directement via Messenger ou notre formulaire pour une réponse sous 48h.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-white-off">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-gold text-sm uppercase tracking-[3px] mb-3">Nos avantages</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-black" style={{ fontFamily: "'Playfair Display', serif" }}>
            Pourquoi MESKLEY LOCATION ?
          </h2>
          <div className="w-20 h-1 bg-gold mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {REASONS.map((reason, index) => (
            <div
              key={index}
              className="text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-16 h-16 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto mb-5 group-hover:bg-gold group-hover:text-black transition-colors">
                {reason.icon}
              </div>
              <h3 className="text-lg font-semibold text-black mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                {reason.title}
              </h3>
              <p className="text-gray text-sm leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
