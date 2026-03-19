"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobApplicationSchema } from "@/lib/validations";
import { EDUCATION_LEVELS, EXPERIENCE_OPTIONS, AVAILABILITY_OPTIONS, POSITION_OPTIONS } from "@/constants/filters";
import FileUpload from "./FileUpload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { z } from "zod";

type FormData = z.infer<typeof jobApplicationSchema>;

export default function JobApplicationForm() {
  const router = useRouter();
  const [cv, setCv] = useState<File | undefined>();
  const [coverLetter, setCoverLetter] = useState<File | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(jobApplicationSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) formData.append(key, String(value));
      });
      if (cv) formData.append("cv", cv);
      if (coverLetter) formData.append("coverLetter", coverLetter);

      const res = await fetch("/api/candidatures", { method: "POST", body: formData });
      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Erreur lors de l'envoi");
      router.push(`/carrieres/confirmation?ref=${result.data?.referenceId || ""}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 border border-gray-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold";
  const labelClass = "block text-sm font-medium text-black mb-1";
  const errorClass = "text-xs text-red-500 mt-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 border border-gray-light">
      <h3 className="text-xl font-semibold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
        Postuler chez MESKLEY LOCATION
      </h3>

      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nom complet *</label>
            <input {...register("fullName")} className={inputClass} placeholder="Jean Dupont" />
            {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Email *</label>
            <input type="email" {...register("email")} className={inputClass} placeholder="email@exemple.com" />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Téléphone *</label>
            <input type="tel" {...register("phone")} className={inputClass} placeholder="+1 438 000 0000" />
            {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Poste souhaité *</label>
            <select {...register("desiredPosition")} className={inputClass}>
              <option value="">Sélectionner</option>
              {POSITION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {errors.desiredPosition && <p className={errorClass}>{errors.desiredPosition.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Niveau d&apos;études *</label>
            <select {...register("educationLevel")} className={inputClass}>
              <option value="">Sélectionner</option>
              {EDUCATION_LEVELS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {errors.educationLevel && <p className={errorClass}>{errors.educationLevel.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Années d&apos;expérience *</label>
            <select {...register("yearsExperience")} className={inputClass}>
              <option value="">Sélectionner</option>
              {EXPERIENCE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {errors.yearsExperience && <p className={errorClass}>{errors.yearsExperience.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Disponibilité *</label>
            <select {...register("availability")} className={inputClass}>
              <option value="">Sélectionner</option>
              {AVAILABILITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {errors.availability && <p className={errorClass}>{errors.availability.message}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass}>Message / Motivation</label>
          <textarea {...register("message")} className={inputClass} rows={4} placeholder="Présentez-vous et expliquez votre motivation..." />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FileUpload label="CV (PDF)" accept=".pdf" onFileChange={setCv} />
          <FileUpload label="Lettre de motivation (optionnel)" accept=".pdf" onFileChange={setCoverLetter} />
        </div>

        <div className="border-t border-gray-light pt-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" {...register("acceptTerms")} className="accent-gold w-5 h-5 mt-0.5" />
            <span className="text-sm text-gray">
              J&apos;accepte les <a href="/mentions-legales" className="text-gold hover:underline">conditions générales</a> et la <a href="/politique-confidentialite" className="text-gold hover:underline">politique de confidentialité</a>. *
            </span>
          </label>
          {errors.acceptTerms && <p className={errorClass}>{errors.acceptTerms.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full mt-6 py-3 bg-gold text-black rounded-lg font-semibold hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Envoi en cours..." : "Envoyer ma candidature"}
      </button>
    </form>
  );
}
