# Arquitetura de Microcomponentes - Frontend

## 📁 Estrutura

```
frontend/src/
├── components/
│   ├── ui/                    # Microcomponentes Atômicos (UI Kit)
│   │   ├── index.ts           # Barrel export
│   │   ├── BaseButton.vue     # Botão base (5 variantes, 3 tamanhos, loading)
│   │   ├── BaseInput.vue      # Input base (validação, erro, hint)
│   │   ├── BaseCard.vue       # Card wrapper (padding, hover, clickable)
│   │   ├── BaseModal.vue      # Modal dialog (5 tamanhos, backdrop)
│   │   ├── ProgressBar.vue    # Barra de progresso (animada, 4 cores)
│   │   ├── ToastContainer.vue # Container de notificações
│   │   ├── Badge.vue          # Badge/Tag (7 variantes, 3 tamanhos)
│   │   ├── Spinner.vue        # Loading spinner (5 tamanhos, 4 cores)
│   │   ├── Avatar.vue         # Avatar de usuário (iniciais, 6 tamanhos)
│   │   ├── Skeleton.vue       # Placeholder de loading
│   │   ├── Dropdown.vue       # Menu dropdown
│   │   └── DropdownItem.vue   # Item de dropdown
│   │
│   ├── CardProduto.vue        # Componente composto usando UI Kit
│   ├── CardRifa.vue           # Componente composto usando UI Kit
│   ├── CardEvento.vue         # Componente composto usando UI Kit
│   ├── BarraProgressoMeta.vue # Componente composto usando UI Kit
│   ├── Header.vue
│   └── Footer.vue
│
├── composables/               # Lógica Reutilizável (Composition API)
│   ├── index.ts               # Barrel export
│   ├── useCurrency.ts         # Formatação de moeda (BRL)
│   ├── useDate.ts             # Formatação de data/hora
│   ├── useToast.ts            # Sistema de notificações
│   └── useLoading.ts          # Gerenciamento de estado de loading
│
├── stores/                    # Estado Global (Pinia)
├── views/                     # Páginas
├── layouts/                   # Layouts
└── router/                    # Roteamento
```

## 🎯 Princípios da Arquitetura

### 1. **Atomic Design**

- **Átomos**: Componentes UI básicos (BaseButton, BaseInput, Badge, Spinner, etc.)
- **Moléculas**: Composições simples (CardProduto, BarraProgressoMeta)
- **Organismos**: Composições complexas (Header, Footer)
- **Templates**: Layouts (DefaultLayout, AdminLayout)
- **Pages**: Views completas

### 2. **Separation of Concerns**

- **UI Components** (`components/ui/`): Apenas apresentação, sem lógica de negócio
- **Composables** (`composables/`): Lógica reutilizável extraída
- **Stores** (`stores/`): Estado global e API calls
- **Views**: Orquestração de componentes + lógica de página

### 3. **Reusabilidade**

- Todos os componentes UI são configuráveis via props
- Composables encapsulam lógica comum (formatação, estado, API)
- Barrel exports facilitam imports

## 📦 Microcomponentes UI Criados

### BaseButton

```vue
<BaseButton
  variant="primary|secondary|outline|ghost|danger"
  size="sm|md|lg"
  :loading="isLoading"
  :disabled="isDisabled"
  full-width
>
  Clique aqui
</BaseButton>
```

**Variantes**: primary (azul), secondary (rosa), outline, ghost, danger  
**Tamanhos**: sm, md, lg  
**Features**: loading spinner, disabled state, full-width

### BaseInput

```vue
<BaseInput
  v-model="form.name"
  label="Nome"
  type="text|email|password|number|tel"
  placeholder="Digite seu nome"
  error="Campo obrigatório"
  hint="Informe seu nome completo"
  :required="true"
  :disabled="false"
/>
```

**Features**: validação visual, mensagens de erro, hint text, ícones

### BaseCard

```vue
<BaseCard padding="sm|md|lg|none" hoverable clickable>
  Conteúdo do card
</BaseCard>
```

**Features**: hover effect, cursor pointer, espaçamento configurável

### ProgressBar

```vue
<ProgressBar
  :percentage="75"
  :height="16"
  color="primary|secondary|success|gradient"
  show-label
  label="Progresso"
  animated
/>
```

**Cores**: primary (azul), secondary (rosa), success (verde), gradient  
**Features**: animação suave, label customizável, altura configurável

### BaseModal

```vue
<BaseModal
  v-model="isOpen"
  title="Título do Modal"
  size="sm|md|lg|xl|full"
  :close-on-backdrop="true"
  scrollable
>
  <template #header>Cabeçalho customizado</template>
  Conteúdo principal
  <template #footer>Rodapé customizado</template>
</BaseModal>
```

**Tamanhos**: sm (400px), md (600px), lg (800px), xl (1200px), full  
**Features**: slots customizáveis, backdrop click, scrollable

### Badge

```vue
<Badge
  variant="default|primary|secondary|success|warning|danger|info"
  size="sm|md|lg"
  rounded
  outlined
>
  Novo
</Badge>
```

**Features**: 7 variantes de cor, outlined style, rounded/square

### Spinner

```vue
<Spinner
  size="xs|sm|md|lg|xl"
  color="primary|secondary|white|gray"
  label="Carregando..."
  center
/>
```

**Features**: 5 tamanhos, 4 cores, label opcional, centralização

### Avatar

```vue
<Avatar
  src="/path/to/image.jpg"
  alt="Tyler"
  name="Tyler Lima Eler"
  size="xs|sm|md|lg|xl|2xl"
  :rounded="true"
/>
```

**Features**: fallback para iniciais, 6 tamanhos, rounded/square

### Skeleton

```vue
<Skeleton
  width="100%"
  height="200px"
  variant="text|rectangular|circular|rounded"
  animation="pulse|wave|none"
/>
```

**Features**: 3 tipos de animação, 4 variantes de forma

### Dropdown

```vue
<Dropdown label="Opções" position="right|left" width="w-56">
  <DropdownItem @click="handleEdit">Editar</DropdownItem>
  <DropdownItem variant="danger" @click="handleDelete">
    Excluir
  </DropdownItem>
</Dropdown>
```

**Features**: click outside para fechar, posicionamento configurável

## 🧩 Composables Criados

### useCurrency

```typescript
const { formatCurrency, formatNumber } = useCurrency();

formatCurrency(1500); // "R$ 1.500,00"
formatNumber(1500); // "1.500,00"
```

**Uso**: Formatação de valores monetários em Real (BRL)

### useDate

```typescript
const { formatDate, formatDateTime, formatShortDate, getRelativeTime } =
  useDate();

formatDate("2024-01-15"); // "15 de janeiro de 2024"
formatDateTime("2024-01-15T14:30:00"); // "15/01/2024 14:30"
formatShortDate("2024-01-15"); // "15/01/2024"
getRelativeTime("2024-01-15"); // "há 2 dias"
```

**Uso**: Formatação de datas em português brasileiro

### useToast

```typescript
const { success, error, warning, info } = useToast();

success("Produto adicionado!", { duration: 3000 });
error("Erro ao processar pagamento");
warning("Estoque baixo");
info("Nova atualização disponível");
```

**Uso**: Sistema de notificações toast (4 tipos, auto-dismiss)

### useLoading

```typescript
const { isLoading, error, startLoading, stopLoading, setError, withLoading } =
  useLoading();

// Manual
startLoading();
await api.fetchData();
stopLoading();

// Automático
await withLoading(async () => {
  await api.fetchData();
});
```

**Uso**: Gerenciamento de estado de loading e erros

## 🔄 Refatoração Realizada

### Antes (sem microcomponentes):

```vue
<template>
  <div class="card group cursor-pointer">
    <h3>{{ product.name }}</h3>
    <button class="btn-primary text-sm" @click="buy">Comprar</button>
  </div>
</template>

<script setup>
function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
</script>
```

### Depois (com microcomponentes):

```vue
<template>
  <BaseCard hoverable clickable>
    <h3>{{ product.name }}</h3>
    <BaseButton size="sm" @click="buy"> Comprar </BaseButton>
  </BaseCard>
</template>

<script setup>
import { BaseCard, BaseButton } from "@/components/ui";
import { useCurrency } from "@/composables";

const { formatCurrency } = useCurrency();
</script>
```

## ✅ Benefícios

1. **Consistência**: Todos os botões, inputs e cards seguem o mesmo padrão visual
2. **Manutenibilidade**: Alterações em um componente base afetam toda a aplicação
3. **Produtividade**: Criação rápida de novas telas usando componentes prontos
4. **Testabilidade**: Componentes isolados são mais fáceis de testar
5. **Reusabilidade**: Lógica comum extraída em composables
6. **Type Safety**: TypeScript + props tipadas garantem segurança
7. **Bundle Size**: Tree-shaking via barrel exports

## 📝 Convenções de Uso

### Imports

```typescript
// ✅ Correto (via barrel export)
import { BaseButton, BaseCard, Badge } from "@/components/ui";
import { useCurrency, useDate } from "@/composables";

// ❌ Evitar (imports individuais)
import BaseButton from "@/components/ui/BaseButton.vue";
import { useCurrency } from "@/composables/useCurrency";
```

### Nomenclatura

- **Base**: Componentes base do UI Kit (`BaseButton`, `BaseInput`)
- **Componente**: Nome do conceito (`Badge`, `Avatar`, `Dropdown`)
- **use**: Prefixo para composables (`useCurrency`, `useToast`)

### Composição

```vue
<template>
  <BaseCard>
    <div class="flex items-center gap-4">
      <Avatar :src="user.avatar" :name="user.name" size="lg" />
      <div>
        <div class="flex items-center gap-2">
          <h3>{{ user.name }}</h3>
          <Badge variant="success">Ativo</Badge>
        </div>
        <p class="text-gray-600">{{ formatDate(user.createdAt) }}</p>
      </div>
    </div>
    <BaseButton variant="outline" size="sm" @click="viewProfile">
      Ver perfil
    </BaseButton>
  </BaseCard>
</template>
```

## 🚀 Próximos Passos

1. [ ] Criar componente `Tabs` para navegação entre seções
2. [ ] Criar componente `Tooltip` para dicas visuais
3. [ ] Criar composable `useForm` para validação de formulários
4. [ ] Criar composable `useApi` para requisições HTTP padronizadas
5. [ ] Adicionar testes unitários para componentes UI
6. [ ] Documentar componentes com Storybook (opcional)
7. [ ] Criar theme switcher (modo claro/escuro)

## 📚 Referências

- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Atomic Design Methodology](https://bradfrost.com/blog/post/atomic-web-design/)
- [TailwindCSS Components](https://tailwindui.com/components)
