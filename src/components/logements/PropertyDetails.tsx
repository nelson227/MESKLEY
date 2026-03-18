import { BedDouble, Bath, Maximize, Layers, Calendar, Armchair } from "lucide-react";
import { formatPrice, formatDate, getPropertyTypeLabel } from "@/lib/utils";
import type { Listing } from "@/types/listing";

interface PropertyDetailsProps {
  listing: Listing;
}

export default function PropertyDetails({ listing }: PropertyDetailsProps) {
  return (
    <div>
      {/* Prix */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-bold text-gold">{formatPrice(listing.price)}</span>
        <span className="text-gray text-lg">/mois</span>
      </div>

      {/* Infos clés */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white-off p-4 rounded-lg">
          <Maximize className="w-5 h-5 text-gold mb-1" />
          <p className="text-sm text-gray">Surface</p>
          <p className="font-semibold">{listing.surface} m²</p>
        </div>
        <div className="bg-white-off p-4 rounded-lg">
          <BedDouble className="w-5 h-5 text-gold mb-1" />
          <p className="text-sm text-gray">Chambres</p>
          <p className="font-semibold">{listing.bedrooms}</p>
        </div>
        <div className="bg-white-off p-4 rounded-lg">
          <Bath className="w-5 h-5 text-gold mb-1" />
          <p className="text-sm text-gray">Salles de bain</p>
          <p className="font-semibold">{listing.bathrooms}</p>
        </div>
        <div className="bg-white-off p-4 rounded-lg">
          <Layers className="w-5 h-5 text-gold mb-1" />
          <p className="text-sm text-gray">Type</p>
          <p className="font-semibold">{getPropertyTypeLabel(listing.type)}</p>
        </div>
        <div className="bg-white-off p-4 rounded-lg">
          <Armchair className="w-5 h-5 text-gold mb-1" />
          <p className="text-sm text-gray">Meublé</p>
          <p className="font-semibold">{listing.furnished ? "Oui" : "Non"}</p>
        </div>
        <div className="bg-white-off p-4 rounded-lg">
          <Calendar className="w-5 h-5 text-gold mb-1" />
          <p className="text-sm text-gray">Disponible</p>
          <p className="font-semibold">{formatDate(listing.availableDate)}</p>
        </div>
      </div>

      {/* Détails financiers */}
      <div className="border border-gray-light rounded-lg p-5 mb-6">
        <h3 className="font-semibold text-black mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Détails financiers
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray">Loyer mensuel</span>
            <span className="font-semibold">{formatPrice(listing.price)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray">Caution</span>
            <span className="font-semibold">{formatPrice(listing.deposit)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray">Charges</span>
            <span className="font-semibold">
              {listing.chargesIncluded ? "Incluses" : listing.charges > 0 ? formatPrice(listing.charges) : "Non incluses"}
            </span>
          </div>
          {listing.floor !== null && (
            <div className="flex justify-between">
              <span className="text-gray">Étage</span>
              <span className="font-semibold">{listing.floor === 0 ? "RDC" : listing.floor}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray">Pièces</span>
            <span className="font-semibold">{listing.rooms}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray">Référence</span>
            <span className="font-semibold text-gold">{listing.reference}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h3 className="font-semibold text-black mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
          Description
        </h3>
        <p className="text-gray text-sm leading-relaxed whitespace-pre-line">{listing.description}</p>
      </div>
    </div>
  );
}
