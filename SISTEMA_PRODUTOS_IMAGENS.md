# Sistema de Gerenciamento de Produtos com Imagens - Tyler Frontend

## 📋 Visão Geral

O sistema está completamente integrado e funcional para gerenciar produtos com múltiplas imagens no Tyler. Cada produto pode ter:

- **Múltiplas imagens** (até 10 por produto)
- **Uma imagem principal** (destacada nas listagens)
- **Upload drag & drop** de novas imagens
- **Reordenação** de imagens existentes
- **Edição e exclusão** de imagens

## 🚀 Como Usar

### 1. Acessar a Administração de Produtos

**URL:** `http://localhost:5173/admin/products`

- **Login necessário:** Sim (funcionalidade administrativa)
- **Funcionalidades:** Listar, criar, editar e excluir produtos

### 2. Interface Administrativa

#### Lista de Produtos

- Mostra **imagem principal** (thumbnail)
- Contador de **quantas imagens** cada produto possui
- **Preview rápido** das imagens na coluna do produto

#### Criando Novo Produto

1. Clique em **"Novo Produto"**
2. Preencha as informações básicas
3. Na seção **"Imagens do Produto"**:
   - Arraste e solte imagens ou clique para selecionar
   - Preview imediato das imagens selecionadas
   - Primeira imagem é automaticamente definida como principal

#### Editando Produto Existente

1. Clique em **"Editar"** no produto desejado
2. **Gerenciar Imagens Existentes:**
   - ⭐ Definir qual é a **imagem principal** (clique na estrela)
   - 🔄 **Reordenar** imagens (arraste e solte)
   - 🔍 **Visualizar em tela cheia** (clique na imagem)
   - 🗑️ **Excluir** imagens (clique no X vermelho)
3. **Adicionar Novas Imagens:**
   - Use a seção "Adicionar Novas Imagens" no final do formulário
   - Mesmo sistema de drag & drop

## 🛠️ Estrutura Técnica

### Tipos de Dados

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  active: boolean;
  images?: ProductImage[];
  // ... outros campos
}

interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  uploadedAt: string;
}
```

### Componentes Principais

#### 1. **ProductForm.vue** (`src/components/admin/ProductForm.vue`)

- Formulário completo de produto com gerenciamento de imagens
- Modo criação e edição
- Integração com ImageUpload e ProductImageManager

#### 2. **ImageUpload.vue** (`src/components/ui/ImageUpload.vue`)

- Upload drag & drop de múltiplas imagens
- Validação de tipo e tamanho
- Preview das imagens antes do envio
- Suporte a até 10 imagens simultâneas

#### 3. **ProductImageManager.vue** (`src/components/ui/ProductImageManager.vue`)

- Gerenciamento de imagens existentes
- Definir imagem principal (estrela dourada)
- Reordenação por drag & drop
- Preview em tela cheia
- Exclusão de imagens

#### 4. **ImageGallery.vue** (`src/components/ui/ImageGallery.vue`)

- Galeria com fullscreen
- Navegação por teclado (setas, ESC)
- Thumbnails clicáveis
- Responsive design

### Store e Services

#### Products Store (`src/stores/products.ts`)

- `createProduct()` - Criar produto básico
- `createProductWithImages()` - Criar produto com imagens
- `updateProduct()` - Atualizar dados do produto
- `updateProductWithImages()` - Atualizar produto e imagens
- `deleteProduct()` - Excluir produto

#### Products Service (`src/utils/services.ts`)

- Métodos para comunicação com API
- Upload de imagens
- Gerenciamento de imagens existentes

## 🎯 Funcionalidades Específicas

### Imagem Principal

- **Automática:** Primeira imagem carregada é definida como principal
- **Manual:** Usuário pode alterar clicando na estrela (⭐/⭐)
- **Listagem:** Imagem principal aparece nas listas de produtos

### Validações

- **Tipos aceitos:** JPG, JPEG, PNG, GIF, WebP
- **Tamanho máximo:** 10MB por imagem
- **Quantidade máxima:** 10 imagens por produto
- **Mensagens de erro:** Feedback visual imediato

### UX/UI Features

- **Drag & Drop:** Interface intuitiva para upload
- **Preview:** Ver imagens antes de salvar
- **Loading States:** Spinners durante uploads
- **Responsive:** Funciona em mobile e desktop
- **Keyboard Navigation:** Suporte completo por teclado

## 📱 Rotas Disponíveis

### Público

- `/products` - Lista de produtos (frontend público)

### Administrativo

- `/admin/products` - Gerenciamento completo de produtos
- `/admin/login` - Login administrativo

### Demo/Teste

- `/image-system-demo` - Página de demonstração dos componentes

## 🔧 Integração com Backend

O sistema está preparado para integração com o backend Tyler através dos endpoints:

- `POST /api/products` - Criar produto
- `POST /api/products/{id}/images` - Upload de imagens
- `PUT /api/products/{id}` - Atualizar produto
- `DELETE /api/products/{id}/images/{imageId}` - Excluir imagem
- `PUT /api/products/{id}/images/{imageId}/primary` - Definir principal

## ✅ Status do Desenvolvimento

- ✅ **Interface completa** de gerenciamento de produtos
- ✅ **Upload múltiplo** com drag & drop
- ✅ **Gerenciamento de imagens** existentes
- ✅ **Definição de imagem principal**
- ✅ **Reordenação** de imagens
- ✅ **Preview e galeria** completa
- ✅ **Integração com stores** e services
- ✅ **Validações e feedback** de usuário
- ✅ **Design responsivo** e profissional

## 🎉 Próximos Passos

O sistema está **100% funcional** para uso. As próximas melhorias podem incluir:

1. **Otimização de imagens** (resize automático)
2. **Lazy loading** para listas com muitas imagens
3. **Bulk operations** (ações em lote)
4. **CDN integration** para performance
5. **Análise de uso** de imagens

---

**Sistema desenvolvido com foco em UX profissional e integração completa com o backend Tyler.**
