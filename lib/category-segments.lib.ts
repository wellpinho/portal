import { ProfileCategory } from "./profile-category.lib";

export const CategorySegments: Record<ProfileCategory, string[]> = {
  [ProfileCategory.GASTRONOMIA]: [
    "Doces e Salgados",
    "Bar e Choperia",
    "Restaurante",
    "Lanchonete",
    "Sorveteria",
    "Cafeteria",
    "Pizzaria",
    "Padaria",
  ],
  [ProfileCategory.SERVICOS_AUTOMOTIVOS]: [
    "Oficina Mecanica",
    "Autoeletrica",
    "Lava-jato",
    "Borracharia",
    "Pecas",
  ],
  [ProfileCategory.CASA_CONSTRUCAO]: [
    "Material de Construcao",
    "Marcenaria",
    "Mao de Obra (Pedreiro)",
    "Eletrica e Hidraulica",
    "Pintura",
    "Arquitetura e Projetos",
  ],
  [ProfileCategory.AGRO_COLONIAIS]: [
    "Produtos Coloniais",
    "Agropecuaria",
    "Veterinaria",
    "Hortifruti",
  ],
  [ProfileCategory.SAUDE_BELEZA]: [
    "Farmacia",
    "Salao de Beleza",
    "Academia",
    "Dentista",
    "Estetica",
  ],
  [ProfileCategory.COMERCIO_VAREJO]: [
    "Moda",
    "Calcados",
    "Supermercado",
    "Papelaria",
    "Eletronicos",
  ],
  [ProfileCategory.SERVICOS_PROFISSIONAIS]: [
    // Profissionais Liberais
    "Contabilidade",
    "Advocacia",
    "Consultoria e Assessoria",
    "Fotografia e Filmagens",

    // Cuidados e Bem-estar (Autónomos)
    "Cuidador de Idosos",
    "Babás / Dog Walker",
    "Personal Trainer",

    // Manutenção e Serviços Gerais (A força da cidade)
    "Marido de Aluguer (Reparos)",
    "Montador de Móveis",
    "Limpeza Residencial / Diarista",
    "Piscineiro",
    "Jardinagem",
    "Fretes e Mudanças",

    // Tecnologia e Eventos
    "Informática e Suporte",
    "Organização de Eventos / Buffet",
    "Design e Marketing",

    // Outros
    "Costura e Reformas",
    "Aulas Particulares / Reforço",
  ],
  [ProfileCategory.TURISMO_LAZER]: [
    "Pousada",
    "Hotel",
    "Parque Termal",
    "Eventos",
  ],
  [ProfileCategory.IMOBILIARIA_LAR]: [
    "Corretor de Imoveis",
    "Imobiliaria",
    "Aluguel de Temporada",
    "Jardinagem e Paisagismo",
    "Limpeza e Conservacao",
    "Seguranca Residencial",
  ],
};
