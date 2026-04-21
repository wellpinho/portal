"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Home,
  Car,
  Hammer,
  Sparkles,
  GraduationCap,
  Map,
  Tractor,
  ShoppingBag,
  Zap,
  X,
  LayoutGrid,
  Sprout,
  UtensilsCrossed,
  Wrench,
  HeartPulse,
} from "lucide-react";
import { Category } from "@/lib/types";
import { EXTRA_CATEGORIES, PRIMARY_CATEGORIES } from "@/lib/mock-data";

/** Ícone associado a cada categoria (primárias + extras) */
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Todos: LayoutGrid,
  "Produtos Coloniais": Sprout,
  Gastronomia: UtensilsCrossed,
  Serviços: Wrench,
  Saúde: HeartPulse,
  Casa: Home,
  Carro: Car,
  Construção: Hammer,
  "Moda & Beleza": Sparkles,
  Educação: GraduationCap,
  Turismo: Map,
  Agropecuária: Tractor,
  Comércio: ShoppingBag,
  Utilidade: Zap,
};

/** Todas as categorias na ordem desejada para o mobile sheet */
const ALL_CATEGORIES: Category[] = [...PRIMARY_CATEGORIES, ...EXTRA_CATEGORIES];

interface CategoryFilterProps {
  selected: Category;
  onSelect: (category: Category) => void;
}

export default function CategoryFilter({
  selected,
  onSelect,
}: CategoryFilterProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function handleSelect(cat: Category) {
    onSelect(cat);
    setOpen(false);
  }

  const extraIsSelected = EXTRA_CATEGORIES.includes(selected as never);

  return (
    <>
      <div className="flex items-center gap-2">
        {/* ── Chips primários — apenas no desktop, irmãos do botão Mais ── */}
        {PRIMARY_CATEGORIES.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={selected === cat}
            onClick={() => handleSelect(cat)}
            className={[
              "hidden sm:flex shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all touch-manipulation cursor-pointer",
              selected === cat
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 active:bg-stone-100",
            ].join(" ")}
          >
            {cat}
          </button>
        ))}

        {/* ── Botão Mais/Menu — sempre visível, inline com os chips ── */}
        <div ref={dropdownRef} className="relative shrink-0 pb-1">
          <button
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={[
              "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all touch-manipulation cursor-pointer",
              extraIsSelected
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 active:bg-stone-100",
            ].join(" ")}
          >
            {extraIsSelected ? (
              selected
            ) : (
              <>
                <span className="md:hidden">Menu</span>
                <span className="hidden md:inline">Mais categorias</span>
              </>
            )}
            <ChevronDown
              className={[
                "w-3.5 h-3.5 transition-transform duration-200",
                open ? "rotate-180" : "",
              ].join(" ")}
              aria-hidden="true"
            />
          </button>

          {/* ── Desktop: dropdown com categorias extras ── */}
          {open && (
            <div
              role="dialog"
              aria-label="Mais categorias"
              className="hidden sm:block absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-stone-100 shadow-lg py-1.5 z-50"
            >
              {EXTRA_CATEGORIES.map((cat) => {
                const Icon = CATEGORY_ICONS[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => handleSelect(cat)}
                    className={[
                      "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors touch-manipulation cursor-pointer",
                      selected === cat
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : "text-stone-700 hover:bg-stone-50 active:bg-stone-100",
                    ].join(" ")}
                  >
                    {Icon && (
                      <Icon
                        className="w-4 h-4 shrink-0 text-stone-400"
                        aria-hidden="true"
                      />
                    )}
                    {cat}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile: bottom sheet com TODAS as categorias ── */}
      {open && (
        <div
          className="sm:hidden fixed inset-0 z-50 flex items-end"
          role="dialog"
          aria-modal="true"
          aria-label="Todas as categorias"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full bg-white rounded-t-3xl shadow-xl px-4 pt-5 pb-8 z-10">
            <div
              className="mx-auto w-10 h-1 rounded-full bg-stone-200 mb-5"
              aria-hidden="true"
            />

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-stone-900">Categorias</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {ALL_CATEGORIES.map((cat) => {
                const Icon = CATEGORY_ICONS[cat];
                const isActive = selected === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleSelect(cat)}
                    className={[
                      "flex flex-col items-center justify-center gap-2 rounded-2xl py-4 px-2 text-xs font-medium transition-all touch-manipulation",
                      isActive
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-stone-50 text-stone-700 border border-stone-200 active:bg-stone-100",
                    ].join(" ")}
                  >
                    {Icon && (
                      <Icon
                        className={[
                          "w-6 h-6",
                          isActive ? "text-white" : "text-emerald-600",
                        ].join(" ")}
                        aria-hidden="true"
                      />
                    )}
                    <span className="text-center leading-tight">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
