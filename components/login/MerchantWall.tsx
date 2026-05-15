"use client";

import { Store, MapPin, Award, ShieldCheck } from "lucide-react";

export const MerchantWall = () => {
  return (
    <div className="hidden lg:flex flex-col justify-between bg-[#589442] p-12 relative overflow-hidden">
      <div className="relative z-10 flex flex-col">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 w-fit mb-8">
          <span className="text-xl">🌟</span>
          <span className="text-sm font-semibold text-white">
            Plataforma para Lojistas e Profissionais Autônomos
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
          Seu comércio ou serviços em destaque para toda a região
        </h1>

        {/* Description */}
        <p className="text-lg text-white/90 mb-12 leading-relaxed max-w-md">
          Pare de ser invisível. Domine as buscas na sua região e seja a
          primeira escolha dos clientes.
        </p>

        {/* Features */}
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="shrink-0 mt-1">
              <Store size={40} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">
                Sua Loja Sempre Pronta para Vender
              </h3>
              <p className="text-white/80 text-sm">
                Atualize fotos, cardápios e horários em tempo real. Garanta que
                seu cliente encontre informações corretas e consiga te chamar no
                WhatsApp ou traçar a rota pelo Google Maps com apenas um clique.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="shrink-0 mt-1">
              <ShieldCheck size={40} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">
                Perfil Profissional Verificado
              </h3>
              <p className="text-white/80 text-sm">
                Transmita confiança com um selo oficial e mostre que o seu
                negócio é real para quem busca na região.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="shrink-0 mt-1">
              <MapPin size={40} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">
                Sua Marca Onde o Cliente Procura
              </h3>
              <p className="text-white/80 text-sm">
                Não perca mais vendas por não ser encontrado. Apareça no topo
                das buscas exatamente no momento em que os clientes da sua
                cidade decidem o que comprar ou quem contratar.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="shrink-0 mt-1">
              <Award size={40} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">
                Parceria que Gera Resultados
              </h3>
              <p className="text-white/80 text-sm">
                Você não está sozinho. Conte com o suporte direto da nossa
                equipe para otimizar seu perfil, tirar dúvidas e aplicar as
                melhores estratégias para o seu negócio crescer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
