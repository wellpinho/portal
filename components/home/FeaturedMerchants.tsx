import { Business } from "@/lib/types";
import BusinessCard from "@/components/BusinessCard";
import Image from "next/image";
import CardVagaDisponivel from "../card-vaga-disponivel";

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
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-700 mb-4">
            Destaques de {cityName} <br />
          </h2>
          <p className="text-stone-600 text-lg">
            Seja o parceiro oficial do Comércios Locais na sua região e ganhe
            destaque exclusivo para milhares de clientes.
          </p>
        </div>

        {/* O Grid de Cards Vazios que geram o desejo */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <CardVagaDisponivel key={index} cityName={cityName} />
            ))}
          </div>
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
