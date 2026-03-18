import { Facebook, Linkedin, Instagram, MessageCircle } from "lucide-react";
import { SOCIAL_LINKS } from "@/constants/social";

export default function SocialLinks({ size = "md" }: { size?: "sm" | "md" }) {
  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const btnSize = size === "sm" ? "w-8 h-8" : "w-10 h-10";

  return (
    <div className="flex gap-3">
      <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className={`${btnSize} rounded-full bg-gold/10 text-gold flex items-center justify-center hover:bg-gold hover:text-black transition-colors`} aria-label="Facebook">
        <Facebook className={iconSize} />
      </a>
      <a href={SOCIAL_LINKS.messenger} target="_blank" rel="noopener noreferrer" className={`${btnSize} rounded-full bg-gold/10 text-gold flex items-center justify-center hover:bg-gold hover:text-black transition-colors`} aria-label="Messenger">
        <MessageCircle className={iconSize} />
      </a>
      <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className={`${btnSize} rounded-full bg-gold/10 text-gold flex items-center justify-center hover:bg-gold hover:text-black transition-colors`} aria-label="LinkedIn">
        <Linkedin className={iconSize} />
      </a>
      <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className={`${btnSize} rounded-full bg-gold/10 text-gold flex items-center justify-center hover:bg-gold hover:text-black transition-colors`} aria-label="Instagram">
        <Instagram className={iconSize} />
      </a>
    </div>
  );
}
