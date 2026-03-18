"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { listingSchema } from "@/lib/validations";
import { PROPERTY_TYPES, FEATURES_LIST } from "@/constants/filters";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { z } from "zod";

type FormData = z.infer<typeof listingSchema>;

interface ListingFormProps {
  initialData?: Partial<FormData> & { _id?: string };
}

export default function ListingForm({ initialData }: ListingFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const isEdit = !!initialData?._id;

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      type: "appartement",
      status: "brouillon",
      furnished: false,
      chargesIncluded: false,
      charges: 0,
      features: [],
      latitude: 3.848,
      longitude: 11.5021,
      ...initialData,
    },
  });

  const selectedFeatures = watch("features") || [];

  const toggleFeature = (feat: string) => {
    const current = selectedFeatures;
    setValue("features", current.includes(feat) ? current.filter((f) => f !== feat) : [...current, feat]);
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const url = isEdit ? `/api/logements/${initialData?._id}` : "/api/logements";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Erreur");

      // Upload photos si présentes
      if (photos.length > 0) {
        const formData = new FormData();
        photos.forEach((p) => formData.append("photos", p));
        formData.append("listingId", result.data?._id || initialData?._id || "");
        await fetch("/api/upload", { method: "POST", body: formData });
      }

      toast.success(isEdit ? "Logement mis à jour" : "Logement créé");
      router.push("/admin/logements");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Infos de base */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Informations générales</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>Titre *</label>
            <input {...register("title")} className={inputClass} placeholder="Appartement 3 pièces à Bastos" />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Type de bien *</label>
            <select {...register("type")} className={inputClass}>
              {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Statut</label>
            <select {...register("status")} className={inputClass}>
              <option value="brouillon">Brouillon</option>
              <option value="disponible">Disponible</option>
              <option value="reserve">Réservé</option>
              <option value="loue">Loué</option>
              <option value="retire">Retiré</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Description *</label>
            <textarea {...register("description")} className={inputClass} rows={5} />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>
        </div>
      </section>

      {/* Prix */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Tarification</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Loyer mensuel (FCFA) *</label>
            <input type="number" {...register("price", { valueAsNumber: true })} className={inputClass} />
            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Caution (FCFA) *</label>
            <input type="number" {...register("deposit", { valueAsNumber: true })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Charges (FCFA)</label>
            <input type="number" {...register("charges", { valueAsNumber: true })} className={inputClass} />
          </div>
          <label className="flex items-center gap-2 col-span-full">
            <input type="checkbox" {...register("chargesIncluded")} className="accent-gold" />
            <span className="text-sm">Charges incluses</span>
          </label>
        </div>
      </section>

      {/* Caractéristiques */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Caractéristiques</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Surface (m²) *</label>
            <input type="number" {...register("surface", { valueAsNumber: true })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Pièces *</label>
            <input type="number" {...register("rooms", { valueAsNumber: true })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Chambres *</label>
            <input type="number" {...register("bedrooms", { valueAsNumber: true })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Salles de bain *</label>
            <input type="number" {...register("bathrooms", { valueAsNumber: true })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Étage</label>
            <input type="number" {...register("floor", { valueAsNumber: true })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Disponible le *</label>
            <input type="date" {...register("availableDate")} className={inputClass} />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("furnished")} className="accent-gold" />
            <span className="text-sm">Meublé</span>
          </label>
        </div>
      </section>

      {/* Localisation */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Localisation</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>Adresse *</label>
            <input {...register("address")} className={inputClass} placeholder="123 Rue de l'Indépendance" />
          </div>
          <div>
            <label className={labelClass}>Ville *</label>
            <input {...register("city")} className={inputClass} placeholder="Yaoundé" />
          </div>
          <div>
            <label className={labelClass}>Quartier *</label>
            <input {...register("neighborhood")} className={inputClass} placeholder="Bastos" />
          </div>
          <div>
            <label className={labelClass}>Latitude</label>
            <input type="number" step="any" {...register("latitude", { valueAsNumber: true })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Longitude</label>
            <input type="number" step="any" {...register("longitude", { valueAsNumber: true })} className={inputClass} />
          </div>
        </div>
      </section>

      {/* Équipements */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Équipements</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {FEATURES_LIST.map((feat) => (
            <label key={feat.value} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${selectedFeatures.includes(feat.value) ? "border-gold bg-gold/5" : "border-gray-200 hover:border-gray-300"}`}>
              <input type="checkbox" checked={selectedFeatures.includes(feat.value)} onChange={() => toggleFeature(feat.value)} className="accent-gold" />
              <span className="text-sm">{feat.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Liens */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Liens externes</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Lien Facebook Marketplace</label>
            <input {...register("facebookMarketplaceUrl")} className={inputClass} placeholder="https://www.facebook.com/marketplace/..." />
          </div>
          <div>
            <label className={labelClass}>Lien Messenger</label>
            <input {...register("messengerLink")} className={inputClass} placeholder="https://m.me/..." />
          </div>
        </div>
      </section>

      {/* Photos */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Photos</h3>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setPhotos(Array.from(e.target.files || []))}
          className="text-sm"
        />
        {photos.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {photos.map((p, i) => (
              <div key={i} className="w-20 h-16 rounded-lg overflow-hidden bg-gray-100">
                <img src={URL.createObjectURL(p)} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex gap-3 justify-end">
        <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-200 rounded-lg text-sm font-medium hover:border-gray-400 transition-colors">
          Annuler
        </button>
        <button type="submit" disabled={submitting} className="px-8 py-3 bg-gold text-black rounded-lg text-sm font-bold hover:bg-gold-dark transition-colors disabled:opacity-50">
          {submitting ? "Enregistrement..." : isEdit ? "Mettre à jour" : "Créer le logement"}
        </button>
      </div>
    </form>
  );
}
