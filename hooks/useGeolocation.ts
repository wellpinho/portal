"use client";

import { useEffect, useState } from "react";

interface GeolocationInfo {
  ip: string;
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  detectedCity?: string;
  provider: "vercel" | "cloudflare" | "geoip-api" | "unknown";
  cityPath?: string | null;
}

export function useGeolocation() {
  const [geolocation, setGeolocation] = useState<GeolocationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGeolocation = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/geolocation");
        const data = (await response.json()) as {
          success: boolean;
          data: GeolocationInfo;
          cityPath?: string | null;
        };

        if (data.success) {
          setGeolocation({
            ...data.data,
            cityPath: data.cityPath,
          });
        } else {
          setError("Erro ao detectar localização");
        }
      } catch (err) {
        console.error("Erro na requisição de geolocalização:", err);
        setError("Erro ao detectar localização");
      } finally {
        setLoading(false);
      }
    };

    fetchGeolocation();
  }, []);

  return {
    geolocation,
    loading,
    error,
  };
}
