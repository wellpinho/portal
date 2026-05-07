# Exemplos de Uso - Portal de Comércios Locais

## 🌐 URLs Disponíveis

### Home Global

```
http://localhost:3000/
```

Mostra todas as cidades em destaque com busca global.

### Home da Cidade

```
http://localhost:3000/sc/aguas-mornas
http://localhost:3000/sc/santo-amaro
http://localhost:3000/sc/brusque
http://localhost:3000/sc/blumenau
```

Mostra hero customizado, categorias principais e comércios em destaque.

### Listagem por Categoria

```
http://localhost:3000/sc/aguas-mornas/gastronomia
http://localhost:3000/sc/aguas-mornas/servicos
http://localhost:3000/sc/santo-amaro/bem-estar
http://localhost:3000/sc/brusque/varejo
```

Mostra breadcrumb, categorias com ícone e lista de comércios.

---

## 🎨 Componentes & Props

### GlobalHero

```typescript
// Uso automático na página home
<GlobalHero />

// Props: nenhuma (usa styles internos)
```

### CitySearch

```typescript
// Uso automático na página home
<CitySearch />

// Props: nenhuma
// Funcionalidades:
// - Auto-complete em tempo real
// - Navegação por teclado
// - Redireciona para /{state}/{city}
```

### FeaturedCities

```typescript
// Uso automático na página home
<FeaturedCities />

// Props: nenhuma
// Mostra 4 primeiras cidades do CITY_CONFIGS
```

### CityHero

```typescript
<CityHero city={cityConfig} />

// Props:
// - city: CityConfig
//   {
//     heroTitle: "Bem-vindo...",
//     heroImageUrl: "https://...",
//     ...
//   }
```

### CategoryGrid

```typescript
<CategoryGrid
  categories={cityConfig.featuredCategories}
  state={state}
  city={city}
/>

// Props:
// - categories: FeaturedCategory[]
// - state: string (ex: "SC")
// - city: string (ex: "aguas-mornas")
//
// Renderiza grid com ícones e links
```

### FeaturedMerchants

```typescript
<FeaturedMerchants
  merchants={businesses}
  cityName={city.name}
/>

// Props:
// - merchants: Business[] (do serviço getBusinessesByLocation)
// - cityName: string
//
// Reutiliza BusinessCard para cada comércio
```

### Breadcrumb

```typescript
<Breadcrumb
  items={[
    { label: "Aguas Mornas", href: "/sc/aguas-mornas" },
    { label: "Gastronomia", active: true },
  ]}
/>

// Props:
// - items: BreadcrumbItem[]
//   { label: string, href?: string, active?: boolean }
// - className?: string (opcional)
```

---

## 📊 Fluxo de Dados Detalhado

### Página Home Global (/)

```
[app/page.tsx]
  ↓
  ├─ <Header /> (sem cidade selecionada)
  ├─ <GlobalHero />
  │   └─ Mostra: "Apoie o Comércio Local"
  ├─ <CitySearch />
  │   ├─ Busca em CITY_CONFIGS
  │   └─ Ao selecionar → router.push("/{state}/{city}")
  ├─ <FeaturedCities />
  │   ├─ Chama getFeaturedCities(4)
  │   └─ Mostra: Cards de cidades
  └─ <FooterComponent />
```

### Página da Cidade (/sc/aguas-mornas)

```
[app/[state]/[city]/page.tsx]
  ↓
  ├─ params = { state: "sc", city: "aguas-mornas" }
  ├─ cityConfig = findCityConfig("aguas-mornas") ✓
  │   {
  │     slug: "aguas-mornas",
  │     heroTitle: "Bem-vindo...",
  │     featuredCategories: [gastronomia, serviços, ...],
  │     ...
  │   }
  ├─ [Se cityConfig não existir → <CityNotFound />]
  │
  ├─ <Header currentCity={...} />
  ├─ <CityHero city={cityConfig} />
  │   └─ Mostra: Imagem + título + subtítulo customizados
  ├─ <CategoryGrid categories={...} state={...} city={...} />
  │   └─ Mostra: 4 cards com categorias
  │       Ao clicar → /sc/aguas-mornas/{category}
  ├─ <FeaturedMerchants merchants={...} cityName={...} />
  │   └─ Mostra: Cards de comércios em destaque
  └─ <FooterComponent />
```

### Página de Categoria (/sc/aguas-mornas/gastronomia)

```
[app/[state]/[city]/[category]/page.tsx]
  ↓
  ├─ params = { state: "sc", city: "aguas-mornas", category: "gastronomia" }
  ├─ cityConfig = findCityConfig("aguas-mornas") ✓
  ├─ categoryConfig = getCategoryBySlug("gastronomia") ✓
  │
  ├─ [Se falhar → <CityNotFound /> ou categoria 404]
  │
  ├─ <Header />
  ├─ <Breadcrumb items={[...]} />
  │   └─ "Home > Aguas Mornas > Gastronomia"
  ├─ businesses = getBusinessesByLocation("SC", "aguas-mornas")
  │   .filter(b => b.category.toLowerCase().includes("gastronomia"))
  │
  ├─ Grid de <BusinessCard /> para cada business
  │   └─ Mostra: Imagem, nome, avaliação, localização, etc.
  │
  └─ <FooterComponent />
```

---

## 🔍 Exemplos de Mock Data

### Cidade Completa

```typescript
{
  id: "aguas-mornas-sc",
  slug: "aguas-mornas",
  state: "SC",
  name: "Águas Mornas",
  displayName: "Águas Mornas, SC",
  heroTitle: "Bem-vindo aos Comércios Locais de Águas Mornas",
  heroSubtitle: "Apoie o comércio local e descubra os melhores negócios da sua região",
  heroImageUrl: "https://images.unsplash.com/photo-1511306228054-480b3b290ffa...",
  description: "Águas Mornas é um município acolhedor...",
  imageUrl: "https://images.unsplash.com/photo-1511306228054-480b3b290ffa...",
  featuredCategories: [
    {
      id: "gastronomy",
      name: "Gastronomia",
      icon: UtensilsCrossed, // lucide-react
      slug: "gastronomia",
    },
    {
      id: "services",
      name: "Serviços",
      icon: Wrench,
      slug: "servicos",
    },
    {
      id: "retail",
      name: "Varejo",
      icon: ShoppingBag,
      slug: "varejo",
    },
    {
      id: "accommodation",
      name: "Hospedagem",
      icon: Home,
      slug: "hospedagem",
    },
  ],
  population: 8500,
  founded: 1852,
}
```

---

## 🧪 Testando Localmente

### 1. Desenvolver Home Global

```bash
npm run dev
# Acesse: http://localhost:3000/
# Teste: Busca de cidades, cards de destaque
```

### 2. Testar Home da Cidade

```bash
# Acesse: http://localhost:3000/sc/aguas-mornas
# Teste: Hero, categorias, comércios em destaque
```

### 3. Testar Página de Categoria

```bash
# Acesse: http://localhost:3000/sc/aguas-mornas/gastronomia
# Teste: Breadcrumb, listagem de comércios
```

### 4. Testar 404

```bash
# Acesse: http://localhost:3000/sc/cidade-inexistente
# Deve mostrar: CityNotFound component
```

---

## 🔌 Integrando com Database Real

### Passo 1: Substituir Mock

```typescript
// lib/data/cities.ts

export async function getCitiesFromDB(): Promise<CityConfig[]> {
  const response = await fetch(`${process.env.API_URL}/api/cities`);
  return response.json();
}

// Em app/[state]/[city]/page.tsx
const cityConfig = await findCityConfigFromDB(city);
```

### Passo 2: Usar Variáveis de Ambiente

```bash
# .env.local
API_URL=http://localhost:3001
DATABASE_URL=postgres://...
```

### Passo 3: Validar em Build-time

```typescript
// Se usar revalidatePath() após criar cidade no admin
export const revalidate = 3600; // Revalidar a cada 1 hora
```

---

## 💡 Dicas & Boas Práticas

1. **Lazy Load Images**: Já está implementado com `priority={false}`
2. **Otimizar Bundle**: Todos os ícones vêm de Lucide (tree-shakeable)
3. **Acessibilidade**: Use `aria-label` e `role` em elementos interativos
4. **Validação**: Sempre valide params em Server Components
5. **Cache**: Use SSG para rotas estáticas, ISR para híbridas
