"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, X } from "lucide-react";
import { useState } from "react";

interface FilterSidebarProps {
  segments: string[];
  selectedSegment?: string;
  neighborhoods: string[];
  selectedNeighborhood?: string;
  currentState: string;
  currentCity: string;
  currentCategory: string;
}

export default function FilterSidebar({
  segments,
  selectedSegment,
  neighborhoods,
  selectedNeighborhood,
  currentState,
  currentCity,
  currentCategory,
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expandedSection, setExpandedSection] = useState<
    "segment" | "neighborhood" | null
  >("segment");

  const handleSegmentChange = (segment: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (segment) {
      params.set("segmento", segment);
    } else {
      params.delete("segmento");
    }
    router.push(
      `/${currentState}/${currentCity}/${currentCategory}?${params.toString()}`,
    );
  };

  const handleNeighborhoodChange = (neighborhood: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (neighborhood) {
      params.set("bairro", neighborhood);
    } else {
      params.delete("bairro");
    }
    router.push(
      `/${currentState}/${currentCity}/${currentCategory}?${params.toString()}`,
    );
  };

  const clearFilters = () => {
    router.push(`/${currentState}/${currentCity}/${currentCategory}`);
  };

  const hasActiveFilters = !!selectedSegment || !!selectedNeighborhood;

  return (
    <>
      {/* Sidebar - Hidden on mobile */}
      <aside className="hidden lg:block w-72 bg-stone-50 border-r border-stone-200 sticky top-[120px] h-[calc(100vh-120px)] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900">Filtros</h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="p-1 hover:bg-stone-200 rounded transition-colors"
                aria-label="Limpar filtros"
              >
                <X className="w-4 h-4 text-stone-600" />
              </button>
            )}
          </div>

          {/* Segments Filter */}
          {segments.length > 0 && (
            <div>
              <button
                onClick={() =>
                  setExpandedSection(
                    expandedSection === "segment" ? null : "segment",
                  )
                }
                className="w-full flex items-center justify-between py-3 px-3 bg-white rounded-lg hover:bg-stone-100 transition-colors border border-stone-200"
              >
                <span className="font-semibold text-stone-900 text-sm">
                  Segmentos
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-600 transition-transform ${
                    expandedSection === "segment" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSection === "segment" && (
                <div className="mt-2 space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!selectedSegment}
                      onChange={() => handleSegmentChange(null)}
                      className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-stone-700">Todos</span>
                  </label>
                  {segments.map((segment) => (
                    <label
                      key={segment}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSegment === segment}
                        onChange={(e) =>
                          handleSegmentChange(e.target.checked ? segment : null)
                        }
                        className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-stone-700">{segment}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Neighborhoods Filter */}
          {neighborhoods.length > 0 && (
            <div>
              <button
                onClick={() =>
                  setExpandedSection(
                    expandedSection === "neighborhood" ? null : "neighborhood",
                  )
                }
                className="w-full flex items-center justify-between py-3 px-3 bg-white rounded-lg hover:bg-stone-100 transition-colors border border-stone-200"
              >
                <span className="font-semibold text-stone-900 text-sm">
                  Bairros
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-600 transition-transform ${
                    expandedSection === "neighborhood" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSection === "neighborhood" && (
                <div className="mt-2 space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!selectedNeighborhood}
                      onChange={() => handleNeighborhoodChange(null)}
                      className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-stone-700">Todos</span>
                  </label>
                  {neighborhoods.map((neighborhood) => (
                    <label
                      key={neighborhood}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedNeighborhood === neighborhood}
                        onChange={(e) =>
                          handleNeighborhoodChange(e.target.checked ? neighborhood : null)
                        }
                        className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-stone-700">{neighborhood}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
