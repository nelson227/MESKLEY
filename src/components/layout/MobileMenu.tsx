"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { NAV_LINKS } from "@/constants/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Menu Panel */}
      <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-light">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <Image src="/logo.png" alt="MESKLEY" width={32} height={32} className="rounded-sm object-contain" />
            <span className="font-bold text-lg text-black" style={{ fontFamily: "'Playfair Display', serif" }}>
              MESKLEY <span className="text-gold">LOCATION</span>
            </span>
          </Link>
          <button onClick={onClose} className="p-2" aria-label="Fermer le menu">
            <X className="w-6 h-6 text-black" />
          </button>
        </div>

        <nav className="flex flex-col p-6 gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="py-3 px-4 text-lg font-medium text-black-deep hover:bg-gold/10 hover:text-gold rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <Link
            href="/logements"
            onClick={onClose}
            className="block w-full text-center bg-gold text-black py-3 rounded-full font-semibold hover:bg-gold-dark transition-colors"
          >
            Voir nos logements
          </Link>
          <Link
            href="/demande-location"
            onClick={onClose}
            className="block w-full text-center border-2 border-gold text-gold py-3 rounded-full font-semibold mt-3 hover:bg-gold hover:text-black transition-colors"
          >
            Faire une demande
          </Link>
        </div>
      </div>
    </div>
  );
}
