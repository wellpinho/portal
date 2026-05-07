import type { Metadata } from "next";
import Header from "@/components/Header";
import Breadcrumb, { BreadcrumbItem } from "@/components/common/Breadcrumb";
import CityNotFound from "@/components/home/CityNotFound";
import { FooterComponent } from "@/components/Footer";
import BusinessCard from "@/components/BusinessCard";
import {
  findCityConfig,
  getCategoryBySlug,
  getAllCitySlugs,
} from "@/lib/data/cities";
import { getBusinessesByLocation } from "@/lib/business-service";

type CategoryPageProps = {
  params: Promise<{ state: string; city: string; category: string }>;
};

export async function generateStaticParams() {
  const cityParams = getAllCitySlugs();
  const allParams: Array<{ state: string; city: string; category: string }> =
    [];

  for (const { state, city } of cityParams) {
    const cityConfig = findCityConfig(city);
    if (cityConfig) {
      for (const category of cityConfig.featuredCategories) {
        allParams.push({
          state,
          city,
          category: category.slug,
        });
      }
    }
  }

  return allParams;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { state, city, category } = await params;
  const cityConfig = findCityConfig(city);
  const categoryConfig = getCategoryBySlug(category);

  if (!cityConfig || !categoryConfig) {
    return {
      title: "Não Encontrado",
    };
  }

  return {
    title: {
      absolute: `${categoryConfig.name} em ${cityConfig.displayName} | Comércios Locais`,
    },
    description: `Descubra os melhores ${categoryConfig.name.toLowerCase()} em ${cityConfig.displayName}. Apoie o comércio local!`,
    openGraph: {
      title: `${categoryConfig.name} em ${cityConfig.displayName}`,
      description: `Descubra os melhores ${categoryConfig.name.toLowerCase()} em ${cityConfig.displayName}. Apoie o comércio local!`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { state, city, category } = await params;
  const cityConfig = findCityConfig(city);
  const categoryConfig = getCategoryBySlug(category);

  // 404: City not found
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

  // Build CityRoute-like object for Header compatibility
  const cityRoute = {
    uf: state.toUpperCase(),
    citySlug: city,
    cityName: cityConfig.name,
  };

  // 404: Category not found
  if (!categoryConfig) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header currentCity={cityRoute} />
        <main className="flex-1">
          <div className="min-h-screen bg-linear-to-br from-stone-50 to-stone-100 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
              <h1 className="text-2xl font-bold text-stone-900 mb-2">
                Categoria Não Encontrada
              </h1>
              <p className="text-stone-600 mb-6">
                A categoria solicitada não existe.
              </p>
              <a
                href={`/${state.toLowerCase()}/${city}`}
                className="inline-block px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Voltar para {cityConfig.name}
              </a>
            </div>
          </div>
        </main>
        <FooterComponent />
      </div>
    );
  }

  // Fetch businesses by category (mock - in production, filter by category ID)
  const allBusinesses = await getBusinessesByLocation(
    state.toUpperCase(),
    city,
  );

  // In production, you would filter by category ID from the database
  // For now, we filter by segment/category name (simple mock)
  const businesses = allBusinesses.filter((b) =>
    b.category?.toLowerCase().includes(categoryConfig.name.toLowerCase()),
  );

  // Breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: cityConfig.name,
      href: `/${state.toLowerCase()}/${city}`,
    },
    {
      label: categoryConfig.name,
      active: true,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header currentCity={cityRoute} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="py-4 sm:py-6 bg-stone-50 border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </section>

        {/* Header */}
        <section className="py-8 sm:py-12 bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              {/* Category Icon */}
              {categoryConfig && (
                <div className="p-3 rounded-lg bg-emerald-100 hidden sm:block">
                  {(() => {
                    const Icon = categoryConfig.icon;
                    return <Icon className="w-8 h-8 text-emerald-600" />;
                  })()}
                </div>
              )}

              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-stone-900">
                  {categoryConfig.name}
                </h1>
                <p className="text-stone-600 mt-1">
                  {businesses.length}{" "}
                  {businesses.length === 1 ? "comércio" : "comércios"}{" "}
                  encontrado
                  {businesses.length !== 1 ? "s" : ""} em {cityConfig.name}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Business Grid */}
        <section className="py-12 sm:py-16 bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {businesses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {businesses.map((business, index) => (
                  <BusinessCard
                    key={business.slug}
                    business={business}
                    priority={index < 2}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-stone-600 mb-6">
                  Nenhum comércio encontrado nesta categoria.
                </p>
                <a
                  href={`/${state.toLowerCase()}/${city}`}
                  className="inline-block px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Explorar outras categorias
                </a>
              </div>
            )}
          </div>
        </section>
      </main>

      <FooterComponent />
    </div>
  );
}
