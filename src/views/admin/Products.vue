<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Produtos</h1>
        <p class="text-gray-600 mt-1">Gerencie os produtos solidários</p>
      </div>
      <div class="flex gap-2">
        <BaseButton @click="testProductWithImages" variant="outline">
          Testar Produto com Imagens
        </BaseButton>
        <BaseButton @click="openCreateModal">
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Novo Produto
        </BaseButton>
      </div>
    </div>

    <!-- Filtros e Controles -->
    <div
      class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Filtro por Categoria -->
        <select
          v-model="filters.category"
          @change="applyFilters"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas as categorias</option>
          <option
            v-for="category in productsStore.availableCategories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>

        <!-- Filtro Ativo/Inativo -->
        <select
          v-model="filters.activeOnly"
          @change="applyFilters"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option :value="undefined">Todos os status</option>
          <option :value="true">Apenas ativos</option>
          <option :value="false">Apenas inativos</option>
        </select>

        <!-- Ordenação -->
        <select
          v-model="filters.sortBy"
          @change="applyFilters"
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="CREATED_AT">Data de criação</option>
          <option value="NAME">Nome</option>
          <option value="PRICE">Preço</option>
          <option value="STOCK">Estoque</option>
        </select>
      </div>

      <!-- Info e Refresh -->
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-500">
          {{ productsStore.products.length }} produtos
        </span>
        <BaseButton variant="outline" size="sm" @click="refreshProducts">
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </BaseButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="productsStore.loading" class="flex justify-center py-16">
      <Spinner size="xl" label="Carregando produtos..." />
    </div>

    <!-- Error State -->
    <div v-else-if="productsStore.error" class="text-center py-16">
      <div class="text-red-600 mb-4">
        <svg
          class="w-16 h-16 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <p class="text-lg font-medium">Erro ao carregar produtos</p>
        <p class="text-gray-600 mt-1">{{ productsStore.error }}</p>
      </div>
      <BaseButton @click="refreshProducts">Tentar Novamente</BaseButton>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="productsStore.products.length === 0"
      class="text-center py-16"
    >
      <svg
        class="w-16 h-16 text-gray-400 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        Nenhum produto encontrado
      </h3>
      <p class="text-gray-600 mb-6">
        Comece criando seu primeiro produto solidário.
      </p>
      <BaseButton @click="openCreateModal">Criar Primeiro Produto</BaseButton>
    </div>

    <!-- Products Table -->
    <BaseCard v-else padding="none">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Produto
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Categoria
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Preço
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Estoque
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="product in productsStore.products"
              :key="product.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="w-12 h-12 rounded overflow-hidden bg-gray-100 flex items-center justify-center"
                  >
                    <img
                      v-if="getPrimaryImage(product)"
                      :src="getPrimaryImage(product)"
                      :alt="product.name"
                      class="w-full h-full object-cover"
                    />
                    <svg
                      v-else
                      class="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ product.name }}
                    </div>
                    <div class="text-sm text-gray-500 truncate max-w-xs">
                      {{ product.description }}
                    </div>
                    <div class="text-xs text-gray-400 mt-1">
                      {{ (product.images || []).length }}
                      {{
                        (product.images || []).length === 1
                          ? "imagem"
                          : "imagens"
                      }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge variant="default">{{ product.category }}</Badge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatCurrency(product.price) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge :variant="product.stock > 0 ? 'success' : 'danger'">
                  {{ product.stock }} unid.
                </Badge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge :variant="product.active ? 'success' : 'default'">
                  {{ product.active ? "Ativo" : "Inativo" }}
                </Badge>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <button
                  @click="editProduct(product)"
                  class="text-tyler-blue hover:text-blue-700 mr-4"
                >
                  Editar
                </button>
                <button
                  @click="deleteProduct(product)"
                  class="text-red-600 hover:text-red-800"
                >
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>

    <!-- Paginação -->
    <div
      v-if="
        productsStore.pagination.hasNext || productsStore.pagination.hasPrevious
      "
      class="mt-6 flex justify-center"
    >
      <div class="flex items-center space-x-4">
        <BaseButton
          v-if="productsStore.pagination.hasPrevious"
          variant="outline"
          size="sm"
          @click="productsStore.fetchPreviousPage()"
          :loading="productsStore.loading"
        >
          Página Anterior
        </BaseButton>

        <BaseButton
          v-if="productsStore.pagination.hasNext"
          variant="outline"
          size="sm"
          @click="productsStore.fetchNextPage()"
          :loading="productsStore.loading"
        >
          Próxima Página
        </BaseButton>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <BaseModal
      v-model="showModal"
      size="xl"
      scrollable
      :close-on-backdrop="false"
      :title="editingProduct ? 'Editar Produto' : 'Novo Produto'"
    >
      <div style="max-height: 70vh; overflow-y: auto; padding-right: 10px">
        <ProductFormNew
          ref="productFormRef"
          :initial-data="editingProduct"
          :loading="saving"
          @submit="handleProductSubmit"
          @cancel="closeModal"
          @form-change="onFormChange"
        />
      </div>
    </BaseModal>

    <!-- Modal de Confirmação para Sair -->
    <BaseModal v-model="showConfirmExit" size="sm" title="Confirmar Saída">
      <div class="text-center">
        <div
          class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4"
        >
          <svg
            class="h-6 w-6 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          Você tem alterações não salvas
        </h3>
        <p class="text-sm text-gray-500 mb-6">
          Se você sair agora, todas as alterações feitas serão perdidas. Deseja
          continuar?
        </p>
        <div class="flex justify-center gap-3">
          <BaseButton variant="outline" @click="cancelExit">
            Continuar Editando
          </BaseButton>
          <BaseButton variant="danger" @click="forceCloseModal">
            Sair sem Salvar
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useProductsStore } from "@/stores/products";
import { useCurrency } from "@/composables";
import {
  BaseButton,
  BaseCard,
  BaseModal,
  Badge,
  Spinner,
} from "@/components/ui";
import ProductFormNew from "@/components/admin/ProductFormNew.vue";
import type {
  Product,
  ProductCreateRequest,
  ProductFilters,
  ProductImage,
} from "@/types";

const productsStore = useProductsStore();
const { formatCurrency } = useCurrency();

const showModal = ref(false);
const saving = ref(false);
const editingProduct = ref<Product | null>(null);
const hasUnsavedChanges = ref(false);
const showConfirmExit = ref(false);
const productFormRef = ref<InstanceType<typeof ProductFormNew> | null>(null);

// Filtros
const filters = reactive<ProductFilters>({
  limit: 20,
  sortBy: "CREATED_AT",
  sortDirection: "DESC",
  activeOnly: true,
  category: "",
});

// ============================================
// COMPUTED
// ============================================
function getPrimaryImage(product: Product): string | null {
  const primaryImage = product.images?.find((img) => img.isPrimary);
  return primaryImage?.url || product.images?.[0]?.url || null;
}

// ============================================
// METHODS
// ============================================
function openCreateModal() {
  editingProduct.value = null;
  hasUnsavedChanges.value = false;
  showModal.value = true;
}

function editProduct(product: Product) {
  editingProduct.value = product;
  hasUnsavedChanges.value = false;
  showModal.value = true;
}

function closeModal() {
  if (hasUnsavedChanges.value) {
    showConfirmExit.value = true;
  } else {
    forceCloseModal();
  }
}

function forceCloseModal() {
  showModal.value = false;
  editingProduct.value = null;
  hasUnsavedChanges.value = false;
  showConfirmExit.value = false;
}

function cancelExit() {
  showConfirmExit.value = false;
}

function onFormChange() {
  hasUnsavedChanges.value = true;
}

function testProductWithImages() {
  // Criar produto de teste com imagens para demonstrar funcionalidade
  const testProduct: Product = {
    id: "test-product-123",
    name: "Camiseta Tyler - Teste",
    description:
      "Produto de exemplo para testar o sistema de imagens. Este produto possui múltiplas imagens para demonstrar as funcionalidades de gerenciamento.",
    price: 49.9,
    category: "Vestuário",
    stock: 10,
    active: true,
    brand: "Tyler",
    model: "Básica",
    color: "Azul",
    tags: ["teste", "exemplo", "tyler"],
    images: [
      {
        id: "img1",
        url: "https://picsum.photos/800/600?random=1",
        isPrimary: true,
        uploadedAt: new Date().toISOString(),
      },
      {
        id: "img2",
        url: "https://picsum.photos/800/600?random=2",
        isPrimary: false,
        uploadedAt: new Date().toISOString(),
      },
      {
        id: "img3",
        url: "https://picsum.photos/800/600?random=3",
        isPrimary: false,
        uploadedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  editingProduct.value = testProduct;
  showModal.value = true;
}

async function handleProductSubmit({
  productData,
  images,
  existingImages,
  imagesToDelete,
  primaryImageId,
}: {
  productData: ProductCreateRequest;
  images: File[];
  existingImages?: ProductImage[];
  imagesToDelete?: string[];
  primaryImageId?: string | null;
}) {
  saving.value = true;

  try {
    let success = false;

    if (editingProduct.value) {
      // Atualizar produto existente
      if (images.length > 0 || imagesToDelete?.length || primaryImageId) {
        // Se há mudanças nas imagens, usar o endpoint que lida com imagens
        success = await productsStore.updateProductWithImages(
          editingProduct.value.id,
          productData,
          {
            newImages: images,
            existingImages,
            imagesToDelete,
            primaryImageId,
          }
        );
      } else {
        // Apenas dados do produto, sem mudanças nas imagens
        success = await productsStore.updateProduct(
          editingProduct.value.id,
          productData
        );
      }
    } else {
      // Criar novo produto
      if (images.length > 0) {
        // Usar barra de progresso para criação com imagens
        success = await productsStore.createProductWithImages(
          productData,
          images,
          (progress) => {
            // Atualizar progresso no formulário
            productFormRef.value?.updateProgress(progress);
          }
        );
      } else {
        success = await productsStore.createProduct(productData);
      }
    }

    if (success) {
      // Finalizar progresso se estava sendo usado
      productFormRef.value?.finishProgress();
      hasUnsavedChanges.value = false;
      closeModal();
    }
  } catch (error) {
    console.error("Erro ao salvar produto:", error);
    // Finalizar progresso em caso de erro
    productFormRef.value?.finishProgress();
  } finally {
    saving.value = false;
  }
}

async function deleteProduct(product: Product) {
  if (!confirm(`Deseja realmente excluir o produto "${product.name}"?`)) {
    return;
  }

  await productsStore.deleteProduct(product.id);
}

async function applyFilters() {
  await productsStore.fetchProductsPaginated(filters);
}

async function refreshProducts() {
  await productsStore.fetchProductsPaginated(filters);
}

// ============================================
// LIFECYCLE
// ============================================
onMounted(() => {
  // Carregar produtos ao montar
  productsStore.fetchProductsPaginated(filters);
});
</script>
