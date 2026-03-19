import Link from "next/link";
import Image from "next/image";
import { Facebook, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { SOCIAL_LINKS, CONTACT_INFO } from "@/constants/social";

export default function Footer() {
  return (
    <footer className="bg-black-deep text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="MESKLEY" width={40} height={40} className="rounded-sm object-contain" />
              <span className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                MESKLEY <span className="text-gold">LOCATION</span>
              </span>
            </Link>
            <p className="text-gray text-sm leading-relaxed">
              Votre partenaire de confiance en immobilier. Trouvez le logement idéal parmi notre sélection de biens de qualité.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-gold font-semibold text-lg mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Liens rapides
            </h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray text-sm hover:text-gold transition-colors">Accueil</Link></li>
              <li><Link href="/logements" className="text-gray text-sm hover:text-gold transition-colors">Nos logements</Link></li>
              <li><Link href="/demande-location" className="text-gray text-sm hover:text-gold transition-colors">Demande de location</Link></li>
              <li><Link href="/carrieres" className="text-gray text-sm hover:text-gold transition-colors">Carrières</Link></li>
              <li><Link href="/contact" className="text-gray text-sm hover:text-gold transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Informations légales */}
          <div>
            <h3 className="text-gold font-semibold text-lg mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Informations
            </h3>
            <ul className="space-y-3">
              <li><Link href="/mentions-legales" className="text-gray text-sm hover:text-gold transition-colors">Mentions légales</Link></li>
              <li><Link href="/politique-confidentialite" className="text-gray text-sm hover:text-gold transition-colors">Politique de confidentialité</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gold font-semibold text-lg mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <span className="text-gray text-sm">{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <a href={`tel:${CONTACT_INFO.phone}`} className="text-gray text-sm hover:text-gold transition-colors">{CONTACT_INFO.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-gray text-sm hover:text-gold transition-colors">{CONTACT_INFO.email}</a>
              </li>
            </ul>

            {/* Réseaux sociaux */}
            <div className="flex gap-4 mt-6">
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-gray text-sm">
            © {new Date().getFullYear()} MESKLEY LOCATION — Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
