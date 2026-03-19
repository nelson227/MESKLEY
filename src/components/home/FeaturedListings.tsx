"use client";

import Link from "next/link";
import { MapPin, BedDouble, Maximize, ArrowRight } from "lucide-react";
import { formatPrice, isNewListing, getPropertyTypeLabel } from "@/lib/utils";
import { apiUrl } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { ListingCardData } from "@/types/listing";

async function fetchFeatured() {
  const res = await fetch(apiUrl("/api/logements?limit=6&sort=date_desc"));
  const data = await res.json();
  return data.success ? (data.data as ListingCardData[]) : [];
}

export default function FeaturedListings() {
  const { data: listings = [], isLoading: loading } = useQuery({
    queryKey: ["listings", "featured"],
    queryFn: fetchFeatured,
  });

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold text-sm uppercase tracking-[3px] mb-3">Notre sélection</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-black" style={{ fontFamily: "'Playfair Display', serif" }}>
              Logements en vedette
            </h2>
            <div className="w-20 h-1 bg-gold mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-light animate-pulse">
                <div className="h-56 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (listings.length === 0) return null;

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Image de fond de toute la section */}
      <img
        aria-hidden="true"
        src="/fond-de-page.png"
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.25,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          {listings.map((listing) => (
            <Link
              key={listing._id}
              href={`/logements/${listing._id}`}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-light"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={listing.mainPhoto || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80"}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                  <p className="text-white text-xl font-bold">{formatPrice(listing.price)}<span className="text-sm font-normal">/mois</span></p>
                </div>
              </div>

              {/* Infos */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-black mb-3 group-hover:text-gold transition-colors line-clamp-1" style={{ fontFamily: "'Playfair Display', serif" }}>
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
                  {listing.furnished && (
                    <span className="text-gold text-xs font-medium">Meublé</span>
                  )}
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
