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

      {/* Infos avec image de fond */}
      <div className="relative p-5" style={{ overflow: "hidden" }}>
        {/* Image de fond */}
        <img
          src="/fond%20de%20page.png"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.15,
            pointerEvents: "none",
          }}
        />
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
