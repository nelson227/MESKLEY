"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { listingSchema } from "@/lib/validations";
import { apiUrl } from "@/lib/api";
import { PROPERTY_TYPES, FEATURES_LIST } from "@/constants/filters";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2, ImageIcon, Video } from "lucide-react";
import type { z } from "zod";

type FormData = z.infer<typeof listingSchema>;

interface ListingFormProps {
  initialData?: Partial<FormData> & { _id?: string };
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

async function getUploadSignature() {
  const token = localStorage.getItem("admin_token");
  const res = await fetch(apiUrl("/api/upload/signature"), {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Impossible d'obtenir les paramètres d'upload");
  const data = await res.json();
  return data.data;
}

async function uploadToCloudinary(file: File, resourceType: "image" | "video") {
  const sig = await getUploadSignature();
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", sig.apiKey);
  formData.append("timestamp", String(sig.timestamp));
  formData.append("signature", sig.signature);
  formData.append("folder", sig.folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/${resourceType}/upload`,
    { method: "POST", body: formData }
  );
  if (!res.ok) throw new Error("Erreur d'upload");
  const result = await res.json();
  return result.secure_url as string;
}

export default function ListingForm({ initialData }: ListingFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>(initialData?.photos || []);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>(initialData?.videos || []);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const isEdit = !!initialData?._id;

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(listingSchema) as any,
    defaultValues: {
      type: "appartement",
      status: "brouillon",
      furnished: false,
      chargesIncluded: false,
      charges: 0,
      features: [],
      photos: [],
      videos: [],
      latitude: 45.5017,
      longitude: -73.5673,
      ...initialData,
    },
  });

  const selectedFeatures = watch("features") || [];

  const toggleFeature = (feat: string) => {
    const current = selectedFeatures;
    setValue("features", current.includes(feat) ? current.filter((f) => f !== feat) : [...current, feat]);
  };

  const handlePhotoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const toUpload = Array.from(files);

    for (const file of toUpload) {
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(`"${file.name}" dépasse la limite de 10 Mo`);
        return;
      }
    }

    setUploadingPhotos(true);
    try {
      const urls: string[] = [];
      for (const file of toUpload) {
        const url = await uploadToCloudinary(file, "image");
        urls.push(url);
      }
      const newPhotos = [...uploadedPhotos, ...urls];
      setUploadedPhotos(newPhotos);
      setValue("photos", newPhotos);
      toast.success(`${urls.length} photo(s) ajoutée(s)`);
    } catch {
      toast.error("Erreur lors de l'upload des photos");
    } finally {
      setUploadingPhotos(false);
    }
  };

  const handleVideoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const toUpload = Array.from(files);

    for (const file of toUpload) {
      if (file.size > MAX_VIDEO_SIZE) {
        toast.error(`"${file.name}" dépasse la limite de 100 Mo`);
        return;
      }
    }

    setUploadingVideos(true);
    try {
      const urls: string[] = [];
      for (const file of toUpload) {
        const url = await uploadToCloudinary(file, "video");
        urls.push(url);
      }
      const newVideos = [...uploadedVideos, ...urls];
      setUploadedVideos(newVideos);
      setValue("videos", newVideos);
      toast.success(`${urls.length} vidéo(s) ajoutée(s)`);
    } catch {
      toast.error("Erreur lors de l'upload des vidéos");
    } finally {
      setUploadingVideos(false);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = uploadedPhotos.filter((_, i) => i !== index);
    setUploadedPhotos(newPhotos);
    setValue("photos", newPhotos);
  };

  const removeVideo = (index: number) => {
    const newVideos = uploadedVideos.filter((_, i) => i !== index);
    setUploadedVideos(newVideos);
    setValue("videos", newVideos);
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const url = isEdit ? apiUrl(`/api/logements/${initialData?._id}`) : apiUrl("/api/logements");
      const method = isEdit ? "PUT" : "POST";
      const token = localStorage.getItem("admin_token");

      const payload = { ...data, photos: uploadedPhotos, videos: uploadedVideos };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Erreur");

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
            <input {...register("title")} className={inputClass} placeholder="Appartement 3 pièces — Plateau Mont-Royal" />
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
            <textarea {...register("description")} className={inputClass} rows={5} placeholder="Décrivez le logement en détail : état, luminosité, vue, aménagements..." />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>
        </div>
      </section>

      {/* Prix */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Tarification</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Loyer mensuel ($CAD) *</label>
            <input type="number" {...register("price", { valueAsNumber: true })} className={inputClass} />
            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Caution ($CAD) *</label>
            <input type="number" {...register("deposit", { valueAsNumber: true })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Charges ($CAD)</label>
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
            <input {...register("address")} className={inputClass} placeholder="1234 Rue Saint-Denis" />
          </div>
          <div>
            <label className={labelClass}>Ville *</label>
            <input {...register("city")} className={inputClass} placeholder="Montréal" />
          </div>
          <div>
            <label className={labelClass}>Quartier *</label>
            <input {...register("neighborhood")} className={inputClass} placeholder="Plateau Mont-Royal" />
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
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-gold" />
          Photos
        </h3>
        <p className="text-xs text-gray-500 mb-4">10 Mo max par photo — Formats : JPG, PNG, WebP</p>

        <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${uploadingPhotos ? "border-gold bg-gold/5" : "border-gray-300 hover:border-gold hover:bg-gray-50"}`}>
          {uploadingPhotos ? (
            <div className="flex items-center gap-2 text-gold">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Upload en cours...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-500">Cliquer pour ajouter des photos</span>
            </div>
          )}
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={uploadingPhotos}
            onChange={(e) => handlePhotoUpload(e.target.files)}
          />
        </label>

        {uploadedPhotos.length > 0 && (
          <div className="flex gap-3 mt-4 flex-wrap">
            {uploadedPhotos.map((url, i) => (
              <div key={i} className="relative w-24 h-20 rounded-lg overflow-hidden bg-gray-100 group">
                <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Vidéos */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Video className="w-5 h-5 text-gold" />
          Vidéos
        </h3>
        <p className="text-xs text-gray-500 mb-4">100 Mo max par vidéo — Formats : MP4, MOV, WebM</p>

        <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${uploadingVideos ? "border-gold bg-gold/5" : "border-gray-300 hover:border-gold hover:bg-gray-50"}`}>
          {uploadingVideos ? (
            <div className="flex items-center gap-2 text-gold">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Upload vidéo en cours...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-500">Cliquer pour ajouter des vidéos</span>
            </div>
          )}
          <input
            type="file"
            multiple
            accept="video/mp4,video/quicktime,video/webm"
            className="hidden"
            disabled={uploadingVideos}
            onChange={(e) => handleVideoUpload(e.target.files)}
          />
        </label>

        {uploadedVideos.length > 0 && (
          <div className="flex gap-3 mt-4 flex-wrap">
            {uploadedVideos.map((url, i) => (
              <div key={i} className="relative w-40 h-24 rounded-lg overflow-hidden bg-gray-900 group">
                <video src={url} className="w-full h-full object-cover" muted />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="w-6 h-6 text-white/70" />
                </div>
                <button
                  type="button"
                  onClick={() => removeVideo(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex gap-3 justify-end">
        <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-200 rounded-lg text-sm font-medium hover:border-gray-400 transition-colors">
          Annuler
        </button>
        <button type="submit" disabled={submitting || uploadingPhotos || uploadingVideos} className="px-8 py-3 bg-gold text-black rounded-lg text-sm font-bold hover:bg-gold-dark transition-colors disabled:opacity-50">
          {submitting ? "Enregistrement..." : isEdit ? "Mettre à jour" : "Créer le logement"}
        </button>
      </div>
    </form>
  );
}
