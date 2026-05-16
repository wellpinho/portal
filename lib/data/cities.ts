import {
  UtensilsCrossed,
  Wrench,
  ShoppingBag,
  Home,
  Heart,
  Camera,
  Leaf,
  Hammer,
} from "lucide-react";
import { ProfileCategory } from "@/lib/profile-category.lib";

export type CategoryIcon = typeof UtensilsCrossed;

export interface FeaturedCategory {
  id: string;
  name: string;
  icon: CategoryIcon;
  slug: string;
  category: ProfileCategory;
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

/**
 * Mapeamento de ProfileCategory para FeaturedCategory
 * Define ícones, nomes e slugs para cada categoria de perfil
 */
export const CATEGORY_MAPPING: Record<
  ProfileCategory,
  Omit<FeaturedCategory, "id" | "category">
> = {
  [ProfileCategory.GASTRONOMIA]: {
    name: "Gastronomia",
    icon: UtensilsCrossed,
    slug: "gastronomia",
  },
  [ProfileCategory.SERVICOS_PROFISSIONAIS]: {
    name: "Serviços Profissionais",
    icon: Wrench,
    slug: "servicos-profissionais",
  },
  [ProfileCategory.AGRO_COLONIAIS]: {
    name: "Agro & Coloniais",
    icon: Leaf,
    slug: "agro-coloniais",
  },
  [ProfileCategory.SAUDE_BELEZA]: {
    name: "Saúde & Beleza",
    icon: Heart,
    slug: "saude-beleza",
  },
  [ProfileCategory.COMERCIO_VAREJO]: {
    name: "Comércio & Varejo",
    icon: ShoppingBag,
    slug: "comercio-varejo",
  },
  [ProfileCategory.TURISMO_LAZER]: {
    name: "Turismo & Lazer",
    icon: Camera,
    slug: "turismo-lazer",
  },
  [ProfileCategory.IMOBILIARIA_LAR]: {
    name: "Imobiliária & Lar",
    icon: Home,
    slug: "imobiliaria-lar",
  },
  [ProfileCategory.CASA_CONSTRUCAO]: {
    name: "Casa & Construção",
    icon: Hammer,
    slug: "casa-construcao",
  },
};

/**
 * Obter uma categoria formatada a partir do enum
 */
export function getCategoryFromEnum(
  category: ProfileCategory,
): FeaturedCategory {
  const mapping = CATEGORY_MAPPING[category];
  return {
    id: category,
    name: mapping.name,
    icon: mapping.icon,
    slug: mapping.slug,
    category,
  };
}

/**
 * Retorna todas as categorias do enum como FeaturedCategory
 */
export function getAllCategories(): FeaturedCategory[] {
  return Object.values(ProfileCategory).map((category) =>
    getCategoryFromEnum(category),
  );
}

/**
 * Categorias destacadas para cada cidade (mapeadas do enum)
 */
export const FEATURED_CATEGORIES: Record<string, FeaturedCategory> = {
  gastronomy: getCategoryFromEnum(ProfileCategory.GASTRONOMIA),
  services: getCategoryFromEnum(ProfileCategory.SERVICOS_PROFISSIONAIS),
  retail: getCategoryFromEnum(ProfileCategory.COMERCIO_VAREJO),
  tourism: getCategoryFromEnum(ProfileCategory.TURISMO_LAZER),
  imobiliaria_lar: getCategoryFromEnum(ProfileCategory.IMOBILIARIA_LAR),
  casa_construcao: getCategoryFromEnum(ProfileCategory.CASA_CONSTRUCAO),
  saude_beleza: getCategoryFromEnum(ProfileCategory.SAUDE_BELEZA),
  agro_coloniais: getCategoryFromEnum(ProfileCategory.AGRO_COLONIAIS),
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
      FEATURED_CATEGORIES.tourism,
      FEATURED_CATEGORIES.imobiliaria_lar,
      FEATURED_CATEGORIES.casa_construcao,
      FEATURED_CATEGORIES.saude_beleza,
      FEATURED_CATEGORIES.agro_coloniais,
    ],
    population: 8500,
    founded: 1852,
  },
  {
    id: "santo-amaro-da-imperatriz-sc",
    slug: "santo-amaro-da-imperatriz",
    state: "SC",
    name: "Santo Amaro da Imperatriz",
    displayName: "Santo Amaro da Imperatriz, SC",
    heroTitle: "Seu guia de comércios e serviços em Santo Amaro da Imperatriz",
    heroSubtitle: "Conectando você aos melhores negócios locais",
    heroImageUrl: "/banner.png",
    description:
      "Santo Amaro da Imperatriz é uma comunidade vibrante com forte tradição de comércio e artesanato local.",
    imageUrl:
      "https://images.unsplash.com/photo-1511306228054-480b3b290ffa?w=500&h=300&fit=crop",
    featuredCategories: [
      FEATURED_CATEGORIES.gastronomy,
      FEATURED_CATEGORIES.services,
      FEATURED_CATEGORIES.retail,
      FEATURED_CATEGORIES.tourism,
      FEATURED_CATEGORIES.imobiliaria_lar,
      FEATURED_CATEGORIES.casa_construcao,
      FEATURED_CATEGORIES.saude_beleza,
      FEATURED_CATEGORIES.agro_coloniais,
    ],
    population: 5200,
    founded: 1900,
  },
  {
    id: "rancho-queimado-sc",
    slug: "rancho-queimado",
    state: "SC",
    name: "Rancho Queimado",
    displayName: "Rancho Queimado, SC",
    heroTitle: "Seu guia de comércios e serviços em Rancho Queimado",
    heroSubtitle: "Conectando você aos melhores negócios locais",
    heroImageUrl: "/banner.png",
    description:
      "Rancho Queimado é uma comunidade vibrante com forte tradição de comércio e artesanato local.",
    imageUrl:
      "https://images.unsplash.com/photo-1511306228054-480b3b290ffa?w=500&h=300&fit=crop",
    featuredCategories: [
      FEATURED_CATEGORIES.gastronomy,
      FEATURED_CATEGORIES.services,
      FEATURED_CATEGORIES.retail,
      FEATURED_CATEGORIES.tourism,
      FEATURED_CATEGORIES.imobiliaria_lar,
      FEATURED_CATEGORIES.casa_construcao,
      FEATURED_CATEGORIES.saude_beleza,
      FEATURED_CATEGORIES.agro_coloniais,
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
      FEATURED_CATEGORIES.gastronomy,
      FEATURED_CATEGORIES.services,
      FEATURED_CATEGORIES.retail,
      FEATURED_CATEGORIES.tourism,
      FEATURED_CATEGORIES.imobiliaria_lar,
      FEATURED_CATEGORIES.casa_construcao,
      FEATURED_CATEGORIES.saude_beleza,
      FEATURED_CATEGORIES.agro_coloniais,
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
      FEATURED_CATEGORIES.services,
      FEATURED_CATEGORIES.retail,
      FEATURED_CATEGORIES.tourism,
      FEATURED_CATEGORIES.imobiliaria_lar,
      FEATURED_CATEGORIES.casa_construcao,
      FEATURED_CATEGORIES.saude_beleza,
      FEATURED_CATEGORIES.agro_coloniais,
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
