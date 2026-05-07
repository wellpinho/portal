# ✅ Checklist de QA & Teste - Portal de Comércios Locais

## 🧪 Testes Locais

### Setup Inicial

- [ ] `npm install` completou sem erros
- [ ] `npm run dev` inicia sem warnings críticos
- [ ] Port 3000 está disponível
- [ ] Nenhum erro de compilação TypeScript

---

## 🏠 Página Home (/)

### Renderização

- [ ] Page carrega sem erros
- [ ] Header está visível
- [ ] GlobalHero renderiza com gradiente
- [ ] CitySearch input está focável
- [ ] FeaturedCities mostra 4 cards

### Interatividade

- [ ] CitySearch auto-complete funciona
- [ ] Typing "Águas" filtra cidades
- [ ] Setas ↑↓ navegam sugestões
- [ ] Enter seleciona sugestão
- [ ] Escape fecha dropdown
- [ ] Click fora fecha dropdown
- [ ] Ao selecionar navega para /{state}/{city}
- [ ] Botões CTAs são clicáveis

### Responsividade

- [ ] Mobile (375px): Hero em 1 coluna, cards empilhados
- [ ] Tablet (768px): Grid 2 cols, texto adaptado
- [ ] Desktop (1024px): Grid 4 cols, layout completo
- [ ] Imagens carregam corretamente em todos tamanhos

### Performance

- [ ] Page não pisca ao carregar
- [ ] Imagens lazy-load após viewport
- [ ] Lighthouse score > 80

---

## 🏘️ Página da Cidade (/sc/aguas-mornas)

### URLs Existentes

- [ ] `/sc/aguas-mornas` carrega
- [ ] `/sc/santo-amaro` carrega
- [ ] `/sc/brusque` carrega
- [ ] `/sc/blumenau` carrega

### URLs Inválidas (404)

- [ ] `/sc/cidade-inexistente` mostra CityNotFound
- [ ] CityNotFound mostra mensagem amigável
- [ ] Link "Voltar para Home" funciona
- [ ] Link "Explorar cidades" funciona

### Renderização

- [ ] CityHero renderiza com imagem
- [ ] Título hero matcheia CITY_CONFIGS
- [ ] Subtítulo aparece corretamente
- [ ] CategoryGrid mostra 4 categorias
- [ ] Cada categoria tem ícone + nome
- [ ] FeaturedMerchants mostra cards
- [ ] Header atualiza com cidade selecionada

### Interatividade

- [ ] Click em categoria navega para /{state}/{city}/{category}
- [ ] Breadcrumb não aparece nesta página (está na category page)
- [ ] Hover em categoria muda cor
- [ ] BusinessCard é clicável (se implementado)

### Dados

- [ ] Hero title = CITY_CONFIGS.heroTitle ✓
- [ ] Hero image = CITY_CONFIGS.heroImageUrl ✓
- [ ] Categories = CITY_CONFIGS.featuredCategories ✓
- [ ] Featured merchants carregam ✓

---

## 📂 Página de Categoria (/sc/aguas-mornas/gastronomia)

### URLs Válidas

- [ ] `/sc/aguas-mornas/gastronomia` carrega
- [ ] `/sc/aguas-mornas/servicos` carrega
- [ ] `/sc/aguas-mornas/varejo` carrega
- [ ] `/sc/aguas-mornas/hospedagem` carrega
- [ ] `/sc/santo-amaro/bem-estar` carrega
- [ ] `/sc/brusque/fitness` carrega

### URLs Inválidas

- [ ] `/sc/aguas-mornas/categoria-inexistente` mostra 404
- [ ] `/sc/cidade-inexistente/gastronomia` mostra CityNotFound
- [ ] Mensagens de erro são claras

### Renderização

- [ ] Breadcrumb aparece: Home > Cidade > Categoria
- [ ] Breadcrumb links funcionam
- [ ] Categoria ícone aparece no header
- [ ] Contador de comércios aparece
- [ ] Grid de BusinessCards renderiza
- [ ] Sem resultados → mostra mensagem amigável

### Breadcrumb Funcionalidade

- [ ] Home link vai para /
- [ ] Cidade link vai para /{state}/{city}
- [ ] Categoria é "ativa" (não é link)
- [ ] Styling correto para links vs ativos

### BusinessCard Grid

- [ ] Mostra imagem do negócio
- [ ] Mostra nome e categoria
- [ ] Mostra localização
- [ ] Mostra rating (se existir)
- [ ] Badge "Premium" se isFeatured
- [ ] Responsivo: 1 col mobile, 2 tablet, 4 desktop

---

## 🎯 Componentes Individuais

### GlobalHero

- [ ] Título renderiza
- [ ] Subtítulo renderiza
- [ ] Botões CTAs aparecem
- [ ] Botões têm hover effects
- [ ] Cores condizem com design

### CitySearch

- [ ] Input focável
- [ ] Ícone search apareça
- [ ] Ícone X aparece quando há texto
- [ ] Autocomplete lista cidades
- [ ] Mensagem "não encontrado" se vazio
- [ ] Navegação por teclado funciona
- [ ] Mouse hover seleciona item

### FeaturedCities

- [ ] Título "Cidades em Destaque" aparece
- [ ] 4 cards de cidades aparecem
- [ ] Imagens carregam
- [ ] Overlay info ao hover
- [ ] Badge UF aparece
- [ ] Badge população aparece
- [ ] Link funciona para /{state}/{city}

### CityHero

- [ ] Imagem de fundo renderiza
- [ ] Overlay escurece imagem
- [ ] Título aparece claro
- [ ] Subtítulo aparece claro
- [ ] Responsive (altura ajusta)

### CategoryGrid

- [ ] 4 cards de categorias
- [ ] Ícone de cada categoria
- [ ] Nome da categoria
- [ ] Hover muda cor
- [ ] Click navega para categoria

### FeaturedMerchants

- [ ] Título "Destaques de [Cidade]"
- [ ] BusinessCards em grid
- [ ] Sem resultados → mensagem clara
- [ ] Responsive grid

### CityNotFound

- [ ] Ícone de erro apareça
- [ ] Mensagem amigável
- [ ] Botão "Voltar para Home"
- [ ] Link "Explorar cidades"
- [ ] Styling consistente

### Breadcrumb

- [ ] Ícone Home renderiza
- [ ] Links são navegáveis
- [ ] Ícone ChevronRight entre items
- [ ] Item ativo não é link
- [ ] Responsive (esconde labels em mobile)

---

## 🖼️ Assets & Imagens

### Imagens

- [ ] Todas as imagens carregam
- [ ] Imagens HTTPS (não HTTP)
- [ ] Nenhuma imagem quebrada (404)
- [ ] Aspectratio correto: 1200x500 hero, 500x300 cards
- [ ] WebP/AVIF quando suportado

### Ícones

- [ ] Lucide React icons renderizam
- [ ] Ícones têm cor correta
- [ ] Ícones responsivos (tamanho adapta)
- [ ] Nenhum ícone quebrado

---

## 🔗 Navegação

### Roteamento

- [ ] Home → Cidades está funcionando
- [ ] Home → Categoria está funcionando
- [ ] Browser back/forward funciona
- [ ] URLs bookmarkáveis (sem params dinâmicos desnecessários)

### Links

- [ ] Links não possuem 404
- [ ] Links abrem corretamente
- [ ] Links mantêm sessão (sem refresh)

---

## ♿ Acessibilidade

### Keyboard Navigation

- [ ] Tab navega através de elementos
- [ ] Enter ativa botões
- [ ] Escape fecha modals
- [ ] Focus indicador visível

### Screen Reader

- [ ] Títulos têm heading levels corretos
- [ ] Imagens têm alt text
- [ ] Links têm descrição
- [ ] Botões têm aria-label

### Color Contrast

- [ ] Texto legível contra fundo
- [ ] Não depende apenas de cor
- [ ] Links distinguíveis

### Semantic HTML

- [ ] Usa `<button>` para ações
- [ ] Usa `<a>` para navegação
- [ ] `<nav>` para navegação
- [ ] `<main>` para conteúdo

---

## 📱 Responsividade (Todos os Breakpoints)

### Mobile (375px - iPhone SE)

- [ ] Hero redimensiona
- [ ] Texto legível
- [ ] Botões tocáveis (48px min)
- [ ] Nenhum overflow horizontal
- [ ] Images carregam rápido

### Tablet (768px - iPad)

- [ ] Grid 2 colunas
- [ ] Padding adequado
- [ ] Tipo legível

### Desktop (1024px+)

- [ ] Grid 3-4 colunas
- [ ] Máx-width respeitado (1280px)
- [ ] Espaçamento adequado

### Orientação Landscape

- [ ] Layout ajusta
- [ ] Sem elementos cortados

---

## 🚀 Performance

### Core Web Vitals

- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] FID (First Input Delay) < 100ms
- [ ] CLS (Cumulative Layout Shift) < 0.1

### Build

- [ ] Build completa sem warnings críticos
- [ ] Nenhum erro TypeScript
- [ ] SSG gera rotas esperadas

### Runtime

- [ ] Página responde rápido
- [ ] Scroll smooth (60fps)
- [ ] Click feedback imediato

### Bundle

- [ ] JavaScript bundle < 100KB (gzipped)
- [ ] CSS não duplicado
- [ ] Imagens otimizadas

---

## 🧑‍💻 Código & Best Practices

### TypeScript

- [ ] Sem erros `any`
- [ ] Tipos definidos corretamente
- [ ] `strict: true` no tsconfig

### React/Next.js

- [ ] Server Components usadas onde apropriado
- [ ] `use client` apenas quando necessário
- [ ] Imports otimizados
- [ ] Sem console.log em produção

### CSS/Tailwind

- [ ] Nenhuma classe inline custom CSS
- [ ] Tailwind classes organizadas
- [ ] Nenhuma classe não utilizada

---

## 🛠️ Build & Deploy

### Build Process

```bash
npm run build
```

- [ ] Completa sem erros
- [ ] Tempo aceitável (<5 min)
- [ ] SSG rotas geradas
- [ ] Warnings são apenas info

### Production Build

```bash
npm run start
```

- [ ] Servidor inicia sem erro
- [ ] Pages carregam
- [ ] Sem erros em console

### Vercel Deploy (se aplicável)

- [ ] Build automático funciona
- [ ] Deploy sem erro
- [ ] Domínio acessível
- [ ] HTTPS funciona
- [ ] Redirects funcionam

---

## 📊 Dados & Content

### Mock Data

- [ ] CITY_CONFIGS tem 4+ cidades
- [ ] Cada cidade tem: slug, name, heroTitle, categories
- [ ] FEATURED_CATEGORIES tem 8 categorias
- [ ] Cada categoria tem: id, name, icon, slug

### Validação

- [ ] Slugs são únicos
- [ ] Slugs são URL-friendly
- [ ] Imagens existem (200 OK)
- [ ] Sem dados null/undefined

---

## 🐛 Edge Cases

### Casos Extremos

- [ ] Cidade com nome muito longo renderiza corretamente
- [ ] Cidade com população zero mostra corretamente
- [ ] Categoria com 0 negócios mostra "Sem resultados"
- [ ] Cidade sem imagem featured usa fallback

### Erros

- [ ] Network error handling
- [ ] API timeout handling (quando integrar)
- [ ] Imagem quebrada handling

---

## 📋 Pre-Deployment Checklist

- [ ] Tudo em ambiente local funciona
- [ ] Build local sucede
- [ ] Nenhum erro TypeScript/ESLint
- [ ] Testes de performance passam
- [ ] Acessibilidade verificada
- [ ] Responsividade verificada (todos breakpoints)
- [ ] Todos links funcionam
- [ ] Todos CTAs funcionam
- [ ] Meta tags corretos
- [ ] Analytics (se aplicável)
- [ ] Sentry/Error tracking (se aplicável)

---

## 📊 Matriz de Teste

| Componente        | Renderização | Interatividade | Responsividade | A11y |
| ----------------- | ------------ | -------------- | -------------- | ---- |
| GlobalHero        | ✅           | ✅             | ✅             | ✅   |
| CitySearch        | ✅           | ✅             | ✅             | ✅   |
| FeaturedCities    | ✅           | ✅             | ✅             | ✅   |
| CityHero          | ✅           | ✅             | ✅             | ✅   |
| CategoryGrid      | ✅           | ✅             | ✅             | ✅   |
| FeaturedMerchants | ✅           | ✅             | ✅             | ✅   |
| Breadcrumb        | ✅           | ✅             | ✅             | ✅   |
| CityNotFound      | ✅           | ✅             | ✅             | ✅   |

---

Todos testes passando? Pronto para produção! 🚀
