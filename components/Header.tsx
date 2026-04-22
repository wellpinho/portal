"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MapPin, ChevronDown, Store } from "lucide-react";
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
}

export default function Header({ currentCity }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const pathnameParts = pathname.split("/").filter(Boolean);
  const routeCity =
    pathnameParts.length >= 2
      ? findCityRoute(pathnameParts[0], pathnameParts[1])
      : null;

  const activeCity = currentCity ?? routeCity ?? DEFAULT_CITY_ROUTE;

  function handleChangeCity(city: CityRoute) {
    const nextPath = toCityPath(city.uf, city.citySlug);
    void fetch("/api/location", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: nextPath }),
    });
    setOpen(false);
    router.push(nextPath);
  }

  return (
    <header className="sticky top-0 z-50 h-16 bg-emerald-700 text-white shadow-md">
      <div className="max-w-2xl mx-auto h-full px-4 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link
          href={toCityPath(activeCity.uf, activeCity.citySlug)}
          className="flex items-center gap-2 shrink-0"
          aria-label="Comércios Locais – início"
        >
          <LogoComponent />
        </Link>

        {/* City selector */}
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 active:bg-white/10 px-3 py-1.5 rounded-full text-sm font-medium transition-colors touch-manipulation"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-label="Selecionar cidade"
          >
            <MapPin
              className="w-3.5 h-3.5 text-emerald-100 shrink-0"
              aria-hidden="true"
            />
            <span className="max-w-32 truncate">{activeCity.cityName}</span>
            <ChevronDown
              className={[
                "w-3.5 h-3.5 transition-transform duration-200",
                open ? "rotate-180" : "",
              ].join(" ")}
              aria-hidden="true"
            />
          </button>

          {open && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setOpen(false)}
                aria-hidden="true"
              />
              <ul
                role="listbox"
                aria-label="Cidades disponíveis"
                className="absolute right-0 top-full mt-2 w-56 bg-white text-stone-900 rounded-xl shadow-xl border border-stone-100 py-1 z-50"
              >
                {SUPPORTED_CITY_ROUTES.map((city) => (
                  <li key={`${city.uf}-${city.citySlug}`}>
                    <button
                      role="option"
                      aria-selected={
                        city.uf === activeCity.uf &&
                        city.citySlug === activeCity.citySlug
                      }
                      onClick={() => handleChangeCity(city)}
                      className={[
                        "w-full text-left px-4 py-3 text-sm transition-colors touch-manipulation",
                        city.uf === activeCity.uf &&
                        city.citySlug === activeCity.citySlug
                          ? "bg-emerald-50 text-emerald-700 font-semibold"
                          : "hover:bg-stone-50 active:bg-stone-100",
                      ].join(" ")}
                    >
                      {city.cityName}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
