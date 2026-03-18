import type { Metadata } from "next";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import ContactForm from "@/components/forms/ContactForm";
import SocialLinks from "@/components/shared/SocialLinks";
import { CONTACT_INFO } from "@/constants/social";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez MESKLEY LOCATION pour toute question sur nos logements ou services. Notre équipe est à votre disposition.",
};

export default function ContactPage() {
  return (
    <div className="pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={[{ label: "Contact" }]} />

        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-black mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Contactez-nous
          </h1>
          <p className="text-gray max-w-xl mx-auto">
            Une question ? Un besoin ? Notre équipe est à votre disposition pour vous accompagner dans votre recherche de logement.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Infos contactit */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-light">
              <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Nos Coordonnées</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Adresse</p>
                    <p className="text-sm text-gray">{CONTACT_INFO.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gold mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Téléphone</p>
                    <p className="text-sm text-gray">{CONTACT_INFO.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gold mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-gray">{CONTACT_INFO.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gold mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Horaires</p>
                    <p className="text-sm text-gray">{CONTACT_INFO.hours}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-light">
              <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Suivez-nous</h3>
              <SocialLinks />
            </div>
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 sm:p-8 border border-gray-light">
            <h3 className="text-lg font-semibold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Envoyez-nous un message
            </h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
