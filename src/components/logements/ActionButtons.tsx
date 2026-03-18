import Link from "next/link";
import { ExternalLink, MessageCircle, FileText, Share2 } from "lucide-react";
import { SOCIAL_LINKS } from "@/constants/social";

interface ActionButtonsProps {
  facebookMarketplaceUrl: string | null;
  messengerLink: string;
  listingId: string;
  reference: string;
}

export default function ActionButtons({ facebookMarketplaceUrl, messengerLink, listingId, reference }: ActionButtonsProps) {
  const messengerUrl = messengerLink || SOCIAL_LINKS.messenger;

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: "MESKLEY LOCATION", url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Lien copié dans le presse-papier !");
    }
  };

  return (
    <div className="space-y-3">
      {facebookMarketplaceUrl && (
        <a
          href={facebookMarketplaceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-[#1877F2] text-white rounded-lg font-semibold hover:bg-[#166FE5] transition-colors"
        >
          <ExternalLink className="w-5 h-5" />
          Voir sur Facebook Marketplace
        </a>
      )}

      <a
        href={messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-[#00B2FF] to-[#006AFF] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
      >
        <MessageCircle className="w-5 h-5" />
        Contacter sur Messenger
      </a>

      <Link
        href={`/demande-location?ref=${reference}&id=${listingId}`}
        className="flex items-center justify-center gap-2 w-full py-3 bg-gold text-black rounded-lg font-semibold hover:bg-gold-dark transition-colors"
      >
        <FileText className="w-5 h-5" />
        Faire une demande de location
      </Link>

      <button
        onClick={handleShare}
        className="flex items-center justify-center gap-2 w-full py-3 border border-gray-light text-gray rounded-lg font-medium hover:border-gold hover:text-gold transition-colors"
      >
        <Share2 className="w-5 h-5" />
        Partager
      </button>
    </div>
  );
}
