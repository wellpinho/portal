import {
  UtensilsCrossed,
  Wrench,
  ShoppingBag,
  Home,
  Heart,
  BookOpen,
  Dumbbell,
  Camera,
} from "lucide-react";

export type CategoryIcon = typeof UtensilsCrossed;

export interface FeaturedCategory {
  id: string;
  name: string;
  icon: CategoryIcon;
  slug: string;
}

export interface CityConfig {
  id: string;
  slug: string;
  state: string;
  name: string;
  displayName: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  description: string;
  featuredCategories: FeaturedCategory[];
  imageUrl: string; // For featured cities grid
  population?: number;
  founded?: number;
}

export const FEATURED_CATEGORIES: Record<string, FeaturedCategory> = {
  gastronomy: {
    id: "gastronomy",
    name: "Gastronomia",
    icon: UtensilsCrossed,
    slug: "gastronomia",
  },
  services: {
    id: "services",
    name: "Serviços",
    icon: Wrench,
    slug: "servicos",
  },
  retail: {
    id: "retail",
    name: "Varejo",
    icon: ShoppingBag,
    slug: "varejo",
  },
  accommodation: {
    id: "accommodation",
    name: "Hospedagem",
    icon: Home,
    slug: "hospedagem",
  },
  wellness: {
    id: "wellness",
    name: "Bem-estar",
    icon: Heart,
    slug: "bem-estar",
  },
  education: {
    id: "education",
    name: "Educação",
    icon: BookOpen,
    slug: "educacao",
  },
  fitness: {
    id: "fitness",
    name: "Fitness",
    icon: Dumbbell,
    slug: "fitness",
  },
  photography: {
    id: "photography",
    name: "Fotografia",
    icon: Camera,
    slug: "fotografia",
  },
};

/**
 * Mock data simulating city_home_configs table from database
 * In production, this should be fetched from your API/database
 */
export const CITY_CONFIGS: CityConfig[] = [
  {
    id: "aguas-mornas-sc",
    slug: "aguas-mornas",
    state: "SC",
    name: "Águas Mornas",
    displayName: "Águas Mornas, SC",
    heroTitle: "Seu guia de comércios e serviços em Águas Mornas",
    heroSubtitle: "Tudo o que você precisa, perto de você.",
    heroImageUrl: "/banner.png",
    description:
      "Águas Mornas é um município acolhedor no Vale do Tijucas, conhecido por sua gastronomia colonial e hospitalidade.",
    imageUrl:
      "https://images.unsplash.com/photo-1511306228054-480b3b290ffa?w=500&h=300&fit=crop",
    featuredCategories: [
      FEATURED_CATEGORIES.gastronomy,
      FEATURED_CATEGORIES.services,
      FEATURED_CATEGORIES.retail,
      FEATURED_CATEGORIES.accommodation,
    ],
    population: 8500,
    founded: 1852,
  },
  {
    id: "santo-amaro-sc",
    slug: "santo-amaro",
    state: "SC",
    name: "Santo Amaro",
    displayName: "Santo Amaro, SC",
    heroTitle: "Descubra o Comércio Local de Santo Amaro",
    heroSubtitle: "Conectando você aos melhores negócios locais",
    heroImageUrl:
      "https://images.unsplash.com/photo-1494783367193-149034c05e41?w=1200&h=500&fit=crop",
    description:
      "Santo Amaro é uma comunidade vibrante com forte tradição de comércio e artesanato local.",
    imageUrl:
      "https://images.unsplash.com/photo-1494783367193-149034c05e41?w=500&h=300&fit=crop",
    featuredCategories: [
      FEATURED_CATEGORIES.gastronomy,
      FEATURED_CATEGORIES.wellness,
      FEATURED_CATEGORIES.services,
      FEATURED_CATEGORIES.education,
    ],
    population: 5200,
    founded: 1900,
  },
  {
    id: "brusque-sc",
    slug: "brusque",
    state: "SC",
    name: "Brusque",
    displayName: "Brusque, SC",
    heroTitle: "O Comércio Local de Brusque está Aqui",
    heroSubtitle:
      "Conheça as melhores marcas locais de uma das maiores cidades do Vale",
    heroImageUrl:
      "https://images.unsplash.com/photo-1511306514869-a1f4dd70d1a5?w=1200&h=500&fit=crop",
    description:
      "Brusque é um polo têxtil e cultural do Vale do Itajaí, conhecida por sua história industrial e comércio vibrante.",
    imageUrl:
      "https://images.unsplash.com/photo-1511306514869-a1f4dd70d1a5?w=500&h=300&fit=crop",
    featuredCategories: [
      FEATURED_CATEGORIES.retail,
      FEATURED_CATEGORIES.gastronomy,
      FEATURED_CATEGORIES.services,
      FEATURED_CATEGORIES.fitness,
    ],
    population: 126000,
    founded: 1860,
  },
  {
    id: "blumenau-sc",
    slug: "blumenau",
    state: "SC",
    name: "Blumenau",
    displayName: "Blumenau, SC",
    heroTitle: "Comércios Locais de Blumenau",
    heroSubtitle:
      "Explore a maior cidade do Vale do Itajaí e seus negócios locais",
    heroImageUrl:
      "https://images.unsplash.com/photo-1520701494073-0ff1b66b6883?w=1200&h=500&fit=crop",
    description:
      "Blumenau é a maior cidade do Vale, conhecida por sua Oktoberfest, cultura cervejeira e comércio diversificado.",
    imageUrl:
      "https://images.unsplash.com/photo-1520701494073-0ff1b66b6883?w=500&h=300&fit=crop",
    featuredCategories: [
      FEATURED_CATEGORIES.gastronomy,
      FEATURED_CATEGORIES.photography,
      FEATURED_CATEGORIES.accommodation,
      FEATURED_CATEGORIES.services,
    ],
    population: 320000,
    founded: 1850,
  },
];

/**
 * Find a city configuration by slug
 */
export function findCityConfig(slug: string): CityConfig | undefined {
  return CITY_CONFIGS.find((city) => city.slug === slug);
}

/**
 * Get all city slugs (useful for static generation)
 */
export function getAllCitySlugs(): Array<{ state: string; city: string }> {
  return CITY_CONFIGS.map((city) => ({
    state: city.state.toLowerCase(),
    city: city.slug,
  }));
}

/**
 * Find featured cities (limited set for homepage)
 */
export function getFeaturedCities(limit: number = 4): CityConfig[] {
  return CITY_CONFIGS.slice(0, limit);
}

/**
 * Get category details by category slug
 */
export function getCategoryBySlug(slug: string): FeaturedCategory | undefined {
  return Object.values(FEATURED_CATEGORIES).find((cat) => cat.slug === slug);
}
