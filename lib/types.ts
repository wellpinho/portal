export type Category =
  | "Todos"
  | "Produtos Coloniais"
  | "Serviços"
  | "Gastronomia"
  | "Utilidade"
  | "Saúde"
  | "Comércio";

export interface Business {
  id: string;
  slug: string;
  name: string;
  category: Exclude<Category, "Todos">;
  location: string;
  address: string;
  /** E.164-like number for wa.me (country + area + number, digits only) */
  phone: string;
  mapUrl: string;
  imageUrl: string;
  bannerUrl: string;
  logoUrl: string;
  galleryImages: [string, string, string, string];
  isOpen: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  description: string;
  workingHours: string[];
  paymentMethods: string[];
  hasParking: boolean;
}
