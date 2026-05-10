"use client";

import { useState } from "react";
import { Sliders } from "lucide-react";
import FilterSidebar from "@/components/filters/FilterSidebar";
import FilterModal from "@/components/filters/FilterModal";
import BusinessCard from "@/components/BusinessCard";
import { Business } from "@/lib/types";

interface CategoryContentProps {
  businesses: Business[];
  segments: string[];
  selectedSegment?: string;
  neighborhoods: string[];
  selectedNeighborhood?: string;
  state: string;
  city: string;
  category: string;
}

export default function CategoryContent({
  businesses,
  segments,
  selectedSegment,
  neighborhoods,
  selectedNeighborhood,
  state,
  city,
  category,
}: CategoryContentProps) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const filteredBusinesses = businesses.filter((business) => {
    if (selectedSegment && business.segment !== selectedSegment) return false;
    if (
      selectedNeighborhood &&
      (business.neighborhood || business.location) !== selectedNeighborhood
    )
      return false;
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
              {filteredBusinesses.length > 0 ? (
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
                        key={business.slug}
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
