import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import PhotoGallery from "@/components/logements/PhotoGallery";
import PropertyDetails from "@/components/logements/PropertyDetails";
import PropertyFeatures from "@/components/logements/PropertyFeatures";
import LocationMap from "@/components/logements/LocationMap";
import ActionButtons from "@/components/logements/ActionButtons";
import type { Metadata } from "next";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function getListing(id: string) {
  try {
    const res = await fetch(`${API_BASE}/api/logements/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) return { title: "Logement introuvable" };
  return {
    title: listing.title,
    description: `${listing.type} à ${listing.neighborhood}, ${listing.city} — ${listing.price?.toLocaleString("fr-CA")} $/mois`,
  };
}

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) notFound();

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Logements", href: "/logements" },
            { label: listing.title },
          ]}
        />

        <div className="grid lg:grid-cols-3 gap-8 mt-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2">
            <PhotoGallery photos={listing.photos || []} videos={listing.videos || []} title={listing.title} />
            <div className="mt-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-black mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                {listing.title}
              </h1>
            </div>
            <div className="mt-6">
              <PropertyDetails listing={listing} />
              <PropertyFeatures features={listing.features || []} />
            </div>

            {/* Localisation */}
            {listing.latitude && listing.longitude && (
              <div className="mt-6">
                <h3 className="font-semibold text-black mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Localisation
                </h3>
                <LocationMap
                  latitude={listing.latitude}
                  longitude={listing.longitude}
                  title={listing.title}
                  address={`${listing.address}, ${listing.neighborhood}, ${listing.city}`}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-light">
                <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Intéressé par ce logement ?
                </h3>
                <ActionButtons
                  facebookMarketplaceUrl={listing.facebookMarketplaceUrl}
                  messengerLink={listing.messengerLink}
                  listingId={listing._id}
                  reference={listing.reference}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
