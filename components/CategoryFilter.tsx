"use client";

import { Category } from "@/lib/types";

interface CategoryFilterProps {
  categories: Category[];
  selected: Category;
  onSelect: (category: Category) => void;
}

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
      role="tablist"
      aria-label="Filtrar por categoria"
    >
      {categories.map((cat) => (
        <button
          key={cat}
          role="tab"
          aria-selected={selected === cat}
          onClick={() => onSelect(cat)}
          className={[
            "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all touch-manipulation",
            selected === cat
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 active:bg-stone-100",
          ].join(" ")}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
