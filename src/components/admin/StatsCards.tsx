"use client";

import { Home, FileText, Users, TrendingUp } from "lucide-react";

interface StatsData {
  totalListings: number;
  availableListings: number;
  totalApplications: number;
  pendingApplications: number;
  totalCandidatures: number;
  unreadMessages: number;
}

interface StatsCardsProps {
  stats: StatsData;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    { label: "Logements", value: stats.totalListings ?? 0, sub: `${stats.availableListings ?? 0} disponibles`, icon: Home, color: "bg-blue-50 text-blue-600" },
    { label: "Demandes", value: stats.totalApplications ?? 0, sub: `${stats.pendingApplications ?? 0} en attente`, icon: FileText, color: "bg-yellow-50 text-yellow-600" },
    { label: "Candidatures", value: stats.totalCandidatures ?? 0, sub: "total", icon: Users, color: "bg-green-50 text-green-600" },
    { label: "Messages", value: stats.unreadMessages ?? 0, sub: "non lus", icon: TrendingUp, color: "bg-red-50 text-red-600" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          <p className="text-sm text-gray-500">{card.label}</p>
          <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
