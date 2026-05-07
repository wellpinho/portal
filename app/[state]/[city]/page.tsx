import type { Metadata } from "next";
import Header from "@/components/Header";
import CityHero from "@/components/home/CityHero";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedMerchants from "@/components/home/FeaturedMerchants";
import CityNotFound from "@/components/home/CityNotFound";
import { FooterComponent } from "@/components/Footer";
import { findCityConfig, getAllCitySlugs } from "@/lib/data/cities";
import { getBusinessesByLocation } from "@/lib/business-service";

type CityPageProps = {
  params: Promise<{ state: string; city: string }>;
};

export async function generateStaticParams() {
  return getAllCitySlugs().map(({ state, city }) => ({
    state,
    city,
  }));
}

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { state, city } = await params;
  const cityConfig = findCityConfig(city);

  if (!cityConfig) {
    return {
      title: "Cidade Não Encontrada",
    };
  }

  return {
    title: {
      absolute: `${cityConfig.displayName} - Comércios Locais | Comércios Locais`,
    },
    description: cityConfig.description,
    openGraph: {
      title: `${cityConfig.displayName} - Comércios Locais`,
      description: cityConfig.description,
      images: [cityConfig.heroImageUrl],
    },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { state, city } = await params;
  const cityConfig = findCityConfig(city);

  if (!cityConfig) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <CityNotFound state={state} city={city} />
        </main>
        <FooterComponent />
      </div>
    );
  }

  // Fetch featured merchants (mock implementation - in production, fetch from API)
  const featuredMerchants = await getBusinessesByLocation(
    state.toUpperCase(),
    city,
  ).then((businesses) => businesses.filter((b) => b.isFeatured).slice(0, 8));

  // Build CityRoute-like object for Header compatibility
  const cityRoute = {
    uf: state.toUpperCase(),
    citySlug: city,
    cityName: cityConfig.name,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header currentCity={cityRoute as any} />

      <main className="flex-1">
        {/* Hero */}
        <CityHero city={cityConfig} />

        {/* Category Grid */}
        <CategoryGrid
          categories={cityConfig.featuredCategories}
          state={state}
          city={city}
        />

        {/* Featured Merchants */}
        <FeaturedMerchants
          merchants={featuredMerchants}
          cityName={cityConfig.name}
        />
      </main>

      <FooterComponent />
    </div>
  );
}
