"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Buscar comércio, serviço ou produto...",
}: SearchBarProps) {
  return (
    <div className="relative flex items-center">
      <Search
        className="absolute left-3.5 w-5 h-5 text-stone-400 pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 pl-11 pr-10 rounded-xl border border-stone-200 bg-white text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
        aria-label="Buscar estabelecimento"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 text-stone-400 hover:text-stone-600 touch-manipulation p-1"
          aria-label="Limpar busca"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
