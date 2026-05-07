import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";

interface CityNotFoundProps {
  state: string;
  city: string;
}

export default function CityNotFound({ state, city }: CityNotFoundProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-stone-900 mb-2">
          Cidade Não Encontrada
        </h1>

        {/* Description */}
        <p className="text-stone-600 mb-8">
          Desculpe, não encontramos a cidade <strong>{city}</strong> no estado
          de <strong>{state.toUpperCase()}</strong>.
        </p>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
          <p className="text-sm text-blue-900">
            Cidades disponíveis: Águas Mornas, Santo Amaro, Brusque e Blumenau
            (SC).
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors w-full justify-center mb-3"
        >
          <Home className="w-4 h-4" />
          Voltar para Home
        </Link>

        <Link
          href="/"
          className="block text-emerald-600 hover:text-emerald-700 font-semibold text-sm"
        >
          Explorar todas as cidades
        </Link>
      </div>
    </div>
  );
}
