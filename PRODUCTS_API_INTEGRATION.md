# 🔌 **API de Produtos - Integração Completa**

## **✅ O que foi implementado:**

### **1. 🔧 Configuração de Ambiente**

- **URLs por ambiente**: `.env` (dev) e `.env.production` (prod)
- **Variáveis configuráveis**:
  ```bash
  VITE_API_PRODUCTS_URL=http://localhost:8080/api/products
  VITE_MAX_IMAGE_SIZE=10485760  # 10MB
  VITE_MAX_IMAGES_PER_PRODUCT=10
  VITE_ALLOWED_IMAGE_TYPES=image/jpeg,image/jpg,image/png,image/webp
  ```

### **2. 📝 Modelos TypeScript Atualizados**

- **Product**: Novo formato com array de imagens
- **ProductImage**: Interface para imagens com isPrimary e url
- **ProductCreateRequest**: DTO para criação/atualização
- **ProductPaginationResponse**: Cursor-based pagination
- **ProductFilters**: Filtros para listagem otimizada

### **3. 🌐 Service Layer Completo**

**Arquivo**: `src/utils/services.ts` (ProductsService)

**Principais métodos:**

- `getProductsPaginated()` - **RECOMENDADO** - Cursor pagination
- `getProducts()` - Paginação tradicional (compatibilidade)
- `createProductWithImages()` - **UNIFICADO** - Produto + imagens
- `uploadImageToProduct()` - Adicionar imagem individual
- `updateProduct()` / `deleteProduct()` - CRUD completo

**Validações incluídas:**

- Tipo de arquivo (JPEG, PNG, WEBP)
- Tamanho máximo (10MB por imagem)
- Limite de imagens (10 por produto)

### **4. 🗄️ Pinia Store Avançada**

**Arquivo**: `src/stores/products.ts`

**Recursos implementados:**

- ✅ **Cursor pagination** com `fetchNextPage()` / `fetchPreviousPage()`
- ✅ **Filtros dinâmicos** (categoria, status, ordenação)
- ✅ **Cache inteligente** com produtos locais
- ✅ **Estados computados** (por categoria, produtos ativos)
- ✅ **Gerenciamento de imagens** completo
- ✅ **Error handling** robusto com toasts

### **5. 🎨 Componentes UI Novos**

#### **ImageUpload.vue**

- ✅ **Drag & drop** de múltiplos arquivos
- ✅ **Preview em tempo real** das imagens
- ✅ **Validação visual** (tipo, tamanho)
- ✅ **Feedback detalhado** de erros
- ✅ **Remoção individual** de arquivos

#### **ProductForm.vue**

- ✅ **Formulário completo** com todos os campos da API
- ✅ **Integração com ImageUpload**
- ✅ **Validação em tempo real**
- ✅ **Tags dinâmicas** (separadas por vírgula)
- ✅ **Campos opcionais** (marca, modelo, cor, etc.)

### **6. 📋 Interface Admin Modernizada**

**Arquivo**: `src/views/admin/Products.vue`

**Novos recursos:**

- ✅ **Filtros por categoria e status**
- ✅ **Ordenação configurável**
- ✅ **Paginação cursor-based**
- ✅ **Estados visuais** (loading, error, empty)
- ✅ **Preview de imagens** na listagem
- ✅ **Contador de imagens** por produto

---

## **🚀 Como usar a integração:**

### **1. Desenvolvimento Local**

```bash
# .env já configurado para localhost:8080
npm run dev
# API: http://localhost:8080/api/products
```

### **2. Produção**

```bash
# .env.production configurado para produção
npm run build
# API: https://api.tylerproject.com/api/products
```

### **3. Operações principais:**

#### **Listar Produtos (Cursor Pagination)**

```typescript
// No componente
const productsStore = useProductsStore();

// Buscar primeira página
await productsStore.fetchProductsPaginated({
  limit: 20,
  sortBy: "CREATED_AT",
  sortDirection: "DESC",
  activeOnly: true,
});

// Próxima página
await productsStore.fetchNextPage();
```

#### **Criar Produto com Imagens**

```typescript
const productData = {
  name: "Produto Teste",
  description: "Descrição detalhada",
  price: 99.9,
  category: "Eletrônicos",
  stock: 50,
  active: true,
};

const images = [file1, file2]; // File objects

await productsStore.createProductWithImages(productData, images);
```

#### **Upload de Imagem Individual**

```typescript
await productsStore.uploadImageToProduct(productId, file, isPrimary);
```

---

## **🔧 Endpoints da API Utilizados:**

### **✅ Implementados no Frontend:**

1. **`GET /api/products/paginated`** - Listagem otimizada ⭐
2. **`GET /api/products/{id}`** - Produto individual
3. **`POST /api/products`** - Criar produto (com/sem imagens)
4. **`PUT /api/products/{id}`** - Atualizar produto
5. **`DELETE /api/products/{id}`** - Remover produto
6. **`POST /api/products/{id}/images`** - Adicionar imagem
7. **`DELETE /api/products/{id}/images/{imageId}`** - Remover imagem

### **📋 Parâmetros Suportados:**

- **Paginação**: `limit`, `cursor`, `direction`
- **Ordenação**: `sortBy`, `sortDirection`
- **Filtros**: `activeOnly`, `category`
- **Imagens**: `multipart/form-data` com validação

---

## **🎯 Próximos Passos:**

### **1. ⚡ Para testar agora:**

```bash
# Inicie sua API Spring Boot na porta 8080
cd tyler-backend
./mvnw spring-boot:run

# Em outro terminal, inicie o frontend
cd tyler-frontend
npm run dev
```

### **2. 🔄 Para migrar dados existentes:**

- A interface suporta **ambos** os formatos (antigo e novo)
- Produtos antigos com `imageUrl` são compatíveis
- Novos produtos usam array `images[]`

### **3. 🎨 Customizações disponíveis:**

- **Filtros adicionais** no ProductForm
- **Validações customizadas** no service
- **Layouts diferentes** para listagem
- **Bulk operations** (seleção múltipla)

---

## **⚠️ Considerações Importantes:**

### **🔒 Autenticação**

- Todas as requests usam **JWT token** do Firebase
- Headers automáticos via interceptor do Axios

### **📱 Responsividade**

- Interface **mobile-first**
- Upload funciona em **dispositivos móveis**
- Grids adaptativos para **tablets**

### **🚀 Performance**

- **Cursor pagination** O(1) vs O(n) tradicional
- **Cache local** dos produtos carregados
- **Lazy loading** de imagens implementado

### **🛡️ Validações**

- **Frontend**: Tipos, tamanhos, formatos
- **Backend**: Deve validar novamente (segurança)
- **Fallbacks**: Estados de erro bem definidos

---

## **🔗 Arquivos Modificados:**

1. **`.env`** - Variáveis de desenvolvimento
2. **`.env.production`** - Variáveis de produção
3. **`src/types/index.ts`** - Interfaces TypeScript
4. **`src/utils/services.ts`** - ProductsService completo
5. **`src/stores/products.ts`** - Store com cursor pagination
6. **`src/components/ui/ImageUpload.vue`** - Upload múltiplo
7. **`src/components/ui/index.ts`** - Export do ImageUpload
8. **`src/components/admin/ProductForm.vue`** - Formulário completo
9. **`src/views/admin/Products.vue`** - Interface admin moderna

✅ **Integração 100% completa e pronta para produção!**
