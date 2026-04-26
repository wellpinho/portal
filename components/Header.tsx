"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MapPin, Building2, ChevronDown, CirclePlus, X } from "lucide-react";
import {
  CityRoute,
  DEFAULT_CITY_ROUTE,
  SUPPORTED_CITY_ROUTES,
  findCityRoute,
  toCityPath,
} from "@/lib/locations";
import LogoComponent from "./Logo";

interface HeaderProps {
  currentCity?: CityRoute;
  neighborhoods?: string[];
  selectedNeighborhood?: string;
}

export default function Header({
  currentCity,
  neighborhoods = [],
  selectedNeighborhood = "Todos os bairros",
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const pathnameParts = pathname.split("/").filter(Boolean);
  const routeCity =
    pathnameParts.length >= 2
      ? findCityRoute(pathnameParts[0], pathnameParts[1])
      : null;

  const activeCity = currentCity ?? routeCity ?? DEFAULT_CITY_ROUTE;

  function handleChangeCity(e: React.ChangeEvent<HTMLSelectElement>) {
    const [uf, citySlug] = e.target.value.split("|");
    const nextPath = toCityPath(uf, citySlug);
    void fetch("/api/location", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: nextPath }),
    });
    router.push(nextPath);
    setDrawerOpen(false);
  }

  function handleChangeNeighborhood(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const params = new URLSearchParams();
    if (value !== "Todos os bairros") {
      params.set("bairro", value);
    }
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`);
    setDrawerOpen(false);
  }

  const inlineSelectClass =
    "flex-1 min-w-0 appearance-none bg-transparent text-sm text-stone-700 font-medium outline-none border-none cursor-pointer py-3 truncate antialiased";

  const drawerSelectClass =
    "flex-1 min-w-0 appearance-none bg-transparent text-base text-stone-800 font-medium outline-none border-none cursor-pointer py-3.5 antialiased";

  const locationLabel =
    selectedNeighborhood === "Todos os bairros"
      ? activeCity.cityName
      : `${activeCity.cityName} • ${selectedNeighborhood}`;

  return (
    <>
      <header className="sticky top-0 z-50 antialiased shadow-md">
        {/* ── Green main bar ── */}
        <div className="h-14 bg-emerald-700 text-white">
          <div className="max-w-2xl mx-auto h-full px-4 flex items-center justify-between gap-3">
            <Link
              href={toCityPath(activeCity.uf, activeCity.citySlug)}
              className="flex items-center gap-2 shrink-0"
              aria-label="Comércios Locais – início"
            >
              <LogoComponent />
            </Link>

            <Link
              href="/anunciante/onboarding"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm transition-all hover:bg-emerald-50 active:scale-[0.98] shrink-0"
              aria-label="Anuncie sua marca"
            >
              <CirclePlus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Anuncie sua marca</span>
            </Link>
          </div>
        </div>

        {/* ── Secondary location bar ── */}
        <div className="bg-white border-b border-stone-200">
          <div className="max-w-2xl mx-auto px-4 py-2">
            {/* Mobile: unified button → opens drawer */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="sm:hidden w-full flex items-center gap-2.5 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-left transition-all active:scale-[0.98] active:bg-slate-200"
              aria-label="Filtrar por cidade e bairro"
              aria-expanded={drawerOpen}
              aria-haspopup="dialog"
            >
              <MapPin
                className="w-4 h-4 text-emerald-600 shrink-0"
                aria-hidden="true"
              />
              <span className="flex-1 min-w-0 text-sm font-medium text-stone-700 truncate antialiased">
                {locationLabel}
              </span>
              <ChevronDown
                className="w-4 h-4 text-stone-400 shrink-0"
                aria-hidden="true"
              />
            </button>

            {/* Desktop: two inline selects */}
            <div className="hidden sm:flex items-stretch border border-stone-200 rounded-xl overflow-hidden bg-white">
              <label className="flex flex-1 items-center gap-1.5 px-3 border-r border-stone-200 cursor-pointer hover:bg-stone-50 transition-colors">
                <MapPin
                  className="w-3.5 h-3.5 text-emerald-600 shrink-0 pointer-events-none"
                  aria-hidden="true"
                />
                <select
                  value={`${activeCity.uf}|${activeCity.citySlug}`}
                  onChange={handleChangeCity}
                  className={inlineSelectClass}
                  aria-label="Selecionar cidade"
                >
                  {SUPPORTED_CITY_ROUTES.map((city) => (
                    <option
                      key={`${city.uf}-${city.citySlug}`}
                      value={`${city.uf}|${city.citySlug}`}
                    >
                      {city.cityName}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="w-3.5 h-3.5 text-stone-400 shrink-0 pointer-events-none"
                  aria-hidden="true"
                />
              </label>

              <label className="flex flex-1 items-center gap-1.5 px-3 cursor-pointer hover:bg-stone-50 transition-colors">
                <Building2
                  className="w-3.5 h-3.5 text-emerald-600 shrink-0 pointer-events-none"
                  aria-hidden="true"
                />
                <select
                  value={selectedNeighborhood}
                  onChange={handleChangeNeighborhood}
                  className={inlineSelectClass}
                  aria-label="Selecionar bairro"
                >
                  <option value="Todos os bairros">Todos os bairros</option>
                  {neighborhoods.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="w-3.5 h-3.5 text-stone-400 shrink-0 pointer-events-none"
                  aria-hidden="true"
                />
              </label>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile bottom drawer ── */}
      {drawerOpen && (
        <div className="sm:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Sheet */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filtrar localização"
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-2.5 pb-1">
              <div className="w-8 h-1 bg-stone-300 rounded-full" />
            </div>

            {/* Drawer header */}
            <div className="flex items-center justify-between px-4 pb-3">
              <h2 className="text-sm font-semibold text-stone-700">
                Localização
              </h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 transition-colors"
                aria-label="Fechar"
              >
                <X className="w-4 h-4 text-stone-500" aria-hidden="true" />
              </button>
            </div>

            {/* Selects */}
            <div className="px-4 pb-10 space-y-3">
              <label className="flex items-center gap-3 border border-stone-200 rounded-xl px-3 bg-white hover:bg-stone-50 transition-colors cursor-pointer">
                <MapPin
                  className="w-4 h-4 text-emerald-600 shrink-0 pointer-events-none"
                  aria-hidden="true"
                />
                <select
                  value={`${activeCity.uf}|${activeCity.citySlug}`}
                  onChange={handleChangeCity}
                  className={drawerSelectClass}
                  aria-label="Selecionar cidade"
                >
                  {SUPPORTED_CITY_ROUTES.map((city) => (
                    <option
                      key={`${city.uf}-${city.citySlug}`}
                      value={`${city.uf}|${city.citySlug}`}
                    >
                      {city.cityName}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="w-4 h-4 text-stone-400 shrink-0 pointer-events-none"
                  aria-hidden="true"
                />
              </label>

              <label className="flex items-center gap-3 border border-stone-200 rounded-xl px-3 bg-white hover:bg-stone-50 transition-colors cursor-pointer">
                <Building2
                  className="w-4 h-4 text-emerald-600 shrink-0 pointer-events-none"
                  aria-hidden="true"
                />
                <select
                  value={selectedNeighborhood}
                  onChange={handleChangeNeighborhood}
                  className={drawerSelectClass}
                  aria-label="Selecionar bairro"
                >
                  <option value="Todos os bairros">Todos os bairros</option>
                  {neighborhoods.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="w-4 h-4 text-stone-400 shrink-0 pointer-events-none"
                  aria-hidden="true"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      <Link
        href="/anunciante/onboarding"
        className="fixed right-0 top-1/2 z-60 -translate-y-1/2 rounded-l-xl bg-emerald-600 px-2 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-lg shadow-emerald-900/25 transition-all hover:bg-emerald-500 active:translate-x-0 sm:hidden [writing-mode:vertical-rl]"
        aria-label="Anuncie sua marca"
      >
        Anuncie sua marca
      </Link>
    </>
  );
}
