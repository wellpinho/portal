export interface Bairro {
  id: number;
  name: string;
  slug: string;
}

export interface CidadeConfig {
  id: number;
  name: string;
  slug: string;
  bairros: Bairro[];
}

export const REGISTERED_CITIES: Record<string, CidadeConfig> = {
  "aguas-mornas": {
    id: 1,
    name: "Águas Mornas",
    slug: "aguas-mornas",
    bairros: [
      { id: 1, name: "Centro", slug: "centro-aguas-mornas-sc" },
      { id: 2, name: "Vila Nova", slug: "vila-nova-aguas-mornas-sc" },
      {
        id: 3,
        name: "Vargem Grande",
        slug: "vargem-grande-aguas-mornas-sc",
      },
      {
        id: 4,
        name: "Santa Cruz da Figueira",
        slug: "santa-cruz-da-figueira-aguas-mornas-sc",
      },
      {
        id: 5,
        name: "Fazenda do Sacramento",
        slug: "fazenda-do-sacramento-aguas-mornas-sc",
      },
      {
        id: 6,
        name: "Fazenda da Ressurreição",
        slug: "fazenda-da-ressurreicao-aguas-mornas-sc",
      },
      {
        id: 7,
        name: "Área Rural",
        slug: "area-rural-aguas-mornas-sc",
      },
      // Adicione os outros bairros da cidade aqui de forma estática
    ],
  },
};
