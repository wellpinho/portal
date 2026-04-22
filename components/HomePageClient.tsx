"use client";

import { useState, useMemo } from "react";
import { MessageCircleMore, Store } from "lucide-react";
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
            <p className="text-lg font-semibold leading-snug text-stone-700">
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
              className="mt-5 inline-flex w-full items-center justify-center gap-2 sm:gap-3 rounded-2xl bg-emerald-500 px-2 py-3.5 text-sm font-semibold text-white transition-all hover:bg-emerald-600 active:scale-[0.98]"
              aria-label="Compartilhar Comércios Locais no WhatsApp"
            >
              <MessageCircleMore />
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
