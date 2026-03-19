import Link from "next/link";
import { MapPin, BedDouble, Maximize, Eye } from "lucide-react";
import { formatPrice, isNewListing, getPropertyTypeLabel } from "@/lib/utils";
import type { ListingCardData } from "@/types/listing";

interface ListingCardProps {
  listing: ListingCardData;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const mainPhoto = listing.mainPhoto || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80";

  return (
    <Link
      href={`/logements/${listing._id}`}
      className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-light"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={mainPhoto}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {isNewListing(listing.createdAt) && (
          <span className="absolute top-3 left-3 bg-gold text-black text-xs font-bold px-3 py-1 rounded-full">
            Nouveau
          </span>
        )}

        <span className="absolute top-3 right-3 bg-white/90 text-black text-xs font-medium px-3 py-1 rounded-full">
          {getPropertyTypeLabel(listing.type)}
        </span>

        {listing.status === "reserve" && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-yellow-500 text-black text-sm font-bold px-4 py-2 rounded-full">Réservé</span>
          </div>
        )}

        <div className="absolute bottom-3 left-3">
          <p className="text-white text-xl font-bold">
            {formatPrice(listing.price)}
            <span className="text-sm font-normal">/mois</span>
          </p>
        </div>
      </div>

      {/* Infos avec logo en arrière-plan */}
      <div className="relative p-5" style={{ overflow: "hidden", background: "#fff" }}>
        {/* Logo SVG watermark */}
        <svg
          aria-hidden="true"
          viewBox="0 0 120 120"
          style={{
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "100px",
            height: "100px",
            opacity: 0.08,
            pointerEvents: "none",
          }}
        >
          {/* Maison stylisée */}
          <path d="M60 10 L15 50 L25 50 L25 95 L50 95 L50 65 L70 65 L70 95 L95 95 L95 50 L105 50 Z" fill="#C8A95E" />
          {/* Cheminée */}
          <rect x="75" y="22" width="10" height="20" fill="#C8A95E" />
          {/* Porte */}
          <rect x="52" y="70" width="16" height="25" rx="2" fill="#fff" />
          {/* Fenêtre gauche */}
          <rect x="32" y="55" width="14" height="14" rx="1" fill="#fff" />
          {/* Fenêtre droite */}
          <rect x="74" y="55" width="14" height="14" rx="1" fill="#fff" />
          {/* Texte MESKLEY */}
          <text x="60" y="112" textAnchor="middle" fontSize="11" fontWeight="bold" fontFamily="serif" fill="#C8A95E">MESKLEY</text>
        </svg>
        <div style={{ position: "relative", zIndex: 1 }}>
          <h3
            className="text-lg font-semibold text-black mb-2 group-hover:text-gold transition-colors line-clamp-1"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {listing.title}
          </h3>
          <div className="flex items-center gap-1 text-sm text-gray mb-3">
            <MapPin className="w-4 h-4 text-gold" />
            {listing.neighborhood}, {listing.city}
          </div>
          <div className="flex items-center gap-5 pt-3 border-t border-gray-light text-sm text-gray">
            <span className="flex items-center gap-1">
              <BedDouble className="w-4 h-4" />
              {listing.bedrooms} ch.
            </span>
            <span className="flex items-center gap-1">
              <Maximize className="w-4 h-4" />
              {listing.surface} m²
            </span>
            {listing.furnished && (
              <span className="text-gold text-xs font-medium">Meublé</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
