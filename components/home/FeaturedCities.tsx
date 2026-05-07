import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Users } from "lucide-react";
import { getFeaturedCities } from "@/lib/data/cities";

export default function FeaturedCities() {
  const cities = getFeaturedCities(4);

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
            Cidades em Destaque
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Descubra comunidades vibrantes e seus comércios locais únicos
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cities.map((city) => (
            <Link
              key={city.id}
              href={`/${city.state.toLowerCase()}/${city.slug}`}
              className="group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <article className="relative aspect-video bg-stone-200 overflow-hidden">
                {/* Image */}
                <Image
                  src={city.imageUrl}
                  alt={city.displayName}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-lg font-bold text-white mb-2">
                    {city.name}
                  </h3>
                  <p className="text-sm text-stone-100 mb-3 line-clamp-2">
                    {city.description}
                  </p>
                  <div className="flex items-center text-white text-sm font-semibold">
                    Explorar <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>

                {/* Info Badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg p-2 flex items-center gap-2 text-stone-900 text-xs font-semibold shadow-md">
                  <Users className="w-4 h-4" aria-hidden="true" />
                  <span>{(city.population ?? 0).toLocaleString("pt-BR")}</span>
                </div>

                {/* Location Badge */}
                <div className="absolute bottom-3 left-3 bg-emerald-600 text-white rounded-full flex items-center gap-1 px-3 py-1 text-xs font-semibold shadow-md">
                  <MapPin className="w-3 h-3" aria-hidden="true" />
                  {city.state}
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-12">
          <Link
            href="/todas-as-cidades"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-100 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-200 transition-colors"
          >
            Ver Todas as Cidades
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
