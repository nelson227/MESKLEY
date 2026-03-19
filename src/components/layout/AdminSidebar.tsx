"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Building, FileText, Users, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { ADMIN_NAV_LINKS } from "@/constants/navigation";

const ICONS: Record<string, React.ReactNode> = {
  "/admin/dashboard": <LayoutDashboard className="w-5 h-5" />,
  "/admin/logements": <Building className="w-5 h-5" />,
  "/admin/demandes": <FileText className="w-5 h-5" />,
  "/admin/candidatures": <Users className="w-5 h-5" />,
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/admin/login";
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt="MESKLEY" width={32} height={32} className="rounded-sm object-contain" />
          <span className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
            MESKLEY <span className="text-gold">ADMIN</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        {ADMIN_NAV_LINKS.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gold/10 text-gold border-r-2 border-gold"
                  : "text-gray hover:text-white hover:bg-white/5"
              }`}
            >
              {ICONS[link.href]}
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Retour au site & Déconnexion */}
      <div className="p-6 border-t border-white/10 space-y-2">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-4 py-2 text-sm text-gray hover:text-white transition-colors"
        >
          <Home className="w-4 h-4" />
          Retour au site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-sm text-gray hover:text-red-400 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Bouton hamburger mobile */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black-deep text-white rounded-lg shadow-lg"
        aria-label="Ouvrir le menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 min-h-screen bg-black-deep text-white flex-col fixed left-0 top-0">
        {sidebarContent}
      </aside>

      {/* Sidebar Mobile (overlay) */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="relative w-72 max-w-[85vw] min-h-screen bg-black-deep text-white flex flex-col">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-1 text-gray hover:text-white"
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
