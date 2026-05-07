# 🚀 Guia de Customização & Escalabilidade

## 1️⃣ Adicionar Nova Cidade

### Passo 1: Adicionar ao CITY_CONFIGS

```typescript
// lib/data/cities.ts

export const CITY_CONFIGS: CityConfig[] = [
  // ... cidades existentes

  {
    id: "sua-cidade-uf",
    slug: "sua-cidade", // ⚠️ Deve ser URL-friendly (sem espaços)
    state: "XX", // Estado (2 letras em CAPS)
    name: "Sua Cidade", // Nome natural
    displayName: "Sua Cidade, XX", // Nome com estado
    heroTitle: "Bem-vindo ao Comércio Local de Sua Cidade",
    heroSubtitle: "Apoie negócios locais e fortaleça sua comunidade",
    heroImageUrl: "https://images.unsplash.com/...", // Imagem 1200x500px
    description: "Descrição breve da cidade e sua importância",
    imageUrl: "https://images.unsplash.com/...", // Imagem 500x300px
    featuredCategories: [
      FEATURED_CATEGORIES.gastronomy,
      FEATURED_CATEGORIES.services,
      FEATURED_CATEGORIES.retail,
      FEATURED_CATEGORIES.accommodation,
    ],
    population: 50000, // (opcional)
    founded: 1950, // (opcional)
  },
];
```

### Passo 2: Executar Build

```bash
npm run build
```

A rota `/xx/sua-cidade` será pré-gerada automaticamente!

---

## 2️⃣ Adicionar Nova Categoria

### Passo 1: Adicionar Ícone Lucide

```typescript
// lib/data/cities.ts

import {
  UtensilsCrossed,
  // ... outros ícones
  Sparkles, // Novo ícone para categoria nova
} from "lucide-react";
```

### Passo 2: Registrar no FEATURED_CATEGORIES

```typescript
export const FEATURED_CATEGORIES: Record<string, FeaturedCategory> = {
  // ... categorias existentes

  beauty: {
    id: "beauty",
    name: "Beleza & Estética",
    icon: Sparkles,
    slug: "beleza-estetica",
  },
};
```

### Passo 3: Usar em Cidades

```typescript
// Adicionar a qualquer cidade
featuredCategories: [
  FEATURED_CATEGORIES.gastronomy,
  FEATURED_CATEGORIES.beauty,  // ← Nova categoria
  FEATURED_CATEGORIES.services,
],
```

### Resultado

- URL: `/sc/aguas-mornas/beleza-estetica`
- Card com ícone Sparkles
- Listagem de comércios com categoria "Beleza"

---

## 3️⃣ Customizar Cores e Tema

### Opção 1: Tailwind Config

```typescript
// tailwind.config.ts

export default {
  theme: {
    extend: {
      colors: {
        primary: "#059669", // Emerald
        secondary: "#10b981",
        accent: "#fbbf24", // Âmbar
      },
    },
  },
};
```

### Opção 2: CSS Variables

```css
/* app/globals.css */

:root {
  --color-primary: #059669;
  --color-secondary: #10b981;
  --color-accent: #fbbf24;
}
```

Depois usar:

```tsx
<button className="bg-[var(--color-primary)]">Botão Customizado</button>
```

---

## 4️⃣ Personalizar Hero Global

### Editar GlobalHero.tsx

```typescript
// components/home/GlobalHero.tsx

export default function GlobalHero() {
  return (
    <section className="relative py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* ... seu conteúdo */}

      <h1 className="text-5xl font-bold text-blue-900">
        Seu Título Aqui
      </h1>
    </section>
  );
}
```

### Resultado

- Hero com cores diferentes
- Animação customizada
- Pode ser A/B testado

---

## 5️⃣ Escalar com Database

### Passo 1: Criar tipos/interfaces

```typescript
// lib/types/city.ts

export interface CityFromDB extends CityConfig {
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
```

### Passo 2: Criar função de fetch

```typescript
// lib/data/cities.ts

export async function getCitiesFromDB(): Promise<CityConfig[]> {
  const response = await fetch(
    `${process.env.API_URL}/api/cities`,
    { next: { revalidate: 3600 } }, // Cache 1 hora
  );

  if (!response.ok) {
    throw new Error("Failed to fetch cities");
  }

  return response.json();
}

// Usar em páginas:
const cities = await getCitiesFromDB();
const city = cities.find((c) => c.slug === slug);
```

### Passo 3: Update build

```bash
# .env
API_URL=https://api.seu-dominio.com
```

---

## 6️⃣ Adicionar Analytics

### Passo 1: Instalar library

```bash
npm install @vercel/analytics
```

### Passo 2: Setup no layout

```typescript
// app/layout.tsx

import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Passo 3: Custom events

```typescript
// components/home/CategoryGrid.tsx

"use client";

import { trackEvent } from "@vercel/analytics";

export default function CategoryGrid() {
  const handleCategoryClick = (categoryName: string) => {
    trackEvent("category_clicked", {
      category: categoryName,
      city: "aguas-mornas",
    });
  };

  return (
    <button onClick={() => handleCategoryClick("Gastronomia")}>
      Gastronomia
    </button>
  );
}
```

---

## 7️⃣ Implementar SEO Avançado

### Schema Markup para Cidades

```typescript
// app/[state]/[city]/page.tsx

export async function generateMetadata({ params }: CityPageProps) {
  const { state, city } = await params;
  const cityConfig = findCityConfig(city);

  return {
    title: `${cityConfig.displayName} - Comércios Locais`,
    description: cityConfig.description,
    openGraph: {
      title: cityConfig.displayName,
      description: cityConfig.description,
      images: [
        {
          url: cityConfig.heroImageUrl,
          width: 1200,
          height: 600,
        },
      ],
    },

    // JSON-LD Schema
    other: {
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: cityConfig.displayName,
        description: cityConfig.description,
        image: cityConfig.heroImageUrl,
        address: {
          "@type": "PostalAddress",
          addressLocality: cityConfig.name,
          addressRegion: cityConfig.state,
        },
      }),
    },
  };
}
```

---

## 8️⃣ Implementar PWA (Progressive Web App)

Já está configurado, mas para adicionar offline support:

### Passo 1: Service Worker

```typescript
// public/sw.js

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("v1").then((cache) => {
      return cache.addAll([
        "/",
        "/offline.html",
        // Adicionar recursos críticos
      ]);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method === "GET") {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      }),
    );
  }
});
```

---

## 9️⃣ Implementar Internacionalização (i18n)

### Passo 1: Setup next-intl

```bash
npm install next-intl
```

### Passo 2: Criar arquivos de tradução

```typescript
// messages/pt-BR.json
{
  "hero": {
    "title": "Apoie o Comércio Local",
    "subtitle": "Descubra os melhores negócios locais"
  }
}

// messages/es.json
{
  "hero": {
    "title": "Apoye el Comercio Local",
    "subtitle": "Descubra los mejores negocios locales"
  }
}
```

### Passo 3: Usar em componentes

```typescript
"use client";

import { useTranslations } from "next-intl";

export default function GlobalHero() {
  const t = useTranslations("hero");

  return (
    <h1>{t("title")}</h1>
  );
}
```

---

## 🔟 Performance: Image Optimization

### Usar Next.js Image Component

```typescript
// Já está implementado em todos os componentes

import Image from "next/image";

<Image
  src={city.heroImageUrl}
  alt={city.name}
  width={1200}
  height={500}
  priority={true}  // Para LCP
  sizes="(max-width: 640px) 100vw, 50vw"
  className="object-cover"
/>
```

### Resultado

✅ Lazy loading automático
✅ AVIF/WebP se suportado
✅ Responsive images
✅ Melhor Core Web Vitals

---

## 1️⃣1️⃣ Feature Flag: A/B Testing

### Setup Vercel

```typescript
// lib/flags.ts

import { getFlag } from "@vercel/flags/next";

export async function getFeatureFlags() {
  const newHomeLayout = await getFlag("new-home-layout");
  const darkMode = await getFlag("dark-mode");

  return { newHomeLayout, darkMode };
}
```

### Usar em página

```typescript
// app/page.tsx

const flags = await getFeatureFlags();

{flags.newHomeLayout ? (
  <NewGlobalHero />
) : (
  <GlobalHero />
)}
```

---

## 1️⃣2️⃣ Integração com Stripe (para anúncios)

### Passo 1: Setup

```bash
npm install stripe next-stripe
```

### Passo 2: Componente

```typescript
// components/AdvertiseButton.tsx

"use client";

import { useRouter } from "next/navigation";

export default function AdvertiseButton() {
  const router = useRouter();

  const handleClick = async () => {
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
    });
    const session = await response.json();
    router.push(session.url);
  };

  return (
    <button onClick={handleClick}>
      Anuncie Aqui
    </button>
  );
}
```

---

## Checklist de Escalabilidade

- [ ] Adicione nova cidade (teste SSG)
- [ ] Configure variáveis de ambiente
- [ ] Integre com banco de dados
- [ ] Implemente analytics
- [ ] Configure SEO/Schema
- [ ] Teste performance (Lighthouse)
- [ ] Setup PWA offline
- [ ] Implemente i18n
- [ ] Configure CDN para imagens
- [ ] Setup error monitoring (Sentry)
- [ ] Crie página de admin (para gerenciar cidades)
- [ ] Configure CI/CD (GitHub Actions)
