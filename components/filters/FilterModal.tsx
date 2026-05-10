"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, X } from "lucide-react";
import { useState } from "react";

interface FilterModalProps {
  segments: string[];
  selectedSegment?: string;
  neighborhoods: string[];
  selectedNeighborhood?: string;
  currentState: string;
  currentCity: string;
  currentCategory: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterModal({
  segments,
  selectedSegment,
  neighborhoods,
  selectedNeighborhood,
  currentState,
  currentCity,
  currentCategory,
  isOpen,
  onClose,
}: FilterModalProps) {
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
    onClose();
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
    onClose();
  };

  const clearFilters = () => {
    router.push(`/${currentState}/${currentCity}/${currentCategory}`);
    onClose();
  };

  const hasActiveFilters = !!selectedSegment || !!selectedNeighborhood;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 lg:hidden max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-stone-200 px-4 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900">Filtros</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Fechar filtros"
          >
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Segments Filter */}
          {segments.length > 0 && (
            <div>
              <button
                onClick={() =>
                  setExpandedSection(
                    expandedSection === "segment" ? null : "segment",
                  )
                }
                className="w-full flex items-center justify-between py-3 px-3 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors"
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
                className="w-full flex items-center justify-between py-3 px-3 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors"
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

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-900 font-semibold rounded-lg transition-colors"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>
    </>
  );
}
