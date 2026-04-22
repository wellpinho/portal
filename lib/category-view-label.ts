import { Category } from "@/lib/types";

const CATEGORY_VIEW_LABELS: Partial<Record<Category, string>> = {
  Todos: "Comercios",
  Casa: "Lista de casas",
};

export function getActiveCategoryViewLabel(category: Category): string {
  return CATEGORY_VIEW_LABELS[category] ?? `Lista de ${category.toLowerCase()}`;
}
