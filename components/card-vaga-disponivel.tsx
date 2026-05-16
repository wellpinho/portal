import Image from "next/image";

export default function CardVagaDisponivel({ cityName }: { cityName: string }) {
  const numeroWhatsapp = "5548988531990";
  const mensagem =
    "Olá! Gostaria de saber mais sobre como destacar minha empresa na página inicial do Comércios Locais.";

  // Usando o encodeURIComponent para formatar o texto para URL de forma segura
  const linkWhats = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`;
  return (
    <div className="relative border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-xl p-4 flex flex-col items-center justify-center min-h-[280px] group hover:border-emerald-500 hover:bg-emerald-50/30 transition-all duration-300">
      {/* Ícone de Loja opaco no fundo */}
      <div className="opacity-20 group-hover:opacity-40 transition-opacity mb-4">
        <Image
          src="/placeholder.png"
          alt="Espaço disponível"
          width={400}
          height={64}
        />
      </div>

      <span className="text-xs font-semibold text-gray-400 bg-gray-200/60 px-2 py-1 rounded-md uppercase tracking-wider group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
        Vaga Disponível
      </span>

      <p className="text-xs text-gray-400 text-center mt-2 px-4 group-hover:text-emerald-800">
        Destaque sua marca na página principal de {cityName} e alcance milhares
        de clientes locais todos os dias.
      </p>

      {/* Botão flutuante ou de ação rápida */}
      <a
        href={linkWhats}
        target="_blank"
        className="mt-4 text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
      >
        Garantir meu espaço →
      </a>
    </div>
  );
}
