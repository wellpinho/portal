"use client";

import { useEffect, useState } from "react";
import { Sliders } from "lucide-react";
import FilterSidebar from "@/components/filters/FilterSidebar";
import FilterModal from "@/components/filters/FilterModal";
import BusinessCard from "@/components/BusinessCard";
import { Business } from "@/lib/types";

// Função para sanitizar texto: converter "Área Rural" em "area-rural"
const sanitizeNeighborhood = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/\s+/g, "-") // Espaços em hífen
    .replace(/[^\w-]/g, ""); // Remove caracteres especiais
};

interface CategoryContentProps {
  initialBusinesses: Business[];
  segments: string[];
  selectedSegment?: string;
  selectedNeighborhood?: string;
  state: string;
  city: string;
  category: string;
  slug: string;
  categoryName: string;
}

export default function CategoryContent({
  initialBusinesses,
  segments,
  selectedSegment,
  selectedNeighborhood,
  state,
  city,
  category,
  slug,
  categoryName,
}: CategoryContentProps) {
  const [businesses, setBusinesses] = useState<Business[]>(initialBusinesses);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch businesses from API route on component mount
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: "1",
          limit: "10",
          slug,
          category: categoryName,
        });

        const response = await fetch(`/api/profile/list?${params.toString()}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const fetchedBusinesses = Array.isArray(data?.data) ? data.data : [];
        setBusinesses(fetchedBusinesses);

        console.log(data?.neighborhoods, "uniqueNeighborhoods");
        setNeighborhoods(data?.neighborhoods || []);
      } catch (err) {
        console.error("Erro ao buscar negócios:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Erro desconhecido ao buscar dados",
        );
        setNeighborhoods([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinesses();
  }, [slug, categoryName]);

  const filteredBusinesses = businesses.filter((business) => {
    if (selectedSegment && business.segment !== selectedSegment) return false;
    if (selectedNeighborhood) {
      const businessNeighborhood =
        business.neighborhood || business.address?.street;
      const sanitizedSelected = sanitizeNeighborhood(selectedNeighborhood);
      const sanitizedBusiness = sanitizeNeighborhood(
        businessNeighborhood || "",
      );
      if (sanitizedBusiness !== sanitizedSelected) return false;
    }
    return true;
  });

  return (
    <>
      {/* Desktop and Mobile Layout */}
      <div className="flex flex-1">
        {/* Sidebar - Desktop Only */}
        <FilterSidebar
          segments={segments}
          selectedSegment={selectedSegment}
          neighborhoods={neighborhoods}
          selectedNeighborhood={selectedNeighborhood}
          currentState={state}
          currentCity={city}
          currentCategory={category}
        />

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filter Button */}
          <div className="lg:hidden bg-white border-b border-stone-200 px-4 py-4">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Sliders className="w-4 h-4" />
              Filtros
            </button>
          </div>

          {/* Content Section */}
          <section className="py-12 sm:py-16 bg-stone-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {isLoading ? (
                <div className="text-center py-16">
                  <p className="text-lg text-stone-600">
                    Carregando comércios...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <p className="text-lg text-red-600 mb-6">
                    Erro ao carregar comércios: {error}
                  </p>
                </div>
              ) : filteredBusinesses.length > 0 ? (
                <>
                  {/* Results Header */}
                  <div className="mb-8">
                    <p className="text-stone-600 text-sm">
                      {filteredBusinesses.length}{" "}
                      {filteredBusinesses.length === 1
                        ? "resultado"
                        : "resultados"}{" "}
                      encontrado{filteredBusinesses.length !== 1 ? "s" : ""}
                      {selectedSegment && ` em ${selectedSegment}`}
                      {selectedNeighborhood &&
                        ` no bairro ${selectedNeighborhood}`}
                    </p>
                  </div>

                  {/* Business Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBusinesses.map((business, index) => (
                      <BusinessCard
                        key={business.id}
                        business={business}
                        priority={index < 3}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <p className="text-lg text-stone-600 mb-6">
                    Nenhum comércio encontrado com os filtros selecionados.
                  </p>
                  <button
                    onClick={() => setIsFilterModalOpen(true)}
                    className="inline-block px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Ajustar filtros
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Filter Modal - Mobile Only */}
      <FilterModal
        segments={segments}
        selectedSegment={selectedSegment}
        neighborhoods={neighborhoods}
        selectedNeighborhood={selectedNeighborhood}
        currentState={state}
        currentCity={city}
        currentCategory={category}
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </>
  );
}
