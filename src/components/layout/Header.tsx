"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/constants/navigation";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Cacher le header du site sur les pages admin (sauf login)
  const isAdmin = pathname.startsWith("/admin") && pathname !== "/admin/login";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isAdmin) return null;

  // Sur les pages internes, toujours afficher le header opaque
  const showOpaque = !isHome || isScrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          showOpaque
            ? "bg-white/95 backdrop-blur-md shadow-lg py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.png"
              alt="MESKLEY LOCATION"
              width={40}
              height={40}
              className="rounded-sm object-contain"
              priority
            />
            <span
              className={`text-xl font-bold tracking-wide transition-colors ${
                showOpaque ? "text-black" : "text-white"
              }`}
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              MESKLEY <span className="text-gold">LOCATION</span>
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-gold ${
                  showOpaque ? "text-black-deep" : "text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Bouton Menu Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2"
            aria-label="Ouvrir le menu"
          >
            {isMobileMenuOpen ? (
              <X className={`w-6 h-6 ${showOpaque ? "text-black" : "text-white"}`} />
            ) : (
              <Menu className={`w-6 h-6 ${showOpaque ? "text-black" : "text-white"}`} />
            )}
          </button>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
