"use client";

import { useState, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rentalApplicationSchema } from "@/lib/validations";
import { FAMILY_STATUS_OPTIONS, EMPLOYMENT_STATUS_OPTIONS, EMPLOYMENT_DURATION_OPTIONS, RENTAL_DURATION_OPTIONS, CURRENT_STATUS_OPTIONS } from "@/constants/filters";
import FormStepper from "./FormStepper";
import FileUpload from "./FileUpload";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import type { z } from "zod";

type FormData = z.infer<typeof rentalApplicationSchema>;

const STEPS = [
  "Identité",
  "Emploi",
  "Logement souhaité",
  "Situation actuelle",
  "Garant",
  "Documents & Validation",
];

export default function RentalApplicationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<{ identity?: File; income?: File; contract?: File }>({});
  const [submitting, setSubmitting] = useState(false);

  const listingRef = searchParams.get("ref") || "";
  const listingId = searchParams.get("id") || "";

  const methods = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(rentalApplicationSchema) as any,
    defaultValues: {
      hasGuarantor: false,
      acceptTerms: undefined as unknown as true,
      listingId: listingId || null,
    },
    mode: "onTouched",
  });

  const { register, handleSubmit, watch, trigger, formState: { errors } } = methods;
  const hasGuarantor = watch("hasGuarantor");

  const nextStep = async () => {
    const fieldsPerStep: (keyof FormData)[][] = [
      ["fullName", "birthDate", "phone", "email", "idNumber", "nationality", "familyStatus", "householdSize"],
      ["employmentStatus", "monthlyIncome"],
      ["desiredMoveIn", "desiredDuration", "maxBudget"],
      [],
      [],
      ["acceptTerms"],
    ];
    const valid = await trigger(fieldsPerStep[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) formData.append(key, String(value));
      });
      if (files.identity) formData.append("identity", files.identity);
      if (files.income) formData.append("income", files.income);
      if (files.contract) formData.append("contract", files.contract);

      const res = await fetch("/api/demandes-location", { method: "POST", body: formData });
      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Erreur lors de l'envoi");
      router.push(`/demande-location/confirmation?ref=${result.data?.dossierId || ""}`);
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
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
        <FormStepper steps={STEPS} currentStep={step} />

        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 border border-gray-light mt-6">
          {listingRef && (
            <p className="text-sm text-gold mb-4">Logement référence : <strong>{listingRef}</strong></p>
          )}

          {/* Étape 1 : Identité */}
          {step === 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Informations personnelles</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Nom complet *</label>
                  <input {...register("fullName")} className={inputClass} placeholder="Jean Dupont" />
                  {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Date de naissance *</label>
                  <input type="date" {...register("birthDate")} className={inputClass} />
                  {errors.birthDate && <p className={errorClass}>{errors.birthDate.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Téléphone *</label>
                  <input type="tel" {...register("phone")} className={inputClass} placeholder="+237 6XX XXX XXX" />
                  {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input type="email" {...register("email")} className={inputClass} placeholder="email@exemple.com" />
                  {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>N° Pièce d&apos;identité *</label>
                  <input {...register("idNumber")} className={inputClass} placeholder="CNI / Passeport" />
                  {errors.idNumber && <p className={errorClass}>{errors.idNumber.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Nationalité *</label>
                  <input {...register("nationality")} className={inputClass} placeholder="Camerounaise" />
                  {errors.nationality && <p className={errorClass}>{errors.nationality.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Situation familiale *</label>
                  <select {...register("familyStatus")} className={inputClass}>
                    <option value="">Sélectionner</option>
                    {FAMILY_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  {errors.familyStatus && <p className={errorClass}>{errors.familyStatus.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Nombre de personnes au foyer *</label>
                  <input type="number" {...register("householdSize", { valueAsNumber: true })} className={inputClass} min={1} />
                  {errors.householdSize && <p className={errorClass}>{errors.householdSize.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Étape 2 : Emploi */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Situation professionnelle</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Statut professionnel *</label>
                  <select {...register("employmentStatus")} className={inputClass}>
                    <option value="">Sélectionner</option>
                    {EMPLOYMENT_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  {errors.employmentStatus && <p className={errorClass}>{errors.employmentStatus.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Nom de l&apos;employeur</label>
                  <input {...register("employerName")} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Poste occupé</label>
                  <input {...register("jobTitle")} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Revenu mensuel net (FCFA) *</label>
                  <input type="number" {...register("monthlyIncome", { valueAsNumber: true })} className={inputClass} />
                  {errors.monthlyIncome && <p className={errorClass}>{errors.monthlyIncome.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Ancienneté dans l&apos;emploi</label>
                  <select {...register("employmentDuration")} className={inputClass}>
                    <option value="">Sélectionner</option>
                    {EMPLOYMENT_DURATION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Étape 3 : Logement souhaité */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Logement souhaité</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Date d&apos;emménagement souhaitée *</label>
                  <input type="date" {...register("desiredMoveIn")} className={inputClass} />
                  {errors.desiredMoveIn && <p className={errorClass}>{errors.desiredMoveIn.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Durée souhaitée *</label>
                  <select {...register("desiredDuration")} className={inputClass}>
                    <option value="">Sélectionner</option>
                    {RENTAL_DURATION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  {errors.desiredDuration && <p className={errorClass}>{errors.desiredDuration.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Budget max mensuel (FCFA) *</label>
                  <input type="number" {...register("maxBudget", { valueAsNumber: true })} className={inputClass} />
                  {errors.maxBudget && <p className={errorClass}>{errors.maxBudget.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Étape 4 : Situation actuelle */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Situation actuelle</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Adresse actuelle</label>
                  <input {...register("currentAddress")} className={inputClass} placeholder="Quartier, ville" />
                </div>
                <div>
                  <label className={labelClass}>Statut actuel</label>
                  <select {...register("currentStatus")} className={inputClass}>
                    <option value="">Sélectionner</option>
                    {CURRENT_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Raison du déménagement</label>
                  <textarea {...register("movingReason")} className={inputClass} rows={3} placeholder="Expliquez pourquoi vous souhaitez déménager..." />
                </div>
              </div>
            </div>
          )}

          {/* Étape 5 : Garant */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Garant</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register("hasGuarantor")} className="accent-gold w-5 h-5" />
                <span className="text-sm">Je dispose d&apos;un garant</span>
              </label>
              {hasGuarantor && (
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className={labelClass}>Nom du garant</label>
                    <input {...register("guarantorName")} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Lien de parenté</label>
                    <input {...register("guarantorRelation")} className={inputClass} placeholder="Père, mère, etc." />
                  </div>
                  <div>
                    <label className={labelClass}>Téléphone du garant</label>
                    <input type="tel" {...register("guarantorPhone")} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Revenu mensuel du garant (FCFA)</label>
                    <input type="number" {...register("guarantorIncome", { valueAsNumber: true })} className={inputClass} />
                  </div>
                </div>
              )}
              <div className="mt-4">
                <label className={labelClass}>Message complémentaire</label>
                <textarea {...register("message")} className={inputClass} rows={4} placeholder="Informations supplémentaires..." />
              </div>
            </div>
          )}

          {/* Étape 6 : Documents & Validation */}
          {step === 5 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Documents & Validation</h3>
              <FileUpload label="Pièce d'identité (CNI, Passeport)" accept=".pdf,.jpg,.jpeg,.png" onFileChange={(f) => setFiles((p) => ({ ...p, identity: f }))} />
              <FileUpload label="Justificatif de revenus" accept=".pdf,.jpg,.jpeg,.png" onFileChange={(f) => setFiles((p) => ({ ...p, income: f }))} />
              <FileUpload label="Contrat de travail (optionnel)" accept=".pdf,.jpg,.jpeg,.png" onFileChange={(f) => setFiles((p) => ({ ...p, contract: f }))} />

              <div className="border-t border-gray-light pt-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" {...register("acceptTerms")} className="accent-gold w-5 h-5 mt-0.5" />
                  <span className="text-sm text-gray">
                    J&apos;accepte les <a href="/mentions-legales" className="text-gold hover:underline">conditions générales</a> et la <a href="/politique-confidentialite" className="text-gold hover:underline">politique de confidentialité</a>. Je certifie que les informations fournies sont exactes. *
                  </span>
                </label>
                {errors.acceptTerms && <p className={errorClass}>{errors.acceptTerms.message}</p>}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <button type="button" onClick={prevStep} className="px-6 py-3 border border-gray-light text-gray rounded-lg font-medium hover:border-gold hover:text-gold transition-colors">
                Précédent
              </button>
            ) : <div />}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={nextStep} className="px-8 py-3 bg-gold text-black rounded-lg font-semibold hover:bg-gold-dark transition-colors">
                Suivant
              </button>
            ) : (
              <button type="submit" disabled={submitting} className="px-8 py-3 bg-gold text-black rounded-lg font-semibold hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {submitting ? "Envoi en cours..." : "Soumettre ma demande"}
              </button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
