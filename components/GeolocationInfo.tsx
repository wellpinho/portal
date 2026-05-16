"use client";

import { useGeolocation } from "@/hooks/useGeolocation";
import { MapPin, Loader2 } from "lucide-react";

export function GeolocationInfo() {
  const { geolocation, loading } = useGeolocation();

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <Loader2 className="w-3 h-3 animate-spin" />
        Detectando localização...
      </div>
    );
  }

  if (!geolocation) {
    return null;
  }

  const displayText = geolocation.detectedCity
    ? `Detectado em ${geolocation.detectedCity}`
    : geolocation.city
      ? `${geolocation.city}, ${geolocation.country}`
      : "Localização desconhecida";

  return (
    <div
      className="flex items-center gap-1.5 text-xs text-stone-600 bg-stone-50 px-2.5 py-1.5 rounded-lg"
      title={`IP: ${geolocation.ip} | Provedor: ${geolocation.provider}`}
    >
      <MapPin className="w-3 h-3 text-emerald-600" />
      <span>{displayText}</span>
    </div>
  );
}
