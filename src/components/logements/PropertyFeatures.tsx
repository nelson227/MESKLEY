import {
  Snowflake, Car, Fence, Waves, Shield, ArrowUpDown, Eye,
  ChefHat, Wifi, Droplets, Zap, TreePine, Archive
} from "lucide-react";
import type { ReactNode } from "react";

const FEATURE_ICONS: Record<string, ReactNode> = {
  climatisation: <Snowflake className="w-5 h-5" />,
  parking: <Car className="w-5 h-5" />,
  balcon: <Fence className="w-5 h-5" />,
  piscine: <Waves className="w-5 h-5" />,
  securite_24h: <Shield className="w-5 h-5" />,
  ascenseur: <ArrowUpDown className="w-5 h-5" />,
  gardiennage: <Eye className="w-5 h-5" />,
  cuisine_equipee: <ChefHat className="w-5 h-5" />,
  wifi: <Wifi className="w-5 h-5" />,
  eau_chaude: <Droplets className="w-5 h-5" />,
  groupe_electrogene: <Zap className="w-5 h-5" />,
  jardin: <TreePine className="w-5 h-5" />,
  rangements: <Archive className="w-5 h-5" />,
};

const FEATURE_LABELS: Record<string, string> = {
  climatisation: "Climatisation",
  parking: "Parking",
  balcon: "Balcon / Terrasse",
  piscine: "Piscine",
  securite_24h: "Sécurité 24h",
  ascenseur: "Ascenseur",
  gardiennage: "Gardiennage",
  cuisine_equipee: "Cuisine équipée",
  machine_laver: "Machine à laver",
  wifi: "Wi-Fi",
  eau_chaude: "Eau chaude",
  groupe_electrogene: "Groupe électrogène",
  jardin: "Jardin",
  rangements: "Rangements",
};

interface PropertyFeaturesProps {
  features: string[];
}

export default function PropertyFeatures({ features }: PropertyFeaturesProps) {
  if (features.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="font-semibold text-black mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
        Équipements & Caractéristiques
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {features.map((feature) => (
          <div
            key={feature}
            className="flex items-center gap-3 p-3 bg-white-off rounded-lg text-sm"
          >
            <span className="text-gold">{FEATURE_ICONS[feature] || <Shield className="w-5 h-5" />}</span>
            <span className="text-black">{FEATURE_LABELS[feature] || feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
