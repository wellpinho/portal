import { Business } from "@/lib/types";
import BusinessCard from "@/components/BusinessCard";

interface FeaturedMerchantsProps {
  merchants: Business[];
  cityName: string;
}

export default function FeaturedMerchants({
  merchants,
  cityName,
}: FeaturedMerchantsProps) {
  if (merchants.length === 0) {
    return (
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-4">
            Destaques de {cityName}
          </h2>
          <p className="text-stone-600 text-lg">
            Nenhum comércio em destaque no momento. Em breve teremos novidades!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
            Destaques de {cityName}
          </h2>
          <p className="text-stone-600">
            Os principais comércios da sua região
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {merchants.map((merchant, index) => (
            <BusinessCard
              key={merchant.slug}
              business={merchant}
              priority={index < 2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
