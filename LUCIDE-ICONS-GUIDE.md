# 🎨 Guia de Ícones Lucide React

## Ícones Atualmente Configurados

```typescript
import {
  UtensilsCrossed, // Gastronomia 🍽️
  Wrench, // Serviços 🔧
  ShoppingBag, // Varejo 🛍️
  Home, // Hospedagem 🏠
  Heart, // Bem-estar ❤️
  BookOpen, // Educação 📚
  Dumbbell, // Fitness 💪
  Camera, // Fotografia 📷
} from "lucide-react";
```

---

## Como Usar Ícones Customizados

### 1. Encontrar Ícone

Visite: https://lucide.dev/

Procure por palavra-chave (ex: "restaurant", "coffee", "hotel")

### 2. Importar

```typescript
// lib/data/cities.ts
import { UtensilsCrossed, CoffeeIcon, HotelIcon } from "lucide-react";

export const FEATURED_CATEGORIES = {
  gastronomy: {
    icon: UtensilsCrossed,
    // ...
  },
  coffee: {
    icon: CoffeeIcon,
    // ...
  },
  hotels: {
    icon: HotelIcon,
    // ...
  },
};
```

### 3. Usar em Componentes

```typescript
export default function CategoryGrid() {
  return (
    {categories.map((cat) => {
      const Icon = cat.icon;
      return (
        <div>
          <Icon className="w-8 h-8 text-emerald-600" />
          <span>{cat.name}</span>
        </div>
      );
    })}
  );
}
```

---

## 🎯 Sugestões de Ícones por Categoria

### Gastronomia / Comida

| Ícone | Nome            | Importar                     |
| ----- | --------------- | ---------------------------- |
| 🍽️    | UtensilsCrossed | `import { UtensilsCrossed }` |
| ☕    | Coffee          | `import { Coffee }`          |
| 🍕    | Pizza           | `import { Pizza }`           |
| 🍔    | Burger          | `import { Burger }`          |
| 🍜    | Soup            | `import { Soup }`            |
| 🧁    | Cake            | `import { Cake }`            |
| 🍷    | Wine            | `import { Wine }`            |
| 🍱    | Utensils        | `import { Utensils }`        |

### Serviços

| Ícone | Nome      | Importar               |
| ----- | --------- | ---------------------- |
| 🔧    | Wrench    | `import { Wrench }`    |
| 🔨    | Hammer    | `import { Hammer }`    |
| 🏗️    | Hammer2   | `import { Hammer2 }`   |
| ⚙️    | Settings  | `import { Settings }`  |
| 🛠️    | Wrench2   | `import { Wrench2 }`   |
| 💼    | Briefcase | `import { Briefcase }` |
| 👨‍💼    | User      | `import { User }`      |
| 📞    | Phone     | `import { Phone }`     |

### Varejo / Compras

| Ícone | Nome         | Importar                  |
| ----- | ------------ | ------------------------- |
| 🛍️    | ShoppingBag  | `import { ShoppingBag }`  |
| 🛒    | ShoppingCart | `import { ShoppingCart }` |
| 🏪    | Store        | `import { Store }`        |
| 🏬    | Building2    | `import { Building2 }`    |
| 📦    | Package      | `import { Package }`      |
| 💳    | CreditCard   | `import { CreditCard }`   |
| 💰    | DollarSign   | `import { DollarSign }`   |

### Hospedagem / Turismo

| Ícone | Nome     | Importar              |
| ----- | -------- | --------------------- |
| 🏠    | Home     | `import { Home }`     |
| 🏨    | Hotel    | `import { Hotel }`    |
| 🏖️    | Waves    | `import { Waves }`    |
| ✈️    | Plane    | `import { Plane }`    |
| 🗺️    | MapPin   | `import { MapPin }`   |
| 🎒    | Backpack | `import { Backpack }` |
| 🛏️    | Bed      | `import { Bed }`      |
| 🏝️    | TreePine | `import { TreePine }` |

### Bem-estar / Saúde

| Ícone | Nome        | Importar                    |
| ----- | ----------- | --------------------------- |
| ❤️    | Heart       | `import { Heart }`          |
| 🏥    | Heart Pulse | `import { HeartHandshake }` |
| 🧘    | Meditation  | `import { Meditation }`     |
| 💊    | Pill        | `import { Pill }`           |
| 🩺    | Stethoscope | `import { Stethoscope }`    |
| 🧘‍♀️    | Yoga        | `import { Flower2 }`        |
| 💆    | Waves2      | `import { Waves2 }`         |
| 🌿    | Leaf        | `import { Leaf }`           |

### Educação

| Ícone | Nome          | Importar                   |
| ----- | ------------- | -------------------------- |
| 📚    | BookOpen      | `import { BookOpen }`      |
| 🎓    | GraduationCap | `import { GraduationCap }` |
| ✏️    | Pencil        | `import { Pencil }`        |
| 📖    | BookMarked    | `import { BookMarked }`    |
| 🏫    | Building2     | `import { Building2 }`     |
| 👨‍🎓    | User          | `import { User }`          |
| 📝    | FileText      | `import { FileText }`      |
| 🎯    | Target        | `import { Target }`        |

### Fitness / Academia

| Ícone | Nome       | Importar                |
| ----- | ---------- | ----------------------- |
| 💪    | Dumbbell   | `import { Dumbbell }`   |
| 🏋️    | Zap        | `import { Zap }`        |
| 🤸    | Activity   | `import { Activity }`   |
| 🚴    | Bike       | `import { Bike }`       |
| 🏃    | Footprints | `import { Footprints }` |
| 🧗    | Zap2       | `import { Zap2 }`       |
| 🤾    | Users      | `import { Users }`      |
| ⛹️    | Target     | `import { Target }`     |

### Fotografia

| Ícone | Nome      | Importar               |
| ----- | --------- | ---------------------- |
| 📷    | Camera    | `import { Camera }`    |
| 📸    | Image     | `import { Image }`     |
| 🎥    | Video     | `import { Video }`     |
| 🖼️    | Frame     | `import { Frame }`     |
| 📹    | VideoIcon | `import { VideoIcon }` |
| ⚡    | Zap       | `import { Zap }`       |
| 🌟    | Star      | `import { Star }`      |

### Outros Úteis

| Categoria   | Ícone | Nome       | Importar                |
| ----------- | ----- | ---------- | ----------------------- |
| Beleza      | ✨    | Sparkles   | `import { Sparkles }`   |
| Beleza      | 💄    | Smile      | `import { Smile }`      |
| Carro       | 🚗    | Car        | `import { Car }`        |
| Carro       | ⛽    | Fuel       | `import { Fuel }`       |
| Moda        | 👔    | Shirt      | `import { Shirt }`      |
| Moda        | 👗    | Dress      | `import { Dress }`      |
| Tech        | 💻    | Laptop     | `import { Laptop }`     |
| Tech        | 📱    | Smartphone | `import { Smartphone }` |
| Real Estate | 🏘️    | House      | `import { House }`      |
| Beleza      | 💇    | Scissors   | `import { Scissors }`   |

---

## 🎨 Paleta de Cores Sugerida

### Para Ícones

```typescript
// Cor primária (emerald)
className = "text-emerald-600";

// Hover
className = "group-hover:text-emerald-700";

// Background
className = "bg-emerald-100 group-hover:bg-emerald-600";
```

### Variações

```typescript
// Cores diferentes por categoria
const iconColors: Record<string, string> = {
  gastronomy: "text-orange-600", // Laranja
  services: "text-blue-600", // Azul
  retail: "text-purple-600", // Roxo
  accommodation: "text-red-600", // Vermelho
  wellness: "text-pink-600", // Rosa
  education: "text-yellow-600", // Amarelo
  fitness: "text-green-600", // Verde
  photography: "text-indigo-600", // Índigo
};
```

---

## 📋 Template para Nova Categoria

```typescript
// lib/data/cities.ts

import {
  // ... outros ícones
  YourNewIcon,  // ← Novo ícone
} from "lucide-react";

export const FEATURED_CATEGORIES: Record<string, FeaturedCategory> = {
  // ... outras categorias

  newCategory: {
    id: "new-category",
    name: "Nova Categoria",          // Nome exibido
    icon: YourNewIcon,               // Ícone Lucide
    slug: "nova-categoria",          // URL-friendly
  },
};

// Depois use em qualquer cidade:
featuredCategories: [
  FEATURED_CATEGORIES.gastronomy,
  FEATURED_CATEGORIES.newCategory,  // ← Aqui!
  // ...
],
```

---

## 🔗 Referência Rápida

- **Documentação Lucide**: https://lucide.dev/
- **Search Ícones**: https://lucide.dev/icons
- **Tamanhos Sugeridos**:
  - Hero: `w-6 h-6` ou `w-8 h-8`
  - Grid: `w-8 h-8` ou `w-10 h-10`
  - Cards: `w-4 h-4` ou `w-5 h-5`

---

## 💡 Tips

1. **Consistência**: Use ícones similares em tamanho/estilo
2. **Contraste**: Garanta visibilidade contra fundo
3. **Hover States**: Sempre tenha feedback visual
4. **Acessibilidade**: Use `aria-hidden="true"` em ícones puros decorativos
5. **Performance**: Lucide é tree-shakeable (importa só o necessário)

---

Aproveite a biblioteca! 🎨✨
