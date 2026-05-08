import { Sparkles } from "lucide-react";

export default function GlobalHero() {
  return (
    <section className="relative py-16 sm:py-24 lg:py-32 bg-linear-to-br from-emerald-50 via-white to-green-50 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -right-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-8 left-20 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>Bem-vindo ao Marketplace de Proximidade</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 mb-6 leading-tight">
            Apoie o{" "}
            <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Comércio Local
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-stone-600 mb-8 max-w-2xl mx-auto">
            Descubra os melhores comércios, serviços e produtos de sua região.
            Conecte-se com negócios locais e fortaleça sua comunidade.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl">
              Explorar Cidades
            </button>
            <button className="px-8 py-3 border-2 border-stone-300 text-stone-900 font-semibold rounded-lg hover:border-emerald-600 hover:text-emerald-600 transition-colors">
              Anuncie sua Marca
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
