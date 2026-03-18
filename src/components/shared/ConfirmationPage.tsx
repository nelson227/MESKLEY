import Link from "next/link";
import { CheckCircle, MessageCircle } from "lucide-react";
import { SOCIAL_LINKS } from "@/constants/social";

interface ConfirmationPageProps {
  title: string;
  referenceId?: string;
  message?: string;
  description?: string;
  backLink: string;
  backLabel: string;
}

export default function ConfirmationPage({ title, referenceId, message, description, backLink, backLabel }: ConfirmationPageProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-black mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          {title}
        </h1>
        {referenceId && (
          <div className="bg-white-off border-l-4 border-gold p-4 rounded-r-lg my-6">
            <p className="text-sm text-gray mb-1">Votre référence :</p>
            <p className="text-2xl font-bold text-gold">{referenceId}</p>
          </div>
        )}
        <p className="text-gray text-sm mb-8">{message || description}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={backLink}
            className="px-6 py-3 bg-gold text-black rounded-full font-semibold hover:bg-gold-dark transition-colors"
          >
            {backLabel}
          </Link>
          <a
            href={SOCIAL_LINKS.messenger}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border-2 border-black text-black rounded-full font-semibold hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Nous contacter
          </a>
        </div>
      </div>
    </div>
  );
}
