# Estrutura de Rotas e Componentes - Portal de Comércios Locais

## 🎯 Visão Geral

Este documento descreve a arquitetura data-driven implementada para o portal de comércios locais multi-cidades, utilizando Next.js 16+, Tailwind CSS e Lucide React.

---

## 📁 Estrutura de Pastas

```
portal/
├── app/
│   ├── page.tsx                    # Home Global (/)
│   ├── [state]/
│   │   └── [city]/
│   │       ├── page.tsx            # Home da Cidade (/{state}/{city})
│   │       └── [category]/
│   │           └── page.tsx        # Listagem por Categoria (/{state}/{city}/{category})
│   ├── [uf]/                       # Estrutura antiga (mantida para compatibilidade)
│   └── layout.tsx
│
├── components/
│   ├── home/                       # Componentes de home e páginas
│   │   ├── GlobalHero.tsx          # Hero da home global
│   │   ├── CitySearch.tsx          # Busca auto-complete de cidades
│   │   ├── FeaturedCities.tsx      # Grid de cidades em destaque
│   │   ├── CityHero.tsx            # Hero customizado da cidade
│   │   ├── CategoryGrid.tsx        # Grid de categorias
│   │   ├── FeaturedMerchants.tsx   # Cards de comércios destaques
│   │   └── CityNotFound.tsx        # Página 404 para cidades
│   │
│   ├── common/
│   │   └── Breadcrumb.tsx          # Navegação por breadcrumb
│   │
│   ├── BusinessCard.tsx            # Card de comércio (existente)
│   ├── Header.tsx                  # Header (existente)
│   ├── Footer.tsx                  # Footer (existente)
│   └── ...                         # Outros componentes
│
└── lib/
    ├── data/
    │   └── cities.ts               # Mock de dados + funções utilitárias
    ├── business-service.ts         # Serviço de negócios (existente)
    └── ...
```

---

## 🗂️ Dados Mock (CITY_CONFIGS)

### Localização: `lib/data/cities.ts`

O arquivo contém um mock que simula a tabela `city_home_configs` do banco de dados:

```typescript
interface CityConfig {
  id: string;
  slug: string; // Identificador único para URLs
  state: string; // UF (ex: "SC")
  name: string; // Nome da cidade
  displayName: string; // Nome formatado para exibição
  heroTitle: string; // Título principal do hero
  heroSubtitle: string; // Subtítulo do hero
  heroImageUrl: string; // URL da imagem de fundo
  description: string; // Descrição breve
  featuredCategories: FeaturedCategory[]; // Categorias principais
  imageUrl: string; // Imagem para grid de cidades
  population?: number; // População (opcional)
  founded?: number; // Ano de fundação (opcional)
}

interface FeaturedCategory {
  id: string;
  name: string;
  icon: CategoryIcon; // Ícone Lucide React
  slug: string; // Identificador para URLs
}
```

### Funções Utilitárias

```typescript
// Encontrar configuração de cidade
findCityConfig(slug: string): CityConfig | undefined

// Obter todos os slugs (para SSG)
getAllCitySlugs(): Array<{ state: string; city: string }>

// Obter cidades em destaque
getFeaturedCities(limit: number = 4): CityConfig[]

// Encontrar categoria por slug
getCategoryBySlug(slug: string): FeaturedCategory | undefined
```

---

## 🛣️ Estrutura de Rotas

### 1. **Home Global** `/`

- **Arquivo**: `app/page.tsx`
- **Componentes**:
  - `GlobalHero`: Banner com CTA e explicação do projeto
  - `CitySearch`: Auto-complete para busca de cidades
  - `FeaturedCities`: Grid de 4 cidades em destaque
- **Características**:
  - Responsivo (mobile-first)
  - Busca com navegação por teclado
  - Sugestões dinâmicas

### 2. **Home da Cidade** `/{state}/{city}`

- **Arquivo**: `app/[state]/[city]/page.tsx`
- **Componentes**:
  - `CityHero`: Hero customizado com imagem e título específicos
  - `CategoryGrid`: Grid de categorias principais (4-8 itens)
  - `FeaturedMerchants`: Cards de comércios em destaque
- **Características**:
  - Geração estática (SSG) com `generateStaticParams()`
  - Metadados dinâmicos
  - Validação de cidade (404 se não encontrada)
  - Reutiliza `BusinessCard` existente

### 3. **Listagem por Categoria** `/{state}/{city}/{category}`

- **Arquivo**: `app/[state]/[city]/[category]/page.tsx`
- **Componentes**:
  - `Breadcrumb`: Navegação (Home > Cidade > Categoria)
  - Grid de `BusinessCard` com filtro de categoria
  - Indicador de resultado ("X comércios encontrados")
- **Características**:
  - SSG com previsão de rotas
  - Validações duplas (cidade + categoria)
  - UX amigável para "sem resultados"

---

## 🎨 Componentes Principais

### `GlobalHero.tsx`

- Hero com gradiente e animação de blobs
- CTA duplo (Explorar / Anuncie sua marca)
- Mobile-first design

### `CitySearch.tsx`

- Auto-complete com Lucide + Tailwind
- Navegação por teclado (↑↓ Enter Esc)
- Busca em tempo real
- Acessibilidade (ARIA labels)

### `FeaturedCities.tsx`

- Grid responsivo (1 col mobile → 4 cols desktop)
- Overlay de informações ao hover
- Badges com UF e população

### `CityHero.tsx`

- Imagem de fundo com overlay
- Título e subtítulo customizados por cidade
- Otimizado para Core Web Vitals (priority image)

### `CategoryGrid.tsx`

- Cards com ícones Lucide
- Hover effects com transições
- Links para página de categoria

### `FeaturedMerchants.tsx`

- Reutiliza `BusinessCard` existente
- Grid responsivo
- Integrado com dados de negócios reais

### `Breadcrumb.tsx`

- Navegação semântica
- Ícone Home
- Links ativos/inativos

### `CityNotFound.tsx`

- Página 404 customizada
- Referências às cidades disponíveis
- CTAs para voltar

---

## 🔗 Fluxo de Dados

```
CITY_CONFIGS (Mock)
    ↓
[findCityConfig] → CityConfig
    ↓
[Página da Cidade] → Renderiza Hero + Categories + Featured Merchants
    ↓
[Clique em Categoria] → Filtra businesses por category
    ↓
[CategoryPage] → Renderiza com Breadcrumb + Grid de BusinessCard
```

---

## ✨ Características Data-Driven

1. **Escalabilidade**: Adicionar nova cidade é tão simples quanto adicionar ao `CITY_CONFIGS`
2. **Reutilização**: Componentes são genéricos e aceitam `CityConfig` como prop
3. **SSG**: Todas as rotas são pré-geradas em build-time
4. **Tipagem**: TypeScript garante consistência de dados
5. **Sem Hardcoding**: Textos, imagens e ícones vêm do mock

---

## 🚀 Como Usar

### Adicionar Nova Cidade

```typescript
// em lib/data/cities.ts
export const CITY_CONFIGS: CityConfig[] = [
  // ... cidades existentes
  {
    id: "novo-local-estado",
    slug: "novo-local",
    state: "XX",
    name: "Novo Local",
    displayName: "Novo Local, XX",
    heroTitle: "Bem-vindo a Novo Local",
    heroSubtitle: "...",
    heroImageUrl: "https://...",
    description: "...",
    featuredCategories: [
      FEATURED_CATEGORIES.gastronomy,
      FEATURED_CATEGORIES.services,
    ],
    imageUrl: "https://...",
    population: 50000,
    founded: 1995,
  },
];
```

### Adicionar Nova Categoria

```typescript
// em lib/data/cities.ts
export const FEATURED_CATEGORIES: Record<string, FeaturedCategory> = {
  // ... categorias existentes
  luxury: {
    id: "luxury",
    name: "Luxo & Premium",
    icon: Crown, // de lucide-react
    slug: "luxo-premium",
  },
};

// Depois use nas cities:
featuredCategories: [FEATURED_CATEGORIES.luxury, ...],
```

---

## 📱 Responsividade

Todos os componentes seguem mobile-first:

- **Mobile**: Stack vertical, texto menor
- **Tablet (sm)**: 2 colunas
- **Desktop (lg)**: 3-4 colunas

---

## 🔄 Próximos Passos (Recomendações)

1. **Integração com BD**: Substituir `CITY_CONFIGS` por API call no momento de build
2. **Filtro de Categoria**: Implementar filtro real por `category_id` da tabela `businesses`
3. **Paginação**: Adicionar paginação na listagem de categorias (se muitos comércios)
4. **Search Avançado**: Expandir `CitySearch` com filtros (categoria, distância, rating)
5. **Favorites**: Salvar comércios favoritos no localStorage/BD
6. **Analytics**: Rastrear cliques e navegação com Vercel Analytics

---

## 📝 Notas Importantes

- **Compatibilidade**: A rota antiga `[uf]/[city]` foi mantida para compatibilidade
- **Performance**: SSG gera rotas estáticas em build-time (rápido)
- **Acessibilidade**: Todos os componentes seguem WCAG 2.1 AA
- **SEO**: Metadados dinâmicos e URLs semânticas
