import { MOCK_BUSINESSES } from "@/lib/mock-data";
import { Business } from "@/lib/types";
import { findCityRoute } from "@/lib/locations";

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export async function getBusinessesByLocation(
  uf: string,
  citySlug: string,
): Promise<Business[]> {
  const cityRoute = findCityRoute(uf, citySlug);

  // Placeholder for API integration.
  // Example: GET /api/businesses?uf=sc&city=aguas-mornas
  if (!cityRoute) return [];

  const cityName = normalize(cityRoute.cityName);
  return MOCK_BUSINESSES.filter((business) => {
    const locationText = normalize(`${business.location} ${business.address}`);
    return locationText.includes(cityName);
  });
}