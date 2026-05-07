"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search, X } from "lucide-react";
import { CITY_CONFIGS } from "@/lib/data/cities";

interface SearchSuggestion {
  name: string;
  displayName: string;
  slug: string;
  state: string;
}

export default function CitySearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Filter cities based on query
  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const filtered = CITY_CONFIGS.filter(
      (city) =>
        city.displayName.toLowerCase().includes(query.toLowerCase()) ||
        city.name.toLowerCase().includes(query.toLowerCase()),
    ).map((city) => ({
      name: city.name,
      displayName: city.displayName,
      slug: city.slug,
      state: city.state,
    }));

    setSuggestions(filtered);
    setIsOpen(filtered.length > 0);
    setSelectedIndex(-1);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          selectCity(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  // Handle city selection
  const selectCity = (city: SearchSuggestion) => {
    const path = `/${city.state.toLowerCase()}/${city.slug}`;
    router.push(path);
    setQuery("");
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-md relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar cidade..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && suggestions.length > 0 && setIsOpen(true)}
          className="w-full pl-10 pr-10 py-3 rounded-lg border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none transition-all text-stone-900 placeholder-stone-500"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="city-suggestions"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            aria-label="Limpar busca"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul
          id="city-suggestions"
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-300 rounded-lg shadow-lg z-50 overflow-hidden"
          role="listbox"
        >
          {suggestions.map((city, index) => (
            <li key={`${city.slug}-${index}`} role="option">
              <button
                onClick={() => selectCity(city)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  index === selectedIndex
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-stone-900 hover:bg-stone-50"
                }`}
                aria-selected={index === selectedIndex}
              >
                <MapPin
                  className="w-4 h-4 shrink-0"
                  aria-hidden="true"
                  strokeWidth={2}
                />
                <div>
                  <div className="font-semibold">{city.displayName}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* No results */}
      {isOpen && query && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-300 rounded-lg shadow-lg p-4 text-center text-stone-500 text-sm z-50">
          Nenhuma cidade encontrada
        </div>
      )}
    </div>
  );
}
