<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Produtos</h1>
        <p class="text-gray-600 mt-1">Gerencie os produtos solidários</p>
      </div>
      <div class="flex gap-2">
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
    <div class="mb-6 space-y-4">
      <!-- Linha 1: Busca e Preço -->
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Campo de Busca -->
        <div class="flex-1">
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                class="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              v-model="filters.searchTerm"
              @input="debouncedSearch"
              type="text"
              placeholder="Buscar produtos por nome ou descrição..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <!-- Filtro de Preço Mínimo -->
        <div class="w-full sm:w-40">
          <input
            v-model.number="filters.minPrice"
            @change="applyFilters"
            type="number"
            step="0.01"
            min="0"
            placeholder="Preço mín."
            class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Filtro de Preço Máximo -->
        <div class="w-full sm:w-40">
          <input
            v-model.number="filters.maxPrice"
            @change="applyFilters"
            type="number"
            step="0.01"
            min="0"
            placeholder="Preço máx."
            class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <!-- Linha 2: Categoria, Status e Ordenação -->
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Filtro por Categoria -->
          <select
            v-model="filters.category"
            @change="applyFilters"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option :value="undefined">Todos os status</option>
            <option :value="true">Apenas ativos</option>
            <option :value="false">Apenas inativos</option>
          </select>

          <!-- Ordenação -->
          <select
            v-model="filters.sortBy"
            @change="applyFilters"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <!-- Thumbnail Principal -->
                  <div
                    class="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center shadow-sm"
                  >
                    <img
                      v-if="getPrimaryImage(product)"
                      :src="getPrimaryImage(product)"
                      :alt="product.name"
                      class="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      @click="showImagePreview(product)"
                    />
                    <svg
                      v-else
                      class="w-8 h-8 text-gray-400"
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

                  <!-- Info do Produto -->
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-900">
                      {{ product.name }}
                    </div>
                    <div class="text-sm text-gray-500 truncate">
                      {{ product.description }}
                    </div>

                    <!-- Miniaturas adicionais -->
                    <div
                      v-if="getAdditionalImages(product).length > 0"
                      class="flex gap-1 mt-2"
                    >
                      <div
                        v-for="(image, index) in getAdditionalImages(
                          product
                        ).slice(0, 3)"
                        :key="image.id"
                        class="w-10 h-10 rounded overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity border border-gray-200"
                        @click="showImagePreview(product, index + 1)"
                      >
                        <img
                          :src="image.url"
                          :alt="`${product.name} - imagem ${index + 2}`"
                          class="w-full h-full object-cover"
                        />
                      </div>
                      <div
                        v-if="getAdditionalImages(product).length > 3"
                        class="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-medium cursor-pointer hover:bg-gray-300 transition-colors"
                        @click="showImagePreview(product)"
                      >
                        +{{ getAdditionalImages(product).length - 3 }}
                      </div>
                    </div>
                  </div>
                </div>
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

    <!-- Rodapé de Paginação -->
    <div
      v-if="!productsStore.loading && productsStore.products.length > 0"
      class="mt-6"
    >
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div
          class="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <!-- Info de Produtos -->
          <div class="text-sm text-gray-600">
            <span class="font-medium text-gray-900">{{
              productsStore.products.length
            }}</span>
            {{
              productsStore.products.length === 1
                ? "produto encontrado"
                : "produtos encontrados"
            }}
            <span v-if="currentPage > 1" class="text-gray-500">
              · Página {{ currentPage }}
            </span>
          </div>

          <!-- Controles de Paginação -->
          <div class="flex items-center gap-2">
            <!-- Botão Anterior -->
            <BaseButton
              v-if="productsStore.pagination.hasPrevious"
              variant="outline"
              size="sm"
              @click="goToPreviousPage"
              :disabled="productsStore.loading"
            >
              <svg
                class="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Anterior
            </BaseButton>

            <!-- Números de Página -->
            <div class="hidden sm:flex items-center gap-1">
              <button
                v-for="pageNum in visiblePages"
                :key="pageNum"
                @click="goToPage(pageNum)"
                :disabled="productsStore.loading || pageNum === currentPage"
                :class="[
                  'px-3 py-1 text-sm rounded-md transition-colors',
                  pageNum === currentPage
                    ? 'bg-tyler-blue text-white font-medium'
                    : 'text-gray-700 hover:bg-gray-100 disabled:opacity-50',
                ]"
              >
                {{ pageNum }}
              </button>
            </div>

            <!-- Botão Próximo -->
            <BaseButton
              v-if="productsStore.pagination.hasNext"
              variant="outline"
              size="sm"
              @click="goToNextPage"
              :disabled="productsStore.loading"
            >
              Próximo
              <svg
                class="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </BaseButton>
          </div>

          <!-- Tamanho da Página -->
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">Por página:</label>
            <select
              v-model.number="filters.limit"
              @change="changePageSize"
              class="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>
        </div>
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

    <!-- Modal de Confirmação de Exclusão -->
    <BaseModal v-model="showDeleteConfirm" size="sm" title="Confirmar Exclusão">
      <div class="text-center">
        <div
          class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4"
        >
          <svg
            class="h-6 w-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Excluir Produto</h3>
        <p class="text-sm text-gray-500 mb-2">
          Deseja realmente excluir o produto
        </p>
        <p class="text-sm font-medium text-gray-900 mb-6">
          "{{ productToDelete?.name }}"?
        </p>
        <p class="text-xs text-gray-500 mb-6">
          Esta ação não pode ser desfeita.
        </p>
        <div class="flex justify-center gap-3">
          <BaseButton variant="outline" @click="cancelDelete">
            Cancelar
          </BaseButton>
          <BaseButton
            variant="danger"
            @click="confirmDelete"
            :loading="deleting"
          >
            Excluir Produto
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
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
const showDeleteConfirm = ref(false);
const productToDelete = ref<Product | null>(null);
const deleting = ref(false);
const currentPage = ref(1);
const pageHistory = ref<string[]>([]);

const filters = reactive<ProductFilters>({
  limit: 20,
  sortBy: "CREATED_AT",
  sortDirection: "DESC",
  activeOnly: true,
  category: "",
  searchTerm: "",
  minPrice: undefined,
  maxPrice: undefined,
});

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

function debouncedSearch() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    applyFilters();
  }, 500);
}

const visiblePages = computed(() => {
  const pages = [currentPage.value];
  const maxVisible = 5;

  if (currentPage.value > 1) {
    pages.unshift(currentPage.value - 1);
  }

  if (productsStore.pagination.hasNext && pages.length < maxVisible) {
    pages.push(currentPage.value + 1);
  }

  if (currentPage.value > 2 && pages.length < maxVisible) {
    pages.unshift(currentPage.value - 2);
  }

  if (productsStore.pagination.hasNext && pages.length < maxVisible) {
    pages.push(currentPage.value + 2);
  }

  return pages.sort((a, b) => a - b);
});

function getPrimaryImage(product: Product): string | null {
  const primaryImage = product.images?.find((img) => img.isPrimary);
  return primaryImage?.url || product.images?.[0]?.url || null;
}

function getAdditionalImages(product: Product): ProductImage[] {
  if (!product.images || product.images.length <= 1) return [];
  const primaryImage = product.images.find((img) => img.isPrimary);
  return product.images.filter((img) => img.id !== primaryImage?.id);
}

function showImagePreview(product: Product, startIndex: number = 0) {
  console.log(
    "Preview de imagens para:",
    product.name,
    "iniciando em:",
    startIndex
  );
}

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
      if (images.length > 0 || imagesToDelete?.length || primaryImageId) {
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
        success = await productsStore.updateProduct(
          editingProduct.value.id,
          productData
        );
      }
    } else {
      if (images.length > 0) {
        success = await productsStore.createProductWithImages(
          productData,
          images,
          (progress) => {
            productFormRef.value?.updateProgress(progress);
          }
        );
      } else {
        success = await productsStore.createProduct(productData);
      }
    }

    if (success) {
      productFormRef.value?.finishProgress();
      hasUnsavedChanges.value = false;
      closeModal();
    }
  } catch (error) {
    console.error("Erro ao salvar produto:", error);

    productFormRef.value?.finishProgress();
  } finally {
    saving.value = false;
  }
}

async function deleteProduct(product: Product) {
  productToDelete.value = product;
  showDeleteConfirm.value = true;
}

async function confirmDelete() {
  if (!productToDelete.value) return;

  deleting.value = true;
  try {
    await productsStore.deleteProduct(productToDelete.value.id);
    showDeleteConfirm.value = false;
    productToDelete.value = null;
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
  } finally {
    deleting.value = false;
  }
}

function cancelDelete() {
  showDeleteConfirm.value = false;
  productToDelete.value = null;
}

async function applyFilters() {
  currentPage.value = 1;
  pageHistory.value = [];
  delete filters.cursor;
  await productsStore.fetchProductsPaginated(filters);
}

async function refreshProducts() {
  await productsStore.fetchProductsPaginated(filters);
}

async function goToNextPage() {
  if (!productsStore.pagination.hasNext || !productsStore.pagination.nextCursor)
    return;

  pageHistory.value.push(productsStore.pagination.nextCursor);
  currentPage.value++;

  await productsStore.fetchProductsPaginated({
    ...filters,
    cursor: productsStore.pagination.nextCursor,
    direction: "NEXT",
  });
}

async function goToPreviousPage() {
  if (currentPage.value <= 1) return;

  pageHistory.value.pop();
  currentPage.value--;

  const previousCursor = pageHistory.value[pageHistory.value.length - 1];

  await productsStore.fetchProductsPaginated({
    ...filters,
    cursor: previousCursor,
    direction: previousCursor ? "NEXT" : undefined,
  });
}

function goToPage(pageNum: number) {
  if (pageNum === currentPage.value) return;

  if (pageNum > currentPage.value) {
    goToNextPage();
  } else {
    goToPreviousPage();
  }
}

function changePageSize() {
  currentPage.value = 1;
  pageHistory.value = [];
  delete filters.cursor;
  applyFilters();
}

onMounted(() => {
  productsStore.fetchProductsPaginated(filters);
});
</script>
