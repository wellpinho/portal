import Link from "next/link";
import { FeaturedCategory } from "@/lib/data/cities";

interface CategoryGridProps {
  categories: FeaturedCategory[];
  state: string;
  city: string;
}

export default function CategoryGrid({
  categories,
  state,
  city,
}: CategoryGridProps) {
  return (
    <section className="py-12 sm:py-16 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
            Categorias Principais
          </h2>
          <p className="text-stone-600">
            Navegue pelos principais tipos de comércios de {city}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            const href = `/${state.toLowerCase()}/${city}/${category.slug}`;

            return (
              <Link
                key={category.id}
                href={href}
                className="group relative overflow-hidden rounded-xl bg-white border border-stone-200 hover:border-emerald-500 hover:shadow-lg transition-all duration-300"
              >
                <article className="p-6 flex flex-col items-center justify-center min-h-40 text-center">
                  {/* Icon */}
                  <div className="mb-4 p-3 rounded-lg bg-emerald-100 group-hover:bg-emerald-600 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                  </div>

                  {/* Name */}
                  <h3 className="font-semibold text-stone-900 group-hover:text-emerald-600 transition-colors duration-300">
                    {category.name}
                  </h3>

                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
