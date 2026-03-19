"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiUrl } from "@/lib/api";
import ListingForm from "@/components/admin/ListingForm";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function EditLogementPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(apiUrl(`/api/logements/${id}`));
        const data = await res.json();
        if (data.success) setListing(data.data);
      } catch {
        // Silencieux
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  if (!listing) return <p className="text-gray-500">Logement introuvable.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Modifier le logement</h1>
      <ListingForm initialData={listing} />
    </div>
  );
}
