import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gold text-sm uppercase tracking-[4px] mb-4 font-medium">
          Immobilier de confiance
        </p>
        <h1
          className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Trouvez votre{" "}
          <span className="text-gold">logement idéal</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10">
          MESKLEY LOCATION — Votre partenaire de confiance en immobilier.
          Découvrez notre sélection de biens de qualité.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/logements"
            className="px-8 py-4 bg-gold text-black rounded-full text-lg font-semibold hover:bg-gold-dark transition-all transform hover:scale-105"
          >
            Explorer nos logements
          </Link>
          <Link
            href="/demande-location"
            className="px-8 py-4 border-2 border-white text-white rounded-full text-lg font-semibold hover:bg-white hover:text-black transition-all"
          >
            Faire une demande
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-gold rounded-full" />
        </div>
      </div>
    </section>
  );
}
