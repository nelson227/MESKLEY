import Link from "next/link";
import { MapPin, BedDouble, Maximize, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const FEATURED_LISTINGS = [
  {
    id: "1",
    title: "Bel appartement 3 pièces — Bastos",
    type: "Appartement",
    price: 250000,
    surface: 85,
    bedrooms: 2,
    city: "Yaoundé",
    neighborhood: "Bastos",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    isNew: true,
  },
  {
    id: "2",
    title: "Villa moderne avec piscine",
    type: "Villa",
    price: 750000,
    surface: 200,
    bedrooms: 4,
    city: "Douala",
    neighborhood: "Bonanjo",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
    isNew: false,
  },
  {
    id: "3",
    title: "Studio meublé centre-ville",
    type: "Studio",
    price: 120000,
    surface: 35,
    bedrooms: 1,
    city: "Yaoundé",
    neighborhood: "Centre",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
    isNew: true,
  },
  {
    id: "4",
    title: "Duplex spacieux — Omnisport",
    type: "Duplex",
    price: 400000,
    surface: 150,
    bedrooms: 3,
    city: "Yaoundé",
    neighborhood: "Omnisport",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
    isNew: false,
  },
  {
    id: "5",
    title: "Maison familiale avec jardin",
    type: "Maison",
    price: 500000,
    surface: 180,
    bedrooms: 4,
    city: "Douala",
    neighborhood: "Akwa",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80",
    isNew: true,
  },
  {
    id: "6",
    title: "Appartement de standing",
    type: "Appartement",
    price: 350000,
    surface: 100,
    bedrooms: 2,
    city: "Yaoundé",
    neighborhood: "Mvan",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80",
    isNew: false,
  },
];

export default function FeaturedListings() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre */}
        <div className="text-center mb-14">
          <p className="text-gold text-sm uppercase tracking-[3px] mb-3">Notre sélection</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-black" style={{ fontFamily: "'Playfair Display', serif" }}>
            Logements en vedette
          </h2>
          <div className="w-20 h-1 bg-gold mx-auto mt-4" />
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_LISTINGS.map((listing) => (
            <Link
              key={listing.id}
              href={`/logements/${listing.id}`}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-light"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {listing.isNew && (
                  <span className="absolute top-3 left-3 bg-gold text-black text-xs font-bold px-3 py-1 rounded-full">
                    Nouveau
                  </span>
                )}
                <span className="absolute top-3 right-3 bg-white/90 text-black text-xs font-medium px-3 py-1 rounded-full">
                  {listing.type}
                </span>
                <div className="absolute bottom-3 left-3">
                  <p className="text-white text-xl font-bold">{formatPrice(listing.price)}<span className="text-sm font-normal">/mois</span></p>
                </div>
              </div>

              {/* Infos */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-black mb-3 group-hover:text-gold transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {listing.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gold" />
                    {listing.neighborhood}, {listing.city}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-light text-sm text-gray">
                  <span className="flex items-center gap-1">
                    <BedDouble className="w-4 h-4" />
                    {listing.bedrooms} ch.
                  </span>
                  <span className="flex items-center gap-1">
                    <Maximize className="w-4 h-4" />
                    {listing.surface} m²
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/logements"
            className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white rounded-full font-semibold hover:bg-gold hover:text-black transition-colors"
          >
            Voir tous les logements
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
