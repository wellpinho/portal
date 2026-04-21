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
  name: string;
  category: Exclude<Category, "Todos">;
  location: string;
  /** E.164-like number for wa.me (country + area + number, digits only) */
  phone: string;
  imageUrl: string;
  isOpen: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  description: string;
}
