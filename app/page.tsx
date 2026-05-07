import Header from "@/components/Header";
import GlobalHero from "@/components/home/GlobalHero";
import CitySearch from "@/components/home/CitySearch";
import FeaturedCities from "@/components/home/FeaturedCities";
import { FooterComponent } from "@/components/Footer";

export const metadata = {
  title: "Comércios Locais – Apoie o Comércio Local",
  description:
    "Descubra os melhores comércios, serviços e produtos de sua região. Apoie negócios locais e fortaleça sua comunidade.",
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <GlobalHero />

        {/* Search Section */}
        <section className="py-12 sm:py-16 bg-stone-50 border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-4">
                Buscar Cidades
              </h2>
              <p className="text-stone-600">
                Encontre comércios locais em sua cidade
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <CitySearch />
            </div>
          </div>
        </section>

        {/* Featured Cities */}
        <FeaturedCities />
      </main>

      <FooterComponent />
    </div>
  );
}
