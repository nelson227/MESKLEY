import type { NavLink } from "@/types/common";

export const NAV_LINKS: NavLink[] = [
  { label: "Accueil", href: "/" },
  { label: "Carrières", href: "/carrieres" },
  { label: "Contact", href: "/contact" },
];

export const ADMIN_NAV_LINKS: NavLink[] = [
  { label: "Tableau de bord", href: "/admin/dashboard" },
  { label: "Logements", href: "/admin/logements" },
  { label: "Demandes", href: "/admin/demandes" },
  { label: "Candidatures", href: "/admin/candidatures" },
];
