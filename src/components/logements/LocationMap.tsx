"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationMapProps {
  latitude: number;
  longitude: number;
  title: string;
  address: string;
}

export default function LocationMap({ latitude, longitude, title, address }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current).setView([latitude, longitude], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapInstance.current);

    const goldIcon = L.divIcon({
      className: "custom-marker",
      html: `<div style="background: #D4AF37; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    L.marker([latitude, longitude], { icon: goldIcon })
      .addTo(mapInstance.current)
      .bindPopup(`<b>${title}</b><br>${address}`)
      .openPopup();

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, [latitude, longitude, title, address]);

  return (
    <div className="mb-6">
      <h3 className="font-semibold text-black mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
        Localisation
      </h3>
      <div ref={mapRef} className="h-[300px] rounded-xl overflow-hidden border border-gray-light" />
      <a
        href={`https://www.google.com/maps?q=${latitude},${longitude}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-2 text-sm text-gold hover:underline"
      >
        Ouvrir dans Google Maps →
      </a>
    </div>
  );
}
