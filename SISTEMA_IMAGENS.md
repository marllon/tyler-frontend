# Sistema de Gerenciamento de Imagens - Tyler Frontend

## 🎯 Visão Geral

Este sistema oferece uma solução completa e profissional para gerenciamento de imagens de produtos no frontend Tyler. Foi projetado com foco em UX/UI avançada, seguindo as melhores práticas de design e usabilidade.

## 📦 Componentes Implementados

### 1. ImageUpload.vue

**Localização**: `src/components/ui/ImageUpload.vue`

**Funcionalidades**:

- ✅ Drag & drop com animações fluidas
- ✅ Preview de imagens em tempo real
- ✅ Validação de tipo e tamanho de arquivo
- ✅ Upload em lote com progresso
- ✅ Seleção de imagem principal
- ✅ Interface responsiva e acessível
- ✅ Estados de erro e sucesso
- ✅ Cleanup automático de memória

**Props**:

```typescript
interface Props {
  maxFiles?: number; // Máximo de arquivos (padrão: 10)
  maxFileSize?: number; // Tamanho máximo em bytes (padrão: 10MB)
  allowedTypes?: string; // Tipos permitidos (padrão: image/jpeg,image/jpg,image/png,image/webp)
  modelValue?: File[]; // v-model com arquivos selecionados
}
```

### 2. ImageGallery.vue

**Localização**: `src/components/ui/ImageGallery.vue`

**Funcionalidades**:

- ✅ Visualização em tela cheia
- ✅ Navegação por thumbnails
- ✅ Controles de navegação (anterior/próximo)
- ✅ Atalhos de teclado (ESC, setas)
- ✅ Zoom e pan de imagens
- ✅ Estados de carregamento
- ✅ Suporte a múltiplos formatos
- ✅ Overlay com informações da imagem

### 3. ProductImageManager.vue

**Localização**: `src/components/ui/ProductImageManager.vue`

**Funcionalidades**:

- ✅ Gerenciamento de imagens existentes
- ✅ Reordenação por drag & drop
- ✅ Definição de imagem principal
- ✅ Remoção individual de imagens
- ✅ Preview em galeria integrada
- ✅ Confirmação de exclusão
- ✅ Indicadores visuais de status
- ✅ Suporte a URLs externas e locais

## 🔧 Integração nos Formulários

### ProductForm.vue Melhorado

**Localização**: `src/components/admin/ProductForm.vue`

O formulário de produtos foi aprimorado para suportar:

- **Modo Criação**: Upload de novas imagens
- **Modo Edição**: Gerenciamento de imagens existentes + upload de novas
- **Dados Completos**: Emite informações sobre mudanças nas imagens

```typescript
// Dados emitidos pelo formulário
interface SubmitData {
  productData: ProductCreateRequest;
  images: File[]; // Novas imagens
  existingImages?: ProductImage[]; // Imagens existentes modificadas
  imagesToDelete?: string[]; // IDs das imagens a deletar
  primaryImageId?: string | null; // ID da imagem principal
}
```

## 🏪 Store e Service Updates

### ProductsStore Aprimorado

**Localização**: `src/stores/products.ts`

Novo método adicionado:

```typescript
async updateProductWithImages(
  id: string,
  productData: Partial<ProductCreateRequest>,
  imageChanges: ImageChanges
): Promise<boolean>
```

### ProductsService Aprimorado

**Localização**: `src/utils/services.ts`

Novo endpoint para atualização completa:

```typescript
async updateProductWithImages(
  id: string,
  productData: Partial<ProductCreateRequest>,
  imageChanges: ImageChanges
): Promise<Product>
```

## 🎨 Design e UX Features

### Animações e Interações

- **Micro-interações**: Hover effects, transforms, transitions suaves
- **Feedback Visual**: Estados de loading, sucesso e erro
- **Drag & Drop**: Indicadores visuais durante o arraste
- **Responsividade**: Layout adaptável para mobile e desktop

### Acessibilidade

- **Navegação por teclado**: Suporte completo a atalhos
- **ARIA Labels**: Descrições para leitores de tela
- **Contraste**: Cores otimizadas para legibilidade
- **Focus Management**: Indicadores visuais de foco

### Performance

- **Lazy Loading**: Carregamento otimizado de imagens
- **Memory Management**: Cleanup automático de URLs de blob
- **Debounce**: Validações otimizadas
- **Compression**: Otimização de previews

## 📱 Demonstração

### Acesso à Demo

Uma página de demonstração foi criada mostrando todos os componentes em ação:

**URL**: `/image-system-demo`
**Componente**: `src/views/ImageSystemDemo.vue`

A demo inclui:

1. **Upload para novo produto** - Componente ImageUpload
2. **Galeria interativa** - Componente ImageGallery
3. **Gerenciamento de produto existente** - Componente ProductImageManager
4. **Exemplo de integração** - Código do ProductForm

## 🚀 Como Usar

### 1. Import dos Componentes

```typescript
import {
  ImageUpload,
  ImageGallery,
  ProductImageManager,
} from "@/components/ui";
```

### 2. Upload Básico

```vue
<ImageUpload
  v-model="selectedFiles"
  :max-files="10"
  :max-file-size="5242880"
  allowed-types="image/jpeg,image/png,image/webp"
  @validation-change="onValidationChange"
/>
```

### 3. Galeria de Imagens

```vue
<ImageGallery
  v-if="showGallery"
  :images="galleryImages"
  :initial-index="currentIndex"
  @close="closeGallery"
/>
```

### 4. Gerenciamento de Produto

```vue
<ProductImageManager
  :images="productImages"
  @update:images="updateImages"
  @primary-changed="onPrimaryChanged"
  @image-deleted="onImageDeleted"
  @images-reordered="onImagesReordered"
/>
```

## 🔄 Fluxo de Trabalho

### Criação de Produto

1. Usuário arrasta/seleciona imagens no **ImageUpload**
2. Preview instantâneo com validação
3. Definição opcional de imagem principal
4. Submit envia `File[]` para o backend

### Edição de Produto

1. **ProductImageManager** mostra imagens existentes
2. Usuário pode reordenar, deletar ou definir principal
3. **ImageUpload** adicional para novas imagens
4. Submit envia dados completos de modificações

### Visualização

1. **ImageGallery** para preview profissional
2. Fullscreen com navegação
3. Thumbnails para navegação rápida
4. Controles de teclado

## 🎯 Próximos Passos

### Melhorias Futuras

- [ ] Suporte a upload de vídeos
- [ ] Edição básica de imagens (crop, rotate)
- [ ] Integração com CDN para otimização
- [ ] Suporte a Progressive Web App
- [ ] Analytics de uso das imagens

### Backend Integration

- [ ] Implementar endpoint `/products/{id}/with-images`
- [ ] Suporte a operações em lote
- [ ] Otimização de imagens server-side
- [ ] Backup e versionamento de imagens

## 🏆 Benefícios

### Para Usuários

- **Experiência Intuitiva**: Interface familiar com drag & drop
- **Feedback Imediato**: Validação e preview instantâneos
- **Eficiência**: Operações em lote e navegação rápida
- **Profissionalismo**: Design polido e responsivo

### Para Desenvolvedores

- **Reutilização**: Componentes modulares e configuráveis
- **Manutenibilidade**: Código bem estruturado e documentado
- **Extensibilidade**: Fácil de estender e personalizar
- **Type Safety**: TypeScript completo em todos os componentes

---

## 📞 Suporte

Este sistema foi desenvolvido com foco na experiência do usuário e facilidade de manutenção. Para dúvidas ou melhorias, consulte:

- **Documentação**: Este arquivo
- **Código de exemplo**: `/image-system-demo`
- **Componentes**: `src/components/ui/`
- **Types**: `src/types/index.ts`
