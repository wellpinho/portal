"use client";

import { useState, useMemo } from "react";
import { Store } from "lucide-react";
import { Business, Category } from "@/lib/types";
import { getActiveCategoryViewLabel } from "@/lib/category-view-label";
import BusinessCard from "./BusinessCard";
import CategoryFilter from "./CategoryFilter";
import SearchBar from "./SearchBar";

const WHATSAPP_SHARE_MESSAGE = encodeURIComponent(
  "Oi! Conheci o Comércios Locais, um portal para ajudar a gente a encontrar tudo aqui em Águas Mornas. Dá uma olhada e vamos ajudar a divulgar nossos produtores e lojas: https://comercioslocais.com.br/aguas-mornas-sc",
);

interface HomePageClientProps {
  businesses: Business[];
}

export default function HomePageClient({ businesses }: HomePageClientProps) {
  const [search, setSearch] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] =
    useState("Todos os bairros");
  const [selectedCategory, setSelectedCategory] = useState<Category>("Todos");

  const neighborhoods = useMemo(() => {
    const values = new Set<string>();

    for (const business of businesses) {
      const [neighborhood] = business.location
        .split(",")
        .map((part) => part.trim());
      if (neighborhood) values.add(neighborhood);
    }

    return Array.from(values).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [businesses]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return businesses.filter((b) => {
      const matchesCategory =
        selectedCategory === "Todos" || b.category === selectedCategory;

      const businessNeighborhood = b.location.split(",")[0]?.trim() ?? "";
      const matchesNeighborhood =
        selectedNeighborhood === "Todos os bairros" ||
        businessNeighborhood === selectedNeighborhood;

      const matchesSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q);

      return matchesCategory && matchesNeighborhood && matchesSearch;
    });
  }, [businesses, search, selectedCategory, selectedNeighborhood]);

  const featured = filtered.filter((b) => b.isFeatured);
  const common = filtered.filter((b) => !b.isFeatured);

  const activeListLabel = getActiveCategoryViewLabel(selectedCategory);

  const emptyStateTitle =
    selectedCategory === "Todos"
      ? "Ainda não encontramos anúncios para esta busca em Águas Mornas"
      : `Ainda não temos anúncios de ${selectedCategory} em Águas Mornas`;

  return (
    <main className="max-w-7xl mx-auto w-full px-4 pb-10">
      {/* Sticky search + filters */}
      <div className="sticky top-16 z-40 bg-stone-50 pt-3 pb-3 space-y-2.5 -mx-4 px-4 border-b border-stone-100">
        <SearchBar
          searchValue={search}
          onSearchChange={setSearch}
          neighborhoodValue={selectedNeighborhood}
          onNeighborhoodChange={setSelectedNeighborhood}
          neighborhoods={neighborhoods}
        />
        <CategoryFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <div className="flex items-center justify-between gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs text-stone-700">
          <span className="font-semibold text-emerald-700">
            {activeListLabel}
          </span>
          <span>
            {filtered.length}{" "}
            {filtered.length === 1 ? "resultado" : "resultados"}
          </span>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <section className="mx-auto flex max-w-lg flex-col items-center justify-center gap-4 py-20 text-center">
          <Store className="h-14 w-14 text-stone-600" aria-hidden="true" />

          <div className="w-full rounded-3xl border border-blue-100 bg-blue-50 px-5 py-6 shadow-sm sm:px-7">
            <p className="text-lg font-semibold leading-snug text-stone-900">
              {emptyStateTitle}
            </p>

            <p className="mt-2 text-sm font-medium text-blue-800">
              Ajude a fortalecer nossa economia local!
            </p>

            <p className="mt-3 text-sm leading-6 text-stone-600">
              Compartilhe o Comércios Locais com vizinhos, produtores e lojas da
              cidade para aumentar a divulgação da comunidade.
            </p>

            <a
              href={`https://wa.me/?text=${WHATSAPP_SHARE_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-500 px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-emerald-600 active:scale-[0.98]"
              aria-label="Compartilhar Comércios Locais no WhatsApp"
            >
              <svg
                viewBox="0 0 32 32"
                className="h-5 w-5 shrink-0 fill-current"
                aria-hidden="true"
              >
                <path d="M19.11 17.21c-.28-.14-1.63-.8-1.88-.89-.25-.09-.43-.14-.61.14-.18.28-.7.89-.86 1.08-.16.19-.32.21-.6.07-.28-.14-1.16-.43-2.21-1.38-.81-.72-1.36-1.62-1.52-1.89-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.19-.28.28-.46.09-.19.05-.35-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.45-.61-.46l-.52-.01c-.18 0-.48.07-.73.35-.25.28-.95.93-.95 2.26s.98 2.62 1.11 2.8c.14.19 1.91 2.91 4.62 4.08.65.28 1.16.45 1.56.58.66.21 1.27.18 1.75.11.53-.08 1.63-.67 1.86-1.32.23-.65.23-1.21.16-1.32-.07-.12-.25-.19-.53-.32Z" />
                <path d="M16.03 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.25.59 4.45 1.72 6.39L3.2 28.8l6.56-1.72a12.74 12.74 0 0 0 6.27 1.64h.01c7.06 0 12.8-5.74 12.8-12.8 0-3.43-1.34-6.65-3.77-9.08A12.7 12.7 0 0 0 16.03 3.2Zm0 23.36h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-3.89 1.02 1.04-3.79-.25-.39a10.57 10.57 0 0 1-1.63-5.65c0-5.87 4.77-10.64 10.64-10.64 2.84 0 5.51 1.11 7.52 3.12a10.57 10.57 0 0 1 3.11 7.53c0 5.87-4.77 10.64-10.63 10.64Z" />
              </svg>
              Compartilhar no WhatsApp
            </a>
          </div>
        </section>
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
            {featured.map((b, index) => (
              <BusinessCard key={b.id} business={b} priority={index === 0} />
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {common.map((b, index) => (
              <BusinessCard
                key={b.id}
                business={b}
                priority={featured.length === 0 && index === 0}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
