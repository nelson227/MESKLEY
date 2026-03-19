"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "@/lib/validations";
import { apiUrl } from "@/lib/api";
import { CONTACT_SUBJECTS } from "@/constants/filters";
import { toast } from "sonner";
import type { z } from "zod";

type FormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Erreur");

      setSent(true);
      reset();
      toast.success("Message envoyé avec succès !");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 border border-gray-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold";
  const labelClass = "block text-sm font-medium text-black mb-1";
  const errorClass = "text-xs text-red-500 mt-1";

  if (sent) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Message envoyé !</h3>
        <p className="text-gray text-sm mb-6">Nous vous répondrons dans les plus brefs délais.</p>
        <button onClick={() => setSent(false)} className="px-6 py-2 border border-gold text-gold rounded-lg font-medium hover:bg-gold hover:text-black transition-colors">
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
      </div>

      <div>
        <label className={labelClass}>Sujet *</label>
        <select {...register("subject")} className={inputClass}>
          <option value="">Sélectionner un sujet</option>
          {CONTACT_SUBJECTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        {errors.subject && <p className={errorClass}>{errors.subject.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Message *</label>
        <textarea {...register("message")} className={inputClass} rows={6} placeholder="Votre message..." />
        {errors.message && <p className={errorClass}>{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-gold text-black rounded-lg font-semibold hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Envoi en cours..." : "Envoyer le message"}
      </button>
    </form>
  );
}
