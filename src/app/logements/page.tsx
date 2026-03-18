"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ListingCard from "@/components/logements/ListingCard";
import ListingFiltersBar from "@/components/logements/ListingFilters";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import { Home } from "lucide-react";
import type { ListingFilters, ListingCardData } from "@/types/listing";

export default function LogementsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [listings, setListings] = useState<ListingCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<ListingFilters>({
    page: 1,
    limit: 12,
    search: searchParams.get("search") || undefined,
    type: (searchParams.get("type") as ListingFilters["type"]) || undefined,
    sort: (searchParams.get("sort") as ListingFilters["sort"]) || "date_desc",
  });

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
      });
      const res = await fetch(`/api/logements?${params}`);
      const data = await res.json();
      if (data.success) {
        setListings(data.data || []);
        setTotal(data.pagination?.total || 0);
      }
    } catch {
      // Silencieux
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleFilterChange = (newFilters: ListingFilters) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
    });
    router.replace(`/logements?${params}`, { scroll: false });
  };

  return (
    <div className="pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={[{ label: "Logements" }]} />

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Nos Logements
          </h1>
          <p className="text-gray">
            {total > 0 ? `${total} logement${total > 1 ? "s" : ""} disponible${total > 1 ? "s" : ""}` : "Découvrez notre catalogue"}
          </p>
        </div>

        <ListingFiltersBar filters={filters} onFilterChange={handleFilterChange} />

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : listings.length === 0 ? (
          <EmptyState
            icon={<Home className="w-12 h-12 text-gray" />}
            title="Aucun logement trouvé"
            description="Essayez de modifier vos critères de recherche."
          />
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>

            {/* Pagination */}
            {total > filters.limit! && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: Math.ceil(total / filters.limit!) }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handleFilterChange({ ...filters, page: i + 1 })}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      filters.page === i + 1
                        ? "bg-gold text-black"
                        : "border border-gray-light text-gray hover:border-gold hover:text-gold"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
