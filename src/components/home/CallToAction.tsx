import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-r from-black-deep to-black relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2
          className="text-3xl sm:text-4xl font-bold text-white mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Un logement vous <span className="text-gold">intéresse</span> ?
        </h2>
        <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
          Faites une demande de location en ligne ou contactez-nous directement.
          Notre équipe vous répond sous 48 heures.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/demande-location"
            className="px-8 py-4 bg-gold text-black rounded-full text-lg font-semibold hover:bg-gold-dark transition-colors"
          >
            Faire une demande
          </Link>
          <Link
            href="/contact"
            className="px-8 py-4 border-2 border-gold text-gold rounded-full text-lg font-semibold hover:bg-gold hover:text-black transition-colors"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </section>
  );
}
