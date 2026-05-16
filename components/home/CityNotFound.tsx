import Link from "next/link";
import { Home, MapPinPlus } from "lucide-react";
import { formatSlugToCityName } from "@/utils/formate-params.utils";

interface CityNotFoundProps {
  state: string;
  city: string;
}

export default function CityNotFound({ city }: CityNotFoundProps) {
  return (
    <div className="bg-linear-to-br from-stone-50 to-stone-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="mx-auto w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <MapPinPlus className="w-12 h-12 text-emerald-700" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-stone-700 mb-2">
          O Comércios Locais está chegando a {formatSlugToCityName(city)}!
        </h1>

        {/* Description */}
        <p className="text-stone-600 mb-8">
          Ainda não pousamos por aqui, mas estamos expandindo rápido. Que tal
          ver os comércios das cidades vizinhas enquanto nos preparamos?
        </p>

        {/* CTA */}
        <Link
          href="/sc/santo-amaro-da-imperatriz"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors w-full justify-center mb-3"
        >
          Comércios de Santo Amaro da Imperatriz
        </Link>

        <Link
          href="/sc/aguas-mornas"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors w-full justify-center mb-3"
        >
          Comércios de Águas Mornas
        </Link>
      </div>
    </div>
  );
}
