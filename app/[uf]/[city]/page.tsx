import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import HomePageClient from "@/components/HomePageClient";
import { getBusinessesByLocation } from "@/lib/business-service";
import { findCityRoute, formatCityNameFromSlug } from "@/lib/locations";
import { FooterComponent } from "@/components/Footer";

type CityPageProps = {
  params: Promise<{ uf: string; city: string }>;
};

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { uf, city } = await params;
  const cityRoute = findCityRoute(uf, city);
  const cityName = cityRoute?.cityName ?? formatCityNameFromSlug(city);
  const ufLabel = uf.toUpperCase();

  return {
    title: {
      absolute: `Comércios e Serviços em ${cityName} - ${ufLabel} | Comércios Locais`,
    },
    description: `Encontre ovos coloniais, eletricistas, restaurantes e muito mais em ${cityName}. Apoie o comércio local!`,
    openGraph: {
      title: `Comércios e Serviços em ${cityName} - ${ufLabel} | Comércios Locais`,
      description: `Encontre ovos coloniais, eletricistas, restaurantes e muito mais em ${cityName}. Apoie o comércio local!`,
    },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { uf, city } = await params;
  const cityRoute = findCityRoute(uf, city);

  if (!cityRoute) {
    notFound();
  }

  const businesses = await getBusinessesByLocation(
    cityRoute.uf,
    cityRoute.citySlug,
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header currentCity={cityRoute} />
      <HomePageClient businesses={businesses} />
      <FooterComponent />
    </div>
  );
}
