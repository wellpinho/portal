"use client";

import { ChevronDown, Search, X } from "lucide-react";

interface SearchBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  neighborhoodValue: string;
  onNeighborhoodChange: (value: string) => void;
  neighborhoods: string[];
  searchPlaceholder?: string;
}

export default function SearchBar({
  searchValue,
  onSearchChange,
  neighborhoodValue,
  onNeighborhoodChange,
  neighborhoods,
  searchPlaceholder = "Pesquisar o nome",
}: SearchBarProps) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white transition-shadow focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-1">
      <div className="flex flex-col sm:flex-row sm:items-stretch">
        <div className="relative flex-1">
          <input
            type="search"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-12 w-full rounded-t-xl px-4 pr-16 text-sm text-stone-900 placeholder-stone-400 outline-none sm:rounded-none sm:rounded-l-xl"
            aria-label="Pesquisar o nome"
          />

          {searchValue ? (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-10 top-1/2 -translate-y-1/2 rounded-md p-1 text-stone-600 transition-colors hover:text-stone-700"
              aria-label="Limpar busca"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}

          <Search
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-600"
            aria-hidden="true"
          />
        </div>

        <div
          className="border-t border-stone-200 sm:border-l sm:border-t-0"
          aria-hidden="true"
        />

        <div className="relative sm:w-64">
          <select
            value={neighborhoodValue}
            onChange={(e) => onNeighborhoodChange(e.target.value)}
            className="h-12 w-full appearance-none rounded-b-xl bg-white px-4 pr-10 text-sm text-stone-700 outline-none sm:rounded-none sm:rounded-r-xl"
            aria-label="Selecione o bairro"
          >
            <option value="Todos os bairros">Selecione o Bairro</option>
            {neighborhoods.map((neighborhood) => (
              <option key={neighborhood} value={neighborhood}>
                {neighborhood}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-600"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
