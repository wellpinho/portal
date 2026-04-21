"use client";

import { useState } from "react";
import { MapPin, ChevronDown, Store } from "lucide-react";

const CITIES = [
  "Águas Mornas",
  "Santo Amaro da Imperatriz",
  "São Pedro de Alcântara",
  "Palhoça",
];

export default function Header() {
  const [city, setCity] = useState("Águas Mornas");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-16 bg-emerald-700 text-white shadow-md">
      <div className="max-w-2xl mx-auto h-full px-4 flex items-center justify-between gap-3">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 shrink-0"
          aria-label="Comércios Locais – início"
        >
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Store className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-extrabold tracking-tight">
              Comércios
            </span>
            <span className="text-[10px] font-semibold text-emerald-200 -mt-0.5 tracking-wide uppercase">
              Locais
            </span>
          </div>
        </a>

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
              className="w-3.5 h-3.5 text-emerald-200 shrink-0"
              aria-hidden="true"
            />
            <span className="max-w-32 truncate">{city}</span>
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
                {CITIES.map((c) => (
                  <li key={c}>
                    <button
                      role="option"
                      aria-selected={c === city}
                      onClick={() => {
                        setCity(c);
                        setOpen(false);
                      }}
                      className={[
                        "w-full text-left px-4 py-3 text-sm transition-colors touch-manipulation",
                        c === city
                          ? "bg-emerald-50 text-emerald-700 font-semibold"
                          : "hover:bg-stone-50 active:bg-stone-100",
                      ].join(" ")}
                    >
                      {c}
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
