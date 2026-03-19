"use client";

import { useQuery } from "@tanstack/react-query";
import { apiUrl } from "@/lib/api";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

async function fetchApplications() {
  const token = getToken();
  const res = await fetch(apiUrl("/api/demandes-location"), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erreur");
  const data = await res.json();
  return data.data;
}

export function useApplications() {
  return useQuery({
    queryKey: ["applications"],
    queryFn: fetchApplications,
  });
}

async function fetchCandidatures() {
  const token = getToken();
  const res = await fetch(apiUrl("/api/candidatures"), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erreur");
  const data = await res.json();
  return data.data;
}

export function useCandidatures() {
  return useQuery({
    queryKey: ["candidatures"],
    queryFn: fetchCandidatures,
  });
}
