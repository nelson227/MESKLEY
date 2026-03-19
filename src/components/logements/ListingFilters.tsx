"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X, RotateCcw } from "lucide-react";
import { PROPERTY_TYPES, SORT_OPTIONS, ROOMS_OPTIONS } from "@/constants/filters";
import type { ListingFilters } from "@/types/listing";

interface ListingFiltersProps {
  filters: ListingFilters;
  onFilterChange: (filters: ListingFilters) => void;
}

export default function ListingFiltersBar({ filters, onFilterChange }: ListingFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [search, setSearch] = useState(filters.search || "");

  const updateFilter = (key: keyof ListingFilters, value: string | number | boolean | undefined) => {
    onFilterChange({ ...filters, [key]: value, page: 1 });
  };

  const resetFilters = () => {
    setSearch("");
    onFilterChange({ page: 1, limit: 12 });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter("search", search);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-light">
      {/* Barre de recherche */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray" />
          <input
            type="text"
            placeholder="Rechercher par quartier, ville ou mot-clé..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
          />
        </div>
        <button type="submit" className="px-6 py-3 bg-gold text-black rounded-lg font-semibold text-sm hover:bg-gold-dark transition-colors">
          Rechercher
        </button>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-4 py-3 border border-gray-light rounded-lg text-gray hover:border-gold hover:text-gold transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </form>

      {/* Filtres principaux */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filters.type || ""}
          onChange={(e) => updateFilter("type", e.target.value || undefined)}
          className="px-4 py-2 border border-gray-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
        >
          <option value="">Type de bien</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        <select
          value={filters.rooms || ""}
          onChange={(e) => updateFilter("rooms", e.target.value ? Number(e.target.value) : undefined)}
          className="px-4 py-2 border border-gray-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
        >
          <option value="">Pièces</option>
          {ROOMS_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>

        <select
          value={filters.sort || "date_desc"}
          onChange={(e) => updateFilter("sort", e.target.value as ListingFilters["sort"])}
          className="px-4 py-2 border border-gray-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <label className="flex items-center gap-2 px-4 py-2 border border-gray-light rounded-lg text-sm cursor-pointer hover:border-gold">
          <input
            type="checkbox"
            checked={filters.furnished || false}
            onChange={(e) => updateFilter("furnished", e.target.checked || undefined)}
            className="accent-gold"
          />
          Meublé
        </label>

        <button onClick={resetFilters} className="flex items-center gap-1 px-4 py-2 text-sm text-gray hover:text-gold transition-colors">
          <RotateCcw className="w-4 h-4" />
          Réinitialiser
        </button>
      </div>

      {/* Filtres avancés */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-light grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-gray mb-1 block">Prix min ($)</label>
            <input
              type="number"
              value={filters.minPrice || ""}
              onChange={(e) => updateFilter("minPrice", e.target.value ? Number(e.target.value) : undefined)}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
          <div>
            <label className="text-xs text-gray mb-1 block">Prix max ($)</label>
            <input
              type="number"
              value={filters.maxPrice || ""}
              onChange={(e) => updateFilter("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
              placeholder="1 000 000"
              className="w-full px-3 py-2 border border-gray-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
          <div>
            <label className="text-xs text-gray mb-1 block">Surface min (m²)</label>
            <input
              type="number"
              value={filters.minSurface || ""}
              onChange={(e) => updateFilter("minSurface", e.target.value ? Number(e.target.value) : undefined)}
              placeholder="20"
              className="w-full px-3 py-2 border border-gray-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
          <div>
            <label className="text-xs text-gray mb-1 block">Ville</label>
            <input
              type="text"
              value={filters.city || ""}
              onChange={(e) => updateFilter("city", e.target.value || undefined)}
              placeholder="Montréal"
              className="w-full px-3 py-2 border border-gray-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
        </div>
      )}
    </div>
  );
}
