import { REGISTERED_CITIES } from "@/lib/data/cities-neighborhood.data";

/**
 * Coordenadas geográficas de cada cidade registrada
 * Usado para calcular a cidade mais próxima do usuário
 *
 * Para adicionar uma nova cidade, insira suas coordenadas aqui
 * Você pode encontrar coordenadas em: https://www.google.com/maps
 * Copie latitude e longitude do link de compartilhamento
 */
const CITY_COORDINATES: Record<
  string,
  { latitude: number; longitude: number }
> = {
  "aguas-mornas": {
    latitude: -27.5013,
    longitude: -49.0333,
  },
  // Adicione as coordenadas das outras cidades conforme necessário
  // Exemplo:
  // "otra-ciudad": {
  //   latitude: -27.5916,
  //   longitude: -49.0172,
  // },
};

/**
 * Função auxiliar para gerar coordenadas padrão
 * Usado como fallback se a cidade não estiver em CITY_COORDINATES
 */
function getDefaultCoordinates(
  citySlug: string,
): { latitude: number; longitude: number } | null {
  // Verificar se a cidade existe em REGISTERED_CITIES
  if (!(citySlug in REGISTERED_CITIES)) {
    return null;
  }

  // Retornar coordenadas de Águas Mornas como padrão
  // (necessário definir as coordenadas reais para produção)
  return {
    latitude: -27.5013,
    longitude: -49.0333,
  };
}

/**
 * Calcula a distância entre dois pontos geográficos em km (fórmula de Haversine)
 */
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Encontra a cidade mais próxima baseada em coordenadas geográficas
 */
export function findNearestCity(
  latitude: number,
  longitude: number,
): string | null {
  let nearestCity: string | null = null;
  let minDistance = Infinity;

  for (const slug of Object.keys(REGISTERED_CITIES)) {
    const coords = CITY_COORDINATES[slug] || getDefaultCoordinates(slug);
    if (!coords) continue;

    const distance = haversineDistance(
      latitude,
      longitude,
      coords.latitude,
      coords.longitude,
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = slug;
    }
  }

  // Retorna a cidade só se estiver dentro de um raio razoável (ex: 50km)
  return minDistance <= 50 ? nearestCity : null;
}

/**
 * Obtém localização a partir de headers Vercel (se disponível)
 */
export function getLocationFromVercelHeaders(headers: Record<string, string>): {
  country?: string;
  region?: string;
  city?: string;
  latitude?: string;
  longitude?: string;
} {
  return {
    country: headers["x-vercel-geo-country"],
    region: headers["x-vercel-geo-region"],
    city: headers["x-vercel-geo-city"],
    latitude: headers["x-vercel-geo-latitude"],
    longitude: headers["x-vercel-geo-longitude"],
  };
}

/**
 * Obtém localização a partir de headers Cloudflare (se disponível)
 */
export function getLocationFromCloudflareHeaders(
  headers: Record<string, string>,
): {
  country?: string;
  latitude?: string;
  longitude?: string;
} {
  return {
    country: headers["cf-ipcountry"],
    latitude: headers["cf-connecting-ip-latitude"],
    longitude: headers["cf-connecting-ip-longitude"],
  };
}

/**
 * Interface de resposta de geolocalização
 */
export interface GeolocationData {
  ip: string;
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  detectedCity?: string; // Cidade mais próxima de REGISTERED_CITIES
  provider: "vercel" | "cloudflare" | "geoip-api" | "unknown";
}

/**
 * Detecta localização do usuário a partir de headers
 */
export function detectLocationFromHeaders(
  headers: Record<string, string>,
  ip: string,
): GeolocationData {
  // Verificar headers Vercel primeiro (production)
  const vercelLocation = getLocationFromVercelHeaders(headers);
  if (vercelLocation.latitude && vercelLocation.longitude) {
    const latitude = parseFloat(vercelLocation.latitude);
    const longitude = parseFloat(vercelLocation.longitude);
    const detectedCity = findNearestCity(latitude, longitude);

    return {
      ip,
      country: vercelLocation.country,
      region: vercelLocation.region,
      city: vercelLocation.city,
      latitude,
      longitude,
      detectedCity: detectedCity || undefined,
      provider: "vercel",
    };
  }

  // Fallback para Cloudflare
  const cloudflareLocation = getLocationFromCloudflareHeaders(headers);
  if (cloudflareLocation.latitude && cloudflareLocation.longitude) {
    const latitude = parseFloat(cloudflareLocation.latitude);
    const longitude = parseFloat(cloudflareLocation.longitude);
    const detectedCity = findNearestCity(latitude, longitude);

    return {
      ip,
      country: cloudflareLocation.country,
      latitude,
      longitude,
      detectedCity: detectedCity || undefined,
      provider: "cloudflare",
    };
  }

  // Se em desenvolvimento ou sem headers, retornar com provider unknown
  return {
    ip,
    provider: "unknown",
  };
}

/**
 * Valida se a cidade detectada é válida
 */
export function isValidDetectedCity(citySlug: string | undefined): boolean {
  if (!citySlug) return false;
  return citySlug in REGISTERED_CITIES;
}

/**
 * Obtém o caminho da cidade detectada
 */
export function getDetectedCityPath(
  detectedCity: string | undefined,
): string | null {
  if (!isValidDetectedCity(detectedCity)) return null;
  return `/sc/${detectedCity}`;
}
