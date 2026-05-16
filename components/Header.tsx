"use client";

import {
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MapPin, Building2, ChevronDown, X, Megaphone } from "lucide-react";
import {
  CityRoute,
  DEFAULT_CITY_ROUTE,
  SUPPORTED_CITY_ROUTES,
  findCityRoute,
  toCityPath,
} from "@/lib/locations";
import { REGISTERED_CITIES } from "@/lib/data/cities-neighborhood.data";
import LogoComponent from "./Logo";

type SelectOption = {
  value: string;
  label: string;
};

interface CustomSelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
  buttonClassName: string;
  menuClassName?: string;
}

function CustomSelect({
  value,
  options,
  onChange,
  ariaLabel,
  buttonClassName,
  menuClassName,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listboxId = useId();

  const selectedIndex = Math.max(
    options.findIndex((option) => option.value === value),
    0,
  );
  const selectedOption = options[selectedIndex] ?? options[0];

  function closeMenu() {
    setOpen(false);
    setActiveIndex(-1);
  }

  function openMenu() {
    setOpen(true);
    setActiveIndex(selectedIndex);
  }

  function selectIndex(index: number) {
    const next = options[index];
    if (!next) return;
    onChange(next.value);
    closeMenu();
  }

  useEffect(() => {
    function onDocumentPointerDown(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!containerRef.current?.contains(target)) {
        closeMenu();
      }
    }

    function onDocumentKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    document.addEventListener("mousedown", onDocumentPointerDown);
    document.addEventListener("keydown", onDocumentKeyDown);

    return () => {
      document.removeEventListener("mousedown", onDocumentPointerDown);
      document.removeEventListener("keydown", onDocumentKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  function onTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (["Enter", " ", "ArrowDown"].includes(event.key)) {
      event.preventDefault();
      if (!open) {
        openMenu();
      } else {
        setActiveIndex((prev) =>
          prev < options.length - 1 ? prev + 1 : options.length - 1,
        );
      }
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        openMenu();
      } else {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }
    }
  }

  function onListKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) =>
        prev < options.length - 1 ? prev + 1 : options.length - 1,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      selectIndex(activeIndex === -1 ? selectedIndex : activeIndex);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
    }
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        className={buttonClassName}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={onTriggerKeyDown}
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-stone-400 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          className={
            menuClassName ??
            "absolute left-0 right-0 top-[calc(100%+0.35rem)] z-70 max-h-64 overflow-y-auto rounded-xl border border-stone-200 bg-white p-1.5 shadow-xl"
          }
          onKeyDown={onListKeyDown}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;

            return (
              <button
                key={option.value}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                type="button"
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectIndex(index)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  isSelected
                    ? "bg-emerald-50 text-emerald-900"
                    : isActive
                      ? "bg-stone-100 text-stone-900"
                      : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface HeaderProps {
  currentCity?: CityRoute;
  selectedNeighborhood?: string;
}

export default function Header({
  currentCity,
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

  function handleChangeCity(value: string) {
    const [uf, citySlug] = value.split("|");
    const nextPath = toCityPath(uf, citySlug);
    void fetch("/api/location", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: nextPath }),
    });
    router.push(nextPath);
    setDrawerOpen(false);
  }

  function handleChangeNeighborhood(value: string) {
    const params = new URLSearchParams();
    if (value !== "Todos os bairros") {
      params.set("bairro", value);
    }
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`);
    setDrawerOpen(false);
  }

  const cityOptions = useMemo<SelectOption[]>(
    () =>
      SUPPORTED_CITY_ROUTES.map((city) => ({
        value: `${city.uf}|${city.citySlug}`,
        label: city.cityName,
      })),
    [],
  );

  const neighborhoodOptions = useMemo<SelectOption[]>(() => {
    // Obter bairros da cidade selecionada do REGISTERED_CITIES
    const cityData = REGISTERED_CITIES[activeCity.citySlug];
    const bairros = cityData?.bairros ?? [];

    return [
      { value: "Todos os bairros", label: "Todos os bairros" },
      ...bairros.map((bairro) => ({
        value: bairro.name,
        label: bairro.name,
      })),
    ];
  }, [activeCity.citySlug]);

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
              <span>Anuncie sua marca</span>
              <Megaphone className="h-3.5 w-3.5" aria-hidden="true" />
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

            {/* Desktop: two inline custom dropdowns */}
            <div className="hidden sm:flex items-stretch border border-stone-200 rounded-xl bg-white">
              <div className="flex flex-1 items-center gap-2 px-3 border-r border-stone-200 hover:bg-stone-50 transition-colors">
                <MapPin
                  className="w-3.5 h-3.5 text-emerald-600 shrink-0 pointer-events-none"
                  aria-hidden="true"
                />
                <CustomSelect
                  value={`${activeCity.uf}|${activeCity.citySlug}`}
                  onChange={handleChangeCity}
                  ariaLabel="Selecionar cidade"
                  options={cityOptions}
                  buttonClassName="flex w-full items-center justify-between gap-2 py-3 text-sm font-medium text-stone-700 outline-none"
                  menuClassName="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-70 max-h-64 overflow-y-auto rounded-xl border border-stone-200 bg-white p-1.5 shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile bottom drawer ── */}
      {drawerOpen && (
        <div className="sm:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 animate-fade-in"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Sheet */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filtrar localização"
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl min-h-[25vh] overflow-y-auto animate-slide-up"
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
              <div className="flex items-center gap-3 border border-stone-200 rounded-xl px-3 bg-white hover:bg-stone-50 transition-colors relative">
                <MapPin
                  className="w-4 h-4 text-emerald-600 shrink-0 pointer-events-none"
                  aria-hidden="true"
                />
                <CustomSelect
                  value={`${activeCity.uf}|${activeCity.citySlug}`}
                  onChange={handleChangeCity}
                  ariaLabel="Selecionar cidade"
                  options={cityOptions}
                  buttonClassName="flex w-full items-center justify-between gap-2 py-3.5 text-base font-medium text-stone-800 outline-none"
                  menuClassName="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-70 max-h-48 overflow-y-auto rounded-xl border border-stone-200 bg-white p-1.5 shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <Link
        href="/anunciante/onboarding"
        className="fixed right-0 top-[32%] z-60 -translate-y-1/2 rounded-l-xl bg-emerald-600 px-2 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-lg shadow-emerald-900/25 transition-all hover:bg-emerald-500 active:translate-x-0 sm:hidden [writing-mode:vertical-rl]"
        aria-label="Anuncie sua marca"
      >
        Anuncie sua marca
      </Link>
    </>
  );
}
