"use client";

import { useQuery } from "@tanstack/react-query";
import type { ListingFilters, ListingCardData } from "@/types/listing";
import type { PaginatedResponse } from "@/types/common";
import { apiUrl } from "@/lib/api";

async function fetchListings(filters: ListingFilters): Promise<PaginatedResponse<ListingCardData>> {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.type) params.set("type", filters.type);
  if (filters.city) params.set("city", filters.city);
  if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
  if (filters.minSurface) params.set("minSurface", String(filters.minSurface));
  if (filters.maxSurface) params.set("maxSurface", String(filters.maxSurface));
  if (filters.rooms) params.set("rooms", String(filters.rooms));
  if (filters.furnished !== undefined) params.set("furnished", String(filters.furnished));
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.page) params.set("page", String(filters.page));

  const res = await fetch(apiUrl(`/api/logements?${params.toString()}`));
  if (!res.ok) throw new Error("Erreur lors du chargement des logements");
  return res.json();
}

export function useListings(filters: ListingFilters) {
  return useQuery({
    queryKey: ["listings", filters],
    queryFn: () => fetchListings(filters),
  });
}

async function fetchListing(id: string) {
  const res = await fetch(apiUrl(`/api/logements/${id}`));
  if (!res.ok) throw new Error("Logement introuvable");
  const data = await res.json();
  return data.data;
}

export function useListing(id: string) {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: () => fetchListing(id),
    enabled: !!id,
  });
}
