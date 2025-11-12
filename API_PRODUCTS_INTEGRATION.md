# 🛒 Integração da API de Produtos - Tyler Frontend

## 📋 Visão Geral

Esta integração conecta o frontend Vue.js com a API real de produtos do backend Tyler Spring Boot, implementando todas as funcionalidades CRUD com suporte a upload de imagens.

## 🔧 Configuração de Ambiente

### Variáveis de Ambiente

#### Desenvolvimento (`.env`)

```env
# Tyler API Configuration
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_PRODUCTS_URL=http://localhost:8080/api/products
VITE_API_TIMEOUT=30000

# Upload Configuration
VITE_MAX_IMAGE_SIZE=10485760          # 10MB
VITE_MAX_IMAGES_PER_PRODUCT=10
VITE_ALLOWED_IMAGE_TYPES=image/jpeg,image/jpg,image/png,image/webp

# Environment Configuration
VITE_NODE_ENV=development
VITE_IS_PRODUCTION=false
```

#### Produção (`.env.production`)

```env
# Tyler API Configuration - PRODUCTION
VITE_API_BASE_URL=https://api.tylerproject.com/api
VITE_API_PRODUCTS_URL=https://api.tylerproject.com/api/products
VITE_API_TIMEOUT=30000

# Upload Configuration (mesmo que dev)
VITE_MAX_IMAGE_SIZE=10485760
VITE_MAX_IMAGES_PER_PRODUCT=10
VITE_ALLOWED_IMAGE_TYPES=image/jpeg,image/jpg,image/png,image/webp

# Environment Configuration
VITE_NODE_ENV=production
VITE_IS_PRODUCTION=true
```

## 🏗️ Arquitetura

### 1. **Tipos TypeScript** (`src/types/index.ts`)

```typescript
// Imagem do Produto
interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  uploadedAt: string;
}

// Produto Completo
interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Em reais (não centavos)
  category: string;
  stock: number;
  active: boolean;
  brand?: string;
  model?: string;
  weight?: string;
  dimensions?: string;
  color?: string;
  warranty?: string;
  tags?: string[];
  images: ProductImage[]; // Array de imagens
  createdAt: string;
  updatedAt: string;
}

// DTO para Criação/Atualização
interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  active: boolean;
  brand?: string;
  // ... outros campos opcionais
}
```

### 2. **Serviço de Produtos** (`src/utils/services.ts`)

#### Métodos Principais:

```typescript
// RECOMENDADO - Cursor Pagination
await productsService.getProductsPaginated({
  limit: 20,
  sortBy: "CREATED_AT",
  sortDirection: "DESC",
  activeOnly: true,
  category: "Eletrônicos",
});

// Produto Individual
await productsService.getProductById("product-id");

// Criar com Imagens (ENDPOINT UNIFICADO - RECOMENDADO)
await productsService.createProductWithImages(productData, imageFiles);

// Criar sem Imagens
await productsService.createProduct(productData);

// Atualizar
await productsService.updateProduct("product-id", updateData);

// Deletar
await productsService.deleteProduct("product-id");

// Gerenciar Imagens
await productsService.uploadImageToProduct("product-id", imageFile, isPrimary);
await productsService.removeImageFromProduct("product-id", "image-id");
```

### 3. **Store Pinia** (`src/stores/products.ts`)

#### Estado:

```typescript
const products = ref<Product[]>([]);
const currentProduct = ref<Product | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const pagination = ref<PaginationState>();
```

#### Computed:

```typescript
const activeProducts = computed(() => ...);
const productsByCategory = computed(() => ...);
const availableCategories = computed(() => ...);
```

#### Actions Principais:

```typescript
// Buscar com Cursor Pagination (RECOMENDADO)
await fetchProductsPaginated({ limit: 20, activeOnly: true });

// Navegação por Páginas
await fetchNextPage();
await fetchPreviousPage();

// CRUD Completo
await createProductWithImages(productData, images);
await updateProduct(id, updateData);
await deleteProduct(id);

// Gerenciar Imagens
await uploadImageToProduct(productId, image, isPrimary);
await removeImageFromProduct(productId, imageId);
```

## 🎯 Funcionalidades Implementadas

### ✅ **Listagem de Produtos**

#### Cursor Pagination (Recomendado)

- **Performance Superior**: O(1) vs O(n) da paginação tradicional
- **Otimizado para NoSQL**: Funciona perfeitamente com Firestore
- **Navegação Bidirecional**: Próxima/Anterior
- **Filtros Avançados**: Categoria, status ativo, ordenação

```typescript
// Exemplo de uso no componente
const store = useProductsStore();

// Primeira carga
await store.fetchProductsPaginated({
  limit: 20,
  sortBy: "CREATED_AT",
  sortDirection: "DESC",
  activeOnly: true,
});

// Próxima página
if (store.pagination.hasNext) {
  await store.fetchNextPage();
}
```

#### Paginação Tradicional (Compatibilidade)

- **Sistemas Legados**: Integração com frontends antigos
- **Simplicidade**: Página + tamanho

### ✅ **CRUD Completo**

#### Criação de Produtos

```typescript
// Com imagens (RECOMENDADO)
const success = await store.createProductWithImages(
  {
    name: "Produto Exemplo",
    description: "Descrição detalhada",
    price: 99.99,
    category: "Eletrônicos",
    stock: 50,
    active: true,
  },
  imageFiles
);

// Sem imagens
const success = await store.createProduct(productData);
```

#### Atualização

```typescript
const success = await store.updateProduct("product-id", {
  name: "Nome Atualizado",
  price: 149.99,
  stock: 30,
});
```

#### Remoção

```typescript
const success = await store.deleteProduct("product-id");
```

### ✅ **Gerenciamento de Imagens**

#### Upload de Imagens

- **Validação Automática**: Tipo, tamanho, quantidade
- **Múltiplas Imagens**: Até 10 por produto
- **Definir Primária**: Imagem principal do produto
- **Formatos Suportados**: JPG, PNG, WEBP
- **Tamanho Máximo**: 10MB por imagem

```typescript
// Adicionar imagem
await store.uploadImageToProduct(
  productId,
  imageFile,
  true // isPrimary
);

// Remover imagem
await store.removeImageFromProduct(productId, imageId);
```

#### Validações Implementadas

```typescript
// Verificar tipo válido
productsService.isValidImageType(file);

// Verificar tamanho
productsService.isValidImageSize(file);

// Formatar tamanho para display
productsService.formatFileSize(file.size);
```

## 🚀 Performance e Otimizações

### **1. Cursor Pagination**

- **Vantagem**: Performance O(1) independente da página
- **NoSQL Friendly**: Otimizado para Firestore
- **Uso**: Preferir sempre para novas implementações

### **2. Upload Unificado**

- **Menos Requests**: Criar produto + imagens em uma requisição
- **Atomicidade**: Produto e imagens criados juntos
- **Fallback**: Upload individual disponível

### **3. Cache Local**

- **Estado Reativo**: Pinia mantém dados em memória
- **Atualizações Inteligentes**: Lista atualizada após CRUD
- **Computed Properties**: Filtros e agrupamentos reativos

## 📱 Integração com Componentes

### **Exemplo de Listagem**

```vue
<template>
  <div>
    <!-- Loading State -->
    <div v-if="store.loading" class="loading">Carregando produtos...</div>

    <!-- Products Grid -->
    <div v-else class="products-grid">
      <ProductCard
        v-for="product in store.products"
        :key="product.id"
        :product="product"
      />
    </div>

    <!-- Pagination Controls -->
    <div class="pagination">
      <button
        @click="store.fetchPreviousPage()"
        :disabled="!store.pagination.hasPrevious"
      >
        Anterior
      </button>

      <button
        @click="store.fetchNextPage()"
        :disabled="!store.pagination.hasNext"
      >
        Próximo
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useProductsStore } from "@/stores/products";

const store = useProductsStore();

onMounted(async () => {
  await store.fetchProductsPaginated({
    limit: 20,
    activeOnly: true,
    sortBy: "CREATED_AT",
    sortDirection: "DESC",
  });
});
</script>
```

### **Exemplo de Formulário com Upload**

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <!-- Campos do Produto -->
    <input v-model="form.name" placeholder="Nome" required />
    <textarea v-model="form.description" placeholder="Descrição"></textarea>
    <input v-model.number="form.price" type="number" step="0.01" />

    <!-- Upload de Imagens -->
    <input type="file" multiple accept="image/*" @change="handleImageSelect" />

    <!-- Preview das Imagens -->
    <div class="image-previews">
      <div v-for="(image, index) in selectedImages" :key="index">
        <img :src="getImagePreview(image)" />
        <button @click="removeImage(index)">Remover</button>
      </div>
    </div>

    <button type="submit" :disabled="store.loading">Criar Produto</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useProductsStore } from "@/stores/products";
import { productsService } from "@/utils/services";

const store = useProductsStore();
const selectedImages = ref<File[]>([]);
const form = ref({
  name: "",
  description: "",
  price: 0,
  category: "Geral",
  stock: 0,
  active: true,
});

function handleImageSelect(event: Event) {
  const files = Array.from((event.target as HTMLInputElement).files || []);

  // Validar imagens
  for (const file of files) {
    if (!productsService.isValidImageType(file)) {
      alert(`Arquivo ${file.name} não é uma imagem válida`);
      return;
    }
    if (!productsService.isValidImageSize(file)) {
      alert(`Arquivo ${file.name} é muito grande (máx: 10MB)`);
      return;
    }
  }

  selectedImages.value = files;
}

async function handleSubmit() {
  try {
    const success = await store.createProductWithImages(
      form.value,
      selectedImages.value
    );

    if (success) {
      // Reset form
      form.value = {
        /* initial values */
      };
      selectedImages.value = [];
    }
  } catch (error) {
    console.error("Erro ao criar produto:", error);
  }
}
</script>
```

## 🔧 Troubleshooting

### **Problemas Comuns**

#### 1. **Erro: "showToast is not a function"**

**Causa**: Import incorreto do composable de toast
**Solução**: Remover `useToast` dos stores, usar console.log temporariamente

#### 2. **Erro: "Cannot read properties of undefined (reading 'products')"**

**Causa**: Formato de resposta da API diferente do esperado
**Solução**: Verificar se API retorna `{ products: Product[] }`

#### 3. **Imagens não carregam**

**Causa**: URLs das imagens podem estar incorretas
**Solução**: Verificar se URLs retornadas pela API são acessíveis

#### 4. **Upload falha**

**Causa**: Validação de arquivo ou tamanho
**Solução**: Verificar logs do console para detalhes da validação

### **Debug Mode**

Para ativar logs detalhados:

```typescript
// No arquivo .env
VITE_NODE_ENV = development;

// Logs automáticos no console:
// 🚀 GET /products - Request
// ✅ GET /products - Response
// ❌ GET /products - Error
```

## 📊 Monitoramento

### **Métricas Disponíveis**

```typescript
// No store
console.log("Produtos carregados:", store.products.length);
console.log("Tem próxima página:", store.pagination.hasNext);
console.log("Estado de loading:", store.loading);
console.log("Erro atual:", store.error);

// Performance de paginação
console.log("Cursor atual:", store.pagination.nextCursor);
console.log("Filtros ativos:", store.currentFilters);
```

## 🚦 Status da Implementação

### ✅ **Funcionalidades Completas**

- [x] Configuração de ambiente (dev/prod)
- [x] Tipos TypeScript completos
- [x] Serviço de produtos com todas as operações
- [x] Store Pinia reativo com cursor pagination
- [x] Validação de upload de imagens
- [x] Tratamento de erros
- [x] Logs de debug

### 🔄 **Próximos Passos**

- [ ] Componente de formulário visual
- [ ] Componente de upload com drag & drop
- [ ] Testes unitários
- [ ] Documentação de componentes

### 🧪 **Para Testar**

1. Iniciar API backend em `localhost:8080`
2. Configurar `.env` com URLs corretas
3. Executar `npm run dev`
4. Acessar `/admin/products`
5. Testar CRUD completo

## 📚 **Referências**

- **API Endpoints**: Ver documentação da API fornecida
- **Vue 3**: https://vuejs.org/
- **Pinia**: https://pinia.vuejs.org/
- **Vite**: https://vitejs.dev/
- **TypeScript**: https://www.typescriptlang.org/
