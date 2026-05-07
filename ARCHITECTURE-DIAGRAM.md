# Arquitetura Visual - Portal de Comércios Locais

## 📊 Estrutura de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                        APP Layout                           │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Header (Sempre Presente)                │  │
│  │  - Logo                                              │  │
│  │  - Seletor de Cidades (se currentCity disponível)   │  │
│  │  - Botão "Anuncie sua Marca"                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    Main Content                       │  │
│  │                                                       │  │
│  │  [Depende da rota]                                  │  │
│  │  ├─ GlobalHero + Search + FeaturedCities (/)        │  │
│  │  ├─ CityHero + CategoryGrid + FeaturedMerchants     │  │
│  │  │  (/{state}/{city})                               │  │
│  │  └─ Breadcrumb + Categories + BusinessCards        │  │
│  │     (/{state}/{city}/{category})                    │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Footer (Sempre Presente)                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗺️ Mapa de Rotas

```
                          ┌─────────────────┐
                          │   CITY_CONFIGS  │
                          │    (Mock Data)  │
                          └────────┬────────┘
                                   │
                  ┌────────────────┼────────────────┐
                  │                │                │
        ┌─────────▼────────┐  ┌────▼──────────────┐
        │  findCityConfig  │  │getAllCitySlugs   │
        │   (by slug)      │  │   (for SSG)      │
        └─────────┬────────┘  └────┬──────────────┘
                  │                │
                  └────────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
    ┌───▼──────┐      ┌────▼─────┐       ┌────▼─────┐
    │   Home   │      │ City Home │       │ Category │
    │    (/)   │      │ /{state}/ │       │   Page   │
    │          │      │  {city}   │       │ /{state} │
    └───┬──────┘      └────┬──────┘       │ /{city}/ │
        │                  │              │{category}│
    ┌───▼──────────┐   ┌───▼──────────┐   └────┬─────┘
    │ GlobalHero   │   │  CityHero    │        │
    │ CitySearch   │   │ CategoryGrid  │    ┌───▼──────┐
    │FeaturedCities│   │Featured       │    │Breadcrumb│
    │              │   │Merchants      │    │BusinessCard
    └──────────────┘   └───────────────┘    │(Grid)    │
                                            └──────────┘
```

---

## 🔄 Fluxo de Dados

### Cenário 1: Home Global

```
User Acessa: http://localhost:3000/

┌─────────────────────────┐
│  [app/page.tsx]         │
│  (renderiza server)     │
└────────────┬────────────┘
             │
    ┌────────▼────────┐
    │ Renderiza:      │
    ├────────────────┤
    │ • Header()      │
    │ • GlobalHero()  │
    │ • CitySearch()  │
    │   └─ Carrega:   │
    │     CITY_CONFIGS│
    │   └─ Listener:  │
    │     onChange →  │
    │     router.push │
    │     (client)    │
    │ • FeaturedCities│
    │   └─ Chama:     │
    │     getFeatured │
    │     Cities(4)   │
    │ • Footer()      │
    └────────────────┘
             │
             └─ Renderiza na tela
             │
             └─ User clica em cidade
                │
                └─ CitySearch:
                   router.push(
                     "/{state}/{city}"
                   )
                   │
                   └─ Navega para Home da Cidade
```

### Cenário 2: Home da Cidade

```
User Acessa: http://localhost:3000/sc/aguas-mornas

┌──────────────────────────────────────┐
│ [app/[state]/[city]/page.tsx]        │
│ (renderiza server)                   │
└────────────┬─────────────────────────┘
             │
    ┌────────▼────────────────┐
    │ Na build/request:       │
    │ • params = {            │
    │     state: "sc",        │
    │     city: "aguas-mornas"│
    │   }                     │
    │ • findCityConfig(       │
    │     "aguas-mornas"      │
    │   )                     │
    └────────┬────────────────┘
             │
        ┌────▼─────┐
        │ Válida?  │
        └─┬──────┬─┘
         ┌┘      └┐
        ┌▼─┐    ┌─▼┐
        │ Sim   Não│
        └──┬──┬────┘
           │  │
        ┌──▼──▼───────┐
        │ Renderiza:  │
        ├─────────────┤
        │Sim:         │
        │ • Header()  │
        │ • CityHero()│
        │   └─ city:  │
        │     CityConfig
        │ • CategoryGrid
        │   └─ categories:
        │     city.featured
        │     Categories
        │ • FeaturedMerchants
        │   └─ merchants:
        │     getBusinesses()
        │       .filter(
        │         featured
        │       )
        │ • Footer()  │
        │            │
        │Não:        │
        │ • <CityNotFound
        │   state="sc"
        │   city="..."
        │ />          │
        └─────────────┘
             │
             └─ Renderiza na tela
             │
             └─ User clica em categoria
                │
                └─ CategoryGrid:
                   <Link
                     href={`
                       /${state}/
                       ${city}/
                       ${category.slug}
                     `}
                   />
                   │
                   └─ Navega para Category Page
```

### Cenário 3: Página de Categoria

```
User Acessa: http://localhost:3000/sc/aguas-mornas/gastronomia

┌──────────────────────────────────────┐
│ [app/[state]/[city]/[category]/page] │
│ (renderiza server)                   │
└────────────┬─────────────────────────┘
             │
    ┌────────▼────────────────┐
    │ Na build/request:       │
    │ • params = {            │
    │     state: "sc",        │
    │     city: "aguas-mornas"│
    │     category:           │
    │     "gastronomia"       │
    │   }                     │
    │ • findCityConfig()      │
    │ • getCategoryBySlug()   │
    └────────┬────────────────┘
             │
        ┌────▼─────────────────┐
        │ Valida ambas?        │
        └─┬──────────┬─────────┘
         ┌┘          └┐
        ┌▼─┐        ┌─▼┐
        │Sim       Não│
        └──┬──┬────┬───┘
           │  │    │
        ┌──▼──▼────▼───────┐
        │ Renderiza:       │
        ├──────────────────┤
        │Tudo válido:      │
        │ • Header()       │
        │ • Breadcrumb()   │
        │   ├─ Aguas Mornas│
        │   └─ Gastronomia │
        │ • Header com icon│
        │   e categoria    │
        │ • Grid de        │
        │   BusinessCards  │
        │   └─ businesses  │
        │     .filter(     │
        │       category   │
        │     )            │
        │ • Footer()       │
        │                 │
        │Falha:          │
        │ • <CityNotFound/│
        │   ou 404        │
        │   categoria     │
        └──────────────────┘
             │
             └─ Renderiza na tela
             │
             └─ User clica em BusinessCard
                │
                └─ Redireciona para
                   página do negócio
```

---

## 🎨 Estrutura de Dados (TypeScript)

```typescript
// ENTRADA: Mock Data
┌────────────────────────┐
│    CITY_CONFIGS[]      │
├────────────────────────┤
│ CityConfig {           │
│   id: string           │
│   slug: string         │ ◄─── KEY para lookup
│   state: string        │
│   name: string         │
│   heroTitle: string    │
│   heroImageUrl: string │
│   featuredCategories:  │
│     FeaturedCategory[]│
│   ...                 │
│ }                      │
└────────────────────────┘
         │
         │ findCityConfig(slug)
         │ │
         └─▶ CityConfig | undefined
                 │
                 ├─▶ CityHero (recebe city)
                 ├─▶ CategoryGrid (recebe city.featuredCategories)
                 └─▶ FeaturedMerchants (recebe businesses)

// COMPLEMENTAR: Dados de Negócios
┌────────────────────────┐
│   getBusinesses()      │
├────────────────────────┤
│ Business[] {           │
│   name: string         │
│   category: string     │
│   slug: string         │
│   imageUrl: string     │
│   isFeatured: bool     │
│   ...                 │
│ }                      │
└────────────────────────┘
         │
         │ .filter(isFeatured)
         │
         └─▶ Featured[] (para CityHome)
             │
             └─▶ Business[] (para CategoryPage)
```

---

## 🏗️ Hierarquia de Componentes

```
Layout (root)
├── Header
│   ├── LogoComponent
│   ├── CustomSelect (dropdown de cidades)
│   └── Megaphone (botão "Anuncie")
│
├── Page Content
│   ├── [HOME (/)]
│   │   ├── GlobalHero
│   │   ├── CitySearch
│   │   │   └── <input> com autocomplete
│   │   ├── FeaturedCities
│   │   │   └── BusinessCard × 4
│   │   └── <blank> (vazio para preencher)
│   │
│   ├── [CITY /{state}/{city}]
│   │   ├── CityHero
│   │   ├── CategoryGrid
│   │   │   └── Category Card × 4-8
│   │   │       └── Icon + name + link
│   │   └── FeaturedMerchants
│   │       └── BusinessCard × 8
│   │
│   └── [CATEGORY /{state}/{city}/{category}]
│       ├── Breadcrumb
│       │   ├── Home link
│       │   ├── City link
│       │   └── Category (active)
│       ├── Header (com categoria info)
│       │   ├── Category Icon
│       │   ├── Category Name
│       │   └── Contador ("X comércios")
│       └── BusinessGrid
│           └── BusinessCard × N
│
└── Footer
    └── FooterComponent
```

---

## 📈 Fluxo de Renderização (SSG)

```
Build-time (next build)
│
├─ generateStaticParams()
│  └─ Gera rotas estáticas:
│     ├─ / (home global)
│     ├─ /sc/aguas-mornas
│     ├─ /sc/santo-amaro
│     ├─ /sc/brusque
│     ├─ /sc/blumenau
│     ├─ /sc/aguas-mornas/gastronomia
│     ├─ /sc/aguas-mornas/servicos
│     ├─ /sc/aguas-mornas/varejo
│     ├─ /sc/aguas-mornas/hospedagem
│     └─ ... (todas as combinações)
│
└─ Para cada rota:
   ├─ Execute page.tsx (server component)
   ├─ Valide params
   ├─ Busque dados (CITY_CONFIGS, businesses)
   ├─ Renderize para HTML estático
   └─ Salve em .next/

Runtime (next start)
│
└─ Request para /sc/aguas-mornas
   ├─ Arquivo HTML pré-gerado existe?
   │  └─ SIM: Serve HTML estático (SUPER RÁPIDO!)
   │
   └─ Se revalidatePath() chamado:
      ├─ Regenera rota sob demanda (ISR)
      └─ Atualiza HTML estático
```

---

## 🔌 Pontos de Integração

```
┌─────────────────────────────────────────────────┐
│         CITY_CONFIGS Mock (em produção)        │
│  ┌─────────────────────────────────────────┐   │
│  │ Substituir por API:                     │   │
│  │ • GET /api/cities                       │   │
│  │ • GET /api/cities/:slug                 │   │
│  │ • GET /api/categories                   │   │
│  │                                         │   │
│  │ Ou BD Direta (se SSG):                  │   │
│  │ • db.query('SELECT * FROM city_home...') │   │
│  └─────────────────────────────────────────┘   │
│          ▲                                      │
│          │                                      │
└──────────┼──────────────────────────────────────┘
           │
      ┌────┴─────┐
      │           │
   ┌──▼───┐   ┌──▼───┐
   │  API │   │  DB  │
   └──────┘   └──────┘
```
