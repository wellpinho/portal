export type Category =
  | "Todos"
  | "Casa"
  | "Carro"
  | "Gastronomia"
  | "Construção"
  | "Moda & Beleza"
  | "Educação"
  | "Turismo"
  | "Produtos Coloniais"
  | "Serviços"
  | "Saúde"
  | "Agropecuária"
  | "Comércio"
  | "Utilidade";

export interface Address {
  street: string;
  city: string;
  state: string;
}

export interface Business {
  id: string;
  slug: string;
  businessName: string;
  category: Exclude<Category, "Todos">;
  segment?: string;
  neighborhood?: string;
  address: Address;
  location: string;
  businessWhatsapp: string;
  mapUrl: string;
  avatar: string;
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
