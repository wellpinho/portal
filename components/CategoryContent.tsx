"use client";

import { useEffect, useState } from "react";
import { Sliders, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const itemsPerPage = 10;

  // Fetch businesses from API route on component mount
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
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
        setTotalResults(data?.total || 0);

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
  }, [slug, categoryName, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSegment, selectedNeighborhood]);

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

  const totalPages = Math.ceil(totalResults / itemsPerPage);

  const getPaginationPages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    // Sempre mostra: primeira, anterior, atual, próxima, última
    const pages: number[] = [1];
    if (currentPage > 2) pages.push(currentPage - 1);
    if (currentPage !== 1 && currentPage !== totalPages)
      pages.push(currentPage);
    if (currentPage < totalPages - 1) pages.push(currentPage + 1);
    pages.push(totalPages);
    return [...new Set(pages)].sort((a, b) => a - b);
  };

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
          <section className="py-8 sm:py-12 lg:py-16 bg-stone-50">
            <div className="mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
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
                      Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                      {Math.min(currentPage * itemsPerPage, totalResults)} de{" "}
                      {totalResults}{" "}
                      {totalResults === 1 ? "resultado" : "resultados"}
                      {selectedSegment && ` em ${selectedSegment}`}
                      {selectedNeighborhood &&
                        ` no bairro ${selectedNeighborhood}`}
                    </p>
                  </div>

                  {/* Business Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    {filteredBusinesses.map((business, index) => (
                      <BusinessCard
                        key={business.id}
                        business={business}
                        priority={index < 3}
                      />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex flex-col items-center gap-4">
                      <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className="inline-flex items-center cursor-pointer gap-1 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg border border-stone-200 text-stone-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50 transition-colors"
                        >
                          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Anterior</span>
                        </button>

                        <div className="flex items-center gap-0.5 sm:gap-1">
                          {getPaginationPages().map((page, idx, arr) => (
                            <div
                              key={`page-${page}`}
                              className="flex items-center gap-0.5 sm:gap-1"
                            >
                              {idx > 0 && arr[idx - 1] + 1 < page && (
                                <span className="text-stone-400 text-xs">
                                  •••
                                </span>
                              )}
                              <button
                                onClick={() => setCurrentPage(page)}
                                className={`w-7 h-7 sm:w-10 sm:h-10 text-xs sm:text-base rounded-lg font-semibold transition-colors flex-shrink-0 ${
                                  currentPage === page
                                    ? "bg-emerald-600 text-white"
                                    : "border border-stone-200 text-stone-700 hover:bg-stone-50 cursor-pointer"
                                }`}
                              >
                                {page}
                              </button>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages),
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="inline-flex items-center cursor-pointer gap-1 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg border border-stone-200 text-stone-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50 transition-colors"
                        >
                          <span className="hidden sm:inline">Próxima</span>
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm text-stone-600">
                        Página {currentPage} de {totalPages}
                      </p>
                    </div>
                  )}
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
