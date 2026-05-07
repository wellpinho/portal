# 🌍 Exemplo: Expansão para Outras Regiões

## Como escalar de 4 para N cidades

### Passo 1: Estrutura de Dados

```typescript
// lib/data/cities.ts

// Adicione quantas cidades quiser
export const CITY_CONFIGS: CityConfig[] = [
  // ✅ Existentes
  {
    id: "aguas-mornas-sc",
    slug: "aguas-mornas",
    state: "SC",
    name: "Águas Mornas",
    // ...
  },

  // 🆕 NOVAS CIDADES - Copie este template:

  {
    id: "florianopolis-sc",
    slug: "florianopolis",
    state: "SC",
    name: "Florianópolis",
    displayName: "Florianópolis, SC",
    heroTitle: "Comércios Locais de Florianópolis",
    heroSubtitle: "A capital do turismo e comércio catarinense",
    heroImageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=500&fit=crop",
    description:
      "Florianópolis é a capital de Santa Catarina, conhecida por suas praias, gastronomia e negócios diversificados.",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop",
    featuredCategories: [
      FEATURED_CATEGORIES.gastronomy,
      FEATURED_CATEGORIES.accommodation,
      FEATURED_CATEGORIES.wellness,
      FEATURED_CATEGORIES.photography,
    ],
    population: 500000,
    founded: 1750,
  },

  {
    id: "sao-paulo-sp",
    slug: "sao-paulo",
    state: "SP",
    name: "São Paulo",
    displayName: "São Paulo, SP",
    heroTitle: "Comércios Locais de São Paulo",
    heroSubtitle: "A maior metrópole e maior economia do Brasil",
    heroImageUrl:
      "https://images.unsplash.com/photo-1514208286974-6c03bf1e7dba?w=1200&h=500&fit=crop",
    description:
      "São Paulo é o maior centro econômico do Brasil, com inúmeras oportunidades de negócios locais.",
    imageUrl:
      "https://images.unsplash.com/photo-1514208286974-6c03bf1e7dba?w=500&h=300&fit=crop",
    featuredCategories: [
      FEATURED_CATEGORIES.gastronomy,
      FEATURED_CATEGORIES.retail,
      FEATURED_CATEGORIES.services,
      FEATURED_CATEGORIES.education,
    ],
    population: 12000000,
    founded: 1554,
  },

  {
    id: "rio-de-janeiro-rj",
    slug: "rio-de-janeiro",
    state: "RJ",
    name: "Rio de Janeiro",
    displayName: "Rio de Janeiro, RJ",
    heroTitle: "Comércios Locais do Rio de Janeiro",
    heroSubtitle: "Maravilha do mundo com negócios que encantam",
    heroImageUrl:
      "https://images.unsplash.com/photo-1483389127117-b6a2102724ae?w=1200&h=500&fit=crop",
    description:
      "Rio de Janeiro combina beleza natural, turismo e uma vibrante cena de negócios locais.",
    imageUrl:
      "https://images.unsplash.com/photo-1483389127117-b6a2102724ae?w=500&h=300&fit=crop",
    featuredCategories: [
      FEATURED_CATEGORIES.gastronomy,
      FEATURED_CATEGORIES.accommodation,
      FEATURED_CATEGORIES.services,
      FEATURED_CATEGORIES.photography,
    ],
    population: 7000000,
    founded: 1565,
  },

  {
    id: "belo-horizonte-mg",
    slug: "belo-horizonte",
    state: "MG",
    name: "Belo Horizonte",
    displayName: "Belo Horizonte, MG",
    heroTitle: "Comércios Locais de Belo Horizonte",
    heroSubtitle: "A capital das invenções e da culinária mineira",
    heroImageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1200&h=500&fit=crop",
    description:
      "Belo Horizonte é conhecida por sua gastronomia única, arte e economia vibrante.",
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=300&fit=crop",
    featuredCategories: [
      FEATURED_CATEGORIES.gastronomy,
      FEATURED_CATEGORIES.wellness,
      FEATURED_CATEGORIES.education,
      FEATURED_CATEGORIES.services,
    ],
    population: 2500000,
    founded: 1897,
  },

  {
    id: "salvador-ba",
    slug: "salvador",
    state: "BA",
    name: "Salvador",
    displayName: "Salvador, BA",
    heroTitle: "Comércios Locais de Salvador",
    heroSubtitle: "Primeira capital do Brasil com cultura e tradição",
    heroImageUrl:
      "https://images.unsplash.com/photo-1552867009-6c88db4c5e61?w=1200&h=500&fit=crop",
    description:
      "Salvador é uma das cidades mais antigas do Brasil, rica em cultura, história e comércio local.",
    imageUrl:
      "https://images.unsplash.com/photo-1552867009-6c88db4c5e61?w=500&h=300&fit=crop",
    featuredCategories: [
      FEATURED_CATEGORIES.gastronomy,
      FEATURED_CATEGORIES.accommodation,
      FEATURED_CATEGORIES.photography,
      FEATURED_CATEGORIES.fitness,
    ],
    population: 2700000,
    founded: 1549,
  },
];
```

---

## Resultado da Expansão

### Rotas Geradas Automaticamente

Depois de executar `npm run build`, você terá:

```
✅ /sp/sao-paulo
✅ /sp/sao-paulo/gastronomia
✅ /sp/sao-paulo/varejo
✅ /sp/sao-paulo/servicos
✅ /sp/sao-paulo/educacao

✅ /rj/rio-de-janeiro
✅ /rj/rio-de-janeiro/gastronomia
✅ /rj/rio-de-janeiro/hospedagem
✅ /rj/rio-de-janeiro/servicos
✅ /rj/rio-de-janeiro/fotografia

✅ /mg/belo-horizonte
✅ /mg/belo-horizonte/gastronomia
✅ /mg/belo-horizonte/bem-estar
✅ /mg/belo-horizonte/educacao
✅ /mg/belo-horizonte/servicos

✅ /ba/salvador
✅ /ba/salvador/gastronomia
✅ /ba/salvador/hospedagem
✅ /ba/salvador/fotografia
✅ /ba/salvador/fitness

... E MAIS! (todas as combinações)
```

---

## 🔍 Checklist para Adicionar Nova Cidade

- [ ] **ID Único**: `"cidade-uf-codigo"`
- [ ] **Slug URL-Friendly**: `"cidade"` (sem espaços, acentos, hífen ok)
- [ ] **State Code**: `"XX"` (2 letras maiúsculas)
- [ ] **Display Name**: `"Cidade, XX"` (com estado)
- [ ] **Hero Title**: Título inspirador
- [ ] **Hero Subtitle**: Subtítulo descritivo
- [ ] **Hero Image**: URL HTTPS 1200x500px
- [ ] **Card Image**: URL HTTPS 500x300px
- [ ] **Description**: Descrição de 1-2 linhas
- [ ] **Categories**: Mínimo 3, máximo 8
- [ ] **Population**: Número (opcional)
- [ ] **Founded**: Ano (opcional)

---

## 📊 Estatísticas da Expansão

### Com 4 Cidades × 4 Categorias = 20 Rotas

```
HOME: 1 rota
CITIES: 4 rotas
CATEGORIES: 4 × 4 = 16 rotas
TOTAL: 21 rotas estáticas
```

### Com 20 Cidades × 8 Categorias = 180 Rotas

```
HOME: 1 rota
CITIES: 20 rotas
CATEGORIES: 20 × 8 = 160 rotas
TOTAL: 181 rotas estáticas
```

✅ **Todas pré-geradas em build-time (SSG)**
✅ **Sem impacto de performance em runtime**
✅ **Cache do CDN automático**

---

## 🎯 Estratégia de Rollout

### Fase 1: MVP (Atual)

- 4 cidades (SC)
- 8 categorias
- 21 rotas

### Fase 2: Expansão Regional

- +8 cidades (SC, SP, RJ, MG, BA)
- +10 categorias
- 100+ rotas

### Fase 3: Escala Nacional

- 100+ cidades (Brasil inteiro)
- 15+ categorias
- 1500+ rotas

### Fase 4: Integração com Database

```typescript
// Em vez de CITY_CONFIGS estático
export async function getCitiesFromDB() {
  const cities = await db.query(`
    SELECT * FROM city_home_configs
    WHERE is_active = true
    ORDER BY featured DESC
  `);
  return cities;
}

// Em app/[state]/[city]/page.tsx
const cities = await getCitiesFromDB();
const cityConfig = cities.find((c) => c.slug === city);
```

---

## 📈 Crescimento Esperado

| Métrica         | Fase 1 | Fase 2  | Fase 3 |
| --------------- | ------ | ------- | ------ |
| Cidades         | 4      | 12      | 100+   |
| Categorias      | 8      | 12      | 15     |
| Rotas Estáticas | 21     | 100+    | 1500+  |
| Negócios        | 100s   | 1000s   | 10000s |
| Tempo Build     | <1min  | 5-10min | 30min  |
| Tamanho Bundle  | ~500KB | ~800KB  | ~1.5MB |

---

## 🚀 Deployment Strategy

### Local Testing

```bash
npm run dev
# http://localhost:3000/sp/sao-paulo
```

### Build & Deploy

```bash
npm run build
# Gera .next/cache com 180+ rotas em ~2-5 min

npm run start
# Serve HTML pré-gerado com NGinx/Vercel
```

### ISR (Incremental Static Regeneration)

```typescript
// Se dados mudarem frequentemente:
export const revalidate = 3600; // Revalidar a cada 1 hora

// Ou sob demanda:
import { revalidatePath } from "next/cache";

export async function updateCity(city: CityConfig) {
  // Update DB...

  revalidatePath(`/${city.state.toLowerCase()}/${city.slug}`);
  revalidatePath("/"); // Revalidar home
}
```

---

## 💡 Tips para Escalabilidade

1. **Use slug único**: Não confunda `aguas-mornas` com `aguasmornas`
2. **Organize categorias**: Reutilize `FEATURED_CATEGORIES` em todas as cidades
3. **Imagens consistentes**: Maintain aspect ratio 1200x500 para hero
4. **Dados limpeza**: Remove cidades inativas do mock
5. **Monitoring**: Track build time conforme crescer

---

## 🔌 Próxima Integração

Quando pronto para database:

```typescript
// lib/data/cities.ts

export async function generateStaticParams() {
  const cities = await getCitiesFromDB();
  return cities.map((city) => ({
    state: city.state.toLowerCase(),
    city: city.slug,
  }));
}

export async function getCityConfigFromDB(slug: string) {
  return await db.query("SELECT * FROM city_home_configs WHERE slug = $1", [
    slug,
  ]);
}
```

---

## 📞 Troubleshooting Escalabilidade

### Build está lento?

- Reduz imagens (use Cloudinary)
- Ativa ISR em vez de full SSG
- Usa cache layering no build

### Bundle está grande?

- Tree-shake imports não usados
- Lazy load componentes pesados
- Use dynamic imports

### Database queries lentas?

- Adicione índices em `slug` e `state`
- Cache em Redis
- Use CDN para imagens

---

Aproveite a escalabilidade! 🚀
