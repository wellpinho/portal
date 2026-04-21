export interface CityRoute {
  uf: string;
  citySlug: string;
  cityName: string;
}

export const SUPPORTED_CITY_ROUTES: CityRoute[] = [
  { uf: "sc", citySlug: "aguas-mornas", cityName: "Águas Mornas" },
  // {
  //   uf: "sc",
  //   citySlug: "santo-amaro-da-imperatriz",
  //   cityName: "Santo Amaro da Imperatriz",
  // },
  // {
  //   uf: "sc",
  //   citySlug: "sao-pedro-de-alcantara",
  //   cityName: "São Pedro de Alcântara",
  // },
  // { uf: "sc", citySlug: "palhoca", cityName: "Palhoça" },
];

export const DEFAULT_CITY_ROUTE: CityRoute = SUPPORTED_CITY_ROUTES[0];

export function toCityPath(uf: string, citySlug: string): string {
  return `/${uf.toLowerCase()}/${citySlug.toLowerCase()}`;
}

export const DEFAULT_CITY_PATH = toCityPath(
  DEFAULT_CITY_ROUTE.uf,
  DEFAULT_CITY_ROUTE.citySlug,
);

export function findCityRoute(uf: string, citySlug: string): CityRoute | null {
  const ufLower = uf.toLowerCase();
  const slugLower = citySlug.toLowerCase();

  return (
    SUPPORTED_CITY_ROUTES.find(
      (city) => city.uf === ufLower && city.citySlug === slugLower,
    ) ?? null
  );
}

export function isSupportedCityPath(path: string): boolean {
  const [uf, citySlug] = path.replace(/^\//, "").split("/");
  if (!uf || !citySlug) return false;
  return Boolean(findCityRoute(uf, citySlug));
}

export function formatCityNameFromSlug(citySlug: string): string {
  return citySlug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
