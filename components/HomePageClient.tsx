"use client";

import { useState, useMemo } from "react";
import { Store } from "lucide-react";
import { Business, Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/mock-data";
import BusinessCard from "./BusinessCard";
import CategoryFilter from "./CategoryFilter";
import SearchBar from "./SearchBar";

interface HomePageClientProps {
  businesses: Business[];
}

export default function HomePageClient({ businesses }: HomePageClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("Todos");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return businesses.filter((b) => {
      const matchesCategory =
        selectedCategory === "Todos" || b.category === selectedCategory;
      const matchesSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [businesses, search, selectedCategory]);

  const featured = filtered.filter((b) => b.isFeatured);
  const common = filtered.filter((b) => !b.isFeatured);

  return (
    <main className="max-w-7xl mx-auto w-full px-4 pb-10">
      {/* Sticky search + filters */}
      <div className="sticky top-16 z-40 bg-stone-50 pt-3 pb-3 space-y-2.5 -mx-4 px-4 border-b border-stone-100">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter
          categories={CATEGORIES}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-stone-400 gap-3">
          <Store className="w-14 h-14" aria-hidden="true" />
          <p className="text-base font-semibold">Nenhum comércio encontrado</p>
          <p className="text-sm text-center max-w-60">
            Tente outro termo de busca ou selecione outra categoria
          </p>
        </div>
      )}

      {/* Featured section */}
      {featured.length > 0 && (
        <section aria-labelledby="section-destaque" className="mt-5">
          <h2
            id="section-destaque"
            className="text-sm font-bold text-stone-700 mb-3 flex items-center gap-2 uppercase tracking-wide"
          >
            <span
              className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400"
              aria-hidden="true"
            />
            Em Destaque
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {featured.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        </section>
      )}

      {/* Common section */}
      {common.length > 0 && (
        <section
          aria-labelledby="section-todos"
          className={featured.length > 0 ? "mt-8" : "mt-5"}
        >
          {featured.length > 0 && (
            <h2
              id="section-todos"
              className="text-sm font-bold text-stone-700 mb-3 flex items-center gap-2 uppercase tracking-wide"
            >
              <span
                className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"
                aria-hidden="true"
              />
              Todos os Comércios
            </h2>
          )}
          <div className="grid grid-cols-2 gap-3">
            {common.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
