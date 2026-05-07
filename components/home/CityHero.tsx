import Image from "next/image";
import { CityConfig } from "@/lib/data/cities";

interface CityHeroProps {
  city: CityConfig;
}

export default function CityHero({ city }: CityHeroProps) {
  return (
    <section
      className="relative h-80 sm:h-96 lg:h-105 overflow-hidden bg-stone-400"
      style={{
        backgroundImage: `url(${city.heroImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay - Dupla camada para melhor contraste */}
      {/* Camada 1: Escurecimento uniforme */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Camada 2: Gradiente radial/linear forte na base */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

      {/* Content Container - z-10 para ficar acima do overlay */}
      <div className="relative z-10 container mx-auto h-full flex flex-col justify-end items-start p-6 sm:p-8 lg:p-12 sm:justify-center sm:items-center lg:items-start lg:justify-end">
        {/* Título com drop shadow para destacar */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 leading-tight max-w-3xl drop-shadow-lg lg:text-left sm:text-center">
          {city.heroTitle}
        </h1>

        {/* Subtítulo com máximo contraste */}
        <p className="text-lg sm:text-xl text-white max-w-2xl drop-shadow-md lg:text-left sm:text-center">
          {city.heroSubtitle}
        </p>
      </div>
    </section>
  );
}
