"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations";
import { apiUrl } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { z } from "zod";

type FormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Erreur de connexion");

      localStorage.setItem("admin_token", result.data.token);
      document.cookie = `admin_token=${result.data.token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-black" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="text-gold">MESKLEY</span> ADMIN
          </h1>
          <p className="text-sm text-gray mt-2">Connectez-vous au panneau d&apos;administration</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
              placeholder="admin@meskley-location.com"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Mot de passe</label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gold text-black rounded-lg font-bold text-sm hover:bg-gold-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
