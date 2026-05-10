"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageCircleMore, Store } from "lucide-react";
import { Business, Category } from "@/lib/types";
import { getActiveCategoryViewLabel } from "@/lib/category-view-label";
import BusinessCard from "./BusinessCard";
import CategoryFilter from "./CategoryFilter";

const WHATSAPP_SHARE_MESSAGE = encodeURIComponent(
  "Oi! Conheci o Comércios Locais, um portal para ajudar a gente a encontrar tudo aqui em Águas Mornas. Dá uma olhada e vamos ajudar a divulgar nossos produtores e lojas: https://comercioslocais.com.br/aguas-mornas-sc",
);

interface HomePageClientProps {
  businesses: Business[];
  selectedNeighborhood?: string;
}

type ApiProfileItem = {
  id?: number | string;
  slug?: string;
  businessName?: string;
  businessWhatsapp?: string;
  category?: string;
  segment?: string;
  plan?: string;
  verified?: boolean;
  avatar?: string;
  reviews?: Array<{ score?: number }>;
  address?: {
    city?: string;
    state?: string;
    street?: string;
    neighborhood?: string;
  };
};

type ApiProfileListResponse = {
  data?: ApiProfileItem[];
};

const FALLBACK_CATEGORY: Exclude<Category, "Todos"> = "Comércio";

function toSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toDigits(value: string | undefined): string {
  return (value ?? "").replace(/\D/g, "");
}

function mapCategory(value: string | undefined): Exclude<Category, "Todos"> {
  const normalized = (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (normalized.includes("gastr")) return "Gastronomia";
  if (normalized.includes("saude") || normalized.includes("beleza")) {
    return "Saúde";
  }
  if (normalized.includes("agro") || normalized.includes("colonial")) {
    return "Produtos Coloniais";
  }
  if (normalized.includes("serv") || normalized.includes("manut")) {
    return "Serviços";
  }
  if (normalized.includes("automot")) return "Carro";
  if (normalized.includes("constr") || normalized.includes("casa")) {
    return "Construção";
  }
  if (normalized.includes("comerc") || normalized.includes("varejo")) {
    return "Comércio";
  }
  if (normalized.includes("turismo") || normalized.includes("lazer")) {
    return "Turismo";
  }

  return FALLBACK_CATEGORY;
}

function toBusinessList(data: unknown): Business[] {
  const response = data as ApiProfileListResponse | null;
  const items = Array.isArray(response?.data) ? response.data : [];

  return items.map((item, index) => {
    const name = item.businessName?.trim() || `Comércio ${index + 1}`;
    const city = item.address?.city?.trim() || "Águas Mornas";
    const neighborhood = item.address?.neighborhood?.trim() || city;
    const ratingRaw = Array.isArray(item.reviews)
      ? item.reviews.map((review) => Number(review.score || 0))
      : [];
    const ratingAverage =
      ratingRaw.length > 0
        ? ratingRaw.reduce((sum, current) => sum + current, 0) /
          ratingRaw.length
        : 0;
    const imageUrl =
      item.avatar?.trim() ||
      `https://picsum.photos/seed/${toSlug(name) || "comercio"}/400/300`;

    return {
      id: String(item.id ?? `${index + 1}`),
      slug: item.slug?.trim() || toSlug(name),
      name,
      businessName: item.businessName?.trim() || name,
      businessWhatsapp: item.businessWhatsapp?.trim() || "",
      category: mapCategory(item.category),
      segment: item.segment?.trim() || undefined,
      location: `${neighborhood}, ${city}`,
      mapUrl: "https://maps.google.com",
      address: {
        street: item.address?.street?.trim() || "Endereço não informado",
        city,
        state: item.address?.state?.trim() || "SC",
      },
      imageUrl,
      avatar: imageUrl,
      bannerUrl: imageUrl,
      logoUrl: imageUrl,
      galleryImages: [imageUrl, imageUrl, imageUrl, imageUrl],
      isOpen: true,
      isFeatured:
        item.plan?.toLowerCase() === "premium" || Boolean(item.verified),
      rating: Number.isFinite(ratingAverage) ? ratingAverage : 0,
      reviewCount: ratingRaw.length,
      description: `Conheça ${name} em ${city}.`,
      workingHours: ["Horário não informado"],
      paymentMethods: ["Pix"],
      hasParking: false,
    };
  });
}

function LoadingBusinessCard() {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#d5e8d4] bg-white shadow-sm">
      <div className="h-40 w-full animate-pulse bg-linear-to-r from-[#e9f5e8] via-[#f8fbf8] to-[#e9f5e8]" />
      <div className="space-y-3 p-3">
        <div className="h-3.5 w-2/3 animate-pulse rounded-full bg-stone-200" />
        <div className="h-3 w-1/3 animate-pulse rounded-full bg-emerald-100" />
        <div className="h-3 w-3/4 animate-pulse rounded-full bg-stone-100" />
        <div className="h-10 w-full animate-pulse rounded-xl bg-emerald-100" />
      </div>
    </article>
  );
}

export default function HomePageClient({
  selectedNeighborhood = "Todos os bairros",
}: HomePageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>("Todos");
  const [apiBusinesses, setApiBusinesses] = useState<Business[]>([]);
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true);

  useEffect(() => {
    let currentController: AbortController | null = null;

    async function fetchBusinessesFromApi() {
      currentController?.abort();
      const controller = new AbortController();
      currentController = controller;
      const timeoutId = window.setTimeout(() => controller.abort(), 8000);

      setIsLoadingBusinesses(true);

      try {
        const response = await fetch("/api/profile/list?page=1&limit=5", {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        const data: unknown = await response.json().catch(() => null);

        if (!response.ok) {
          setApiBusinesses([]);
          return;
        }

        const mapped = toBusinessList(data);
        setApiBusinesses(mapped);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setApiBusinesses([]);
      } finally {
        window.clearTimeout(timeoutId);
        setIsLoadingBusinesses(false);
      }
    }

    void fetchBusinessesFromApi();

    const onPageShow = () => {
      void fetchBusinessesFromApi();
    };

    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.removeEventListener("pageshow", onPageShow);
      currentController?.abort();
    };
  }, []);

  const businessesToDisplay = useMemo(() => apiBusinesses, [apiBusinesses]);

  const filtered = useMemo(() => {
    return businessesToDisplay.filter((b) => {
      const matchesCategory =
        selectedCategory === "Todos" || b.category === selectedCategory;

      const businessNeighborhood = b.address.street.split(",")[0]?.trim() ?? "";
      const matchesNeighborhood =
        selectedNeighborhood === "Todos os bairros" ||
        businessNeighborhood === selectedNeighborhood;

      return matchesCategory && matchesNeighborhood;
    });
  }, [businessesToDisplay, selectedCategory, selectedNeighborhood]);

  const featured = filtered.filter((b) => b.isFeatured);
  const common = filtered.filter((b) => !b.isFeatured);

  const activeListLabel = getActiveCategoryViewLabel(selectedCategory);

  const emptyStateTitle =
    selectedCategory === "Todos"
      ? "Ainda não encontramos anúncios para esta busca em Águas Mornas"
      : `Ainda não temos anúncios de ${selectedCategory} em Águas Mornas`;

  return (
    <main className="max-w-7xl mx-auto w-full px-4 pb-10">
      {/* Sticky filters – offset accounts for green bar (56px) + location bar (~60px) */}
      <div className="sticky top-28 z-40 bg-stone-50 pt-3 pb-3 space-y-2.5 -mx-4 px-4 border-b border-stone-100">
        <CategoryFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <div className="flex items-center justify-between gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs text-stone-700">
          <span className="font-semibold text-emerald-700">
            {activeListLabel}
          </span>
          <span>
            {filtered.length}{" "}
            {filtered.length === 1 ? "resultado" : "resultados"}
          </span>
        </div>
      </div>

      {isLoadingBusinesses && (
        <section className="mt-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <LoadingBusinessCard key={`loading-card-${index}`} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {!isLoadingBusinesses && filtered.length === 0 && (
        <section className="mx-auto flex max-w-lg flex-col items-center justify-center gap-4 py-20 text-center">
          <Store className="h-14 w-14 text-stone-600" aria-hidden="true" />

          <div className="w-full rounded-3xl border border-blue-100 bg-blue-50 px-5 py-6 shadow-sm sm:px-7">
            <p className="text-lg font-semibold leading-snug text-stone-700">
              {emptyStateTitle}
            </p>

            <p className="mt-2 text-sm font-medium text-blue-800">
              Ajude a fortalecer nossa economia local!
            </p>

            <p className="mt-3 text-sm leading-6 text-stone-600">
              Compartilhe o Comércios Locais com vizinhos, produtores e lojas da
              cidade para aumentar a divulgação da comunidade.
            </p>

            <a
              href={`https://wa.me/?text=${WHATSAPP_SHARE_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 sm:gap-3 rounded-2xl bg-emerald-500 px-2 py-3.5 text-sm font-semibold text-white transition-all hover:bg-emerald-600 active:scale-[0.98]"
              aria-label="Compartilhar Comércios Locais no WhatsApp"
            >
              <MessageCircleMore />
              Compartilhar no WhatsApp
            </a>
          </div>
        </section>
      )}

      {/* Featured section */}
      {!isLoadingBusinesses && featured.length > 0 && (
        <section aria-labelledby="section-destaque" className="mt-5">
          <h2
            id="section-destaque"
            className="text-sm font-bold text-stone-700 mb-3 flex items-center gap-2 uppercase tracking-wide"
          >
            <span
              className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400"
              aria-hidden="true"
            />
            Em Destaque
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {featured.map((b, index) => (
              <BusinessCard key={b.id} business={b} priority={index === 0} />
            ))}
          </div>
        </section>
      )}

      {/* Common section */}
      {!isLoadingBusinesses && common.length > 0 && (
        <section
          aria-labelledby="section-todos"
          className={featured.length > 0 ? "mt-8" : "mt-5"}
        >
          {featured.length > 0 && (
            <h2
              id="section-todos"
              className="text-sm font-bold text-stone-700 mb-3 flex items-center gap-2 uppercase tracking-wide"
            >
              <span
                className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"
                aria-hidden="true"
              />
              Todos os Comércios
            </h2>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {common.map((b, index) => (
              <BusinessCard
                key={b.id}
                business={b}
                priority={featured.length === 0 && index === 0}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
