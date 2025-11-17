import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  Product,
  ProductCreateRequest,
  ProductPaginationResponse,
  ProductFilters,
} from "@/types";
import { productsService } from "@/utils/services";
import { useToast } from "@/composables/useToast";

export const useProductsStore = defineStore("products", () => {
  const products = ref<Product[]>([]);
  const currentProduct = ref<Product | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const pagination = ref<{
    hasNext: boolean;
    nextCursor?: string;
    hasPrevious: boolean;
    previousCursor?: string;
    pageSize: number;
  }>({
    hasNext: false,
    hasPrevious: false,
    pageSize: 20,
  });

  const currentFilters = ref<ProductFilters>({
    limit: 20,
    sortBy: "createdAt",
    sortDirection: "DESC",
    activeOnly: true,
  });

  const activeProducts = computed(() =>
    products.value.filter((product) => product.active)
  );

  const productsByCategory = computed(() => {
    const grouped: Record<string, Product[]> = {};
    products.value.forEach((product) => {
      if (!grouped[product.category]) {
        grouped[product.category] = [];
      }
      grouped[product.category].push(product);
    });
    return grouped;
  });

  const availableCategories = computed(() =>
    [...new Set(products.value.map((product) => product.category))].sort()
  );

  async function fetchProductsPaginated(
    filters: ProductFilters = {},
    resetList: boolean = true
  ) {
    loading.value = true;
    error.value = null;

    try {
      const mergedFilters = { ...currentFilters.value, ...filters };

      let response: any;
      try {
        response = await productsService.getProductsPaginated(mergedFilters);
        console.log("Response from paginated API:", response);
      } catch (paginatedError) {
        console.warn(
          "Cursor pagination failed, falling back to traditional pagination:",
          paginatedError
        );

        const page = 1; // Para simplificar, sempre primeira página
        const pageSize = mergedFilters.limit || 20;
        const traditionalResponse = await productsService.getProducts(
          page,
          pageSize,
          mergedFilters.activeOnly,
          mergedFilters.category
        );

        response = {
          products: traditionalResponse.products,
          pageSize: pageSize,
          hasNext: traditionalResponse.products.length === pageSize,
          hasPrevious: false,
          nextCursor:
            traditionalResponse.products.length > 0
              ? traditionalResponse.products[
                  traditionalResponse.products.length - 1
                ].id
              : undefined,
        };
      }

      if (!response || !response.products) {
        throw new Error("Resposta da API inválida ou vazia");
      }

      console.log("Produtos recebidos no store:", response.products);
      response.products.forEach((product, index) => {
        console.log(`Produto ${index}:`, {
          id: product.id,
          name: product.name,
          images: product.images,
          hasImages: !!(product.images && product.images.length > 0),
        });
      });

      if (resetList) {
        products.value = response.products;
      } else {
        products.value.push(...response.products);
      }

      pagination.value = {
        hasNext: response.hasNext,
        nextCursor: response.nextCursor,
        hasPrevious: response.hasPrevious,
        previousCursor: response.previousCursor,
        pageSize: response.pageSize,
      };

      currentFilters.value = mergedFilters;
    } catch (err: any) {
      error.value = err.message || "Erro ao carregar produtos";
      console.error("Erro ao carregar produtos:", err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchNextPage() {
    if (!pagination.value.hasNext || !pagination.value.nextCursor) return;

    await fetchProductsPaginated(
      {
        ...currentFilters.value,
        cursor: pagination.value.nextCursor,
        direction: "NEXT",
      },
      false
    );
  }

  async function fetchPreviousPage() {
    if (!pagination.value.hasPrevious || !pagination.value.previousCursor)
      return;

    await fetchProductsPaginated(
      {
        ...currentFilters.value,
        cursor: pagination.value.previousCursor,
        direction: "PREVIOUS",
      },
      true
    );
  }

  async function fetchProducts(
    page: number = 1,
    pageSize: number = 20,
    activeOnly?: boolean,
    category?: string
  ) {
    loading.value = true;
    error.value = null;

    try {
      const response = await productsService.getProducts(
        page,
        pageSize,
        activeOnly,
        category
      );
      console.log("Response from products service:", response);

      if (!response || !response.products) {
        throw new Error("Resposta da API inválida ou sem produtos");
      }

      products.value = response.products;
    } catch (err: any) {
      error.value = err.message || "Erro ao carregar produtos";
      console.error("Erro ao carregar produtos:", err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchProduct(id: string): Promise<Product | null> {
    loading.value = true;
    error.value = null;

    try {
      const product = await productsService.getProductById(id);
      currentProduct.value = product;
      return product;
    } catch (err: any) {
      error.value = err.message || "Produto não encontrado";
      currentProduct.value = null;
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function createProduct(
    productData: ProductCreateRequest
  ): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const response = await productsService.createProduct(productData);
      console.log("Produto criado com sucesso!");

      await fetchProductsPaginated(currentFilters.value);
      return true;
    } catch (err: any) {
      error.value = err.message || "Erro ao criar produto";
      console.log(" Toast message ");
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function createProductWithImages(
    productData: ProductCreateRequest,
    images: File[],
    onProgress?: (progress: {
      step: string;
      current: number;
      total: number;
      percentage: number;
      message: string;
    }) => void
  ): Promise<boolean> {
    console.log(
      "🏪 [STORE] createProductWithImages called - UNIFIED METHOD ONLY"
    );
    console.log("📦 [STORE] Product data:", productData);
    console.log("🖼️ [STORE] Images count:", images.length);
    loading.value = true;
    error.value = null;
    const { success, error: showError } = useToast();

    try {
      const response = await productsService.createProductWithImages(
        productData,
        images,
        onProgress
      );

      success(
        `Produto "${productData.name}" criado com sucesso! ${response.imagesUploaded} imagem(ns) enviada(s).`
      );

      await fetchProductsPaginated(currentFilters.value);
      return true;
    } catch (err: any) {
      error.value = err.message || "Erro ao criar produto";
      showError(`Erro ao criar produto: ${err.message || "Erro desconhecido"}`);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function updateProduct(
    id: string,
    productData: Partial<ProductCreateRequest>
  ): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const updatedProduct = await productsService.updateProduct(
        id,
        productData
      );

      const index = products.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        products.value[index] = updatedProduct;
      }

      if (currentProduct.value?.id === id) {
        currentProduct.value = updatedProduct;
      }

      console.log(" Toast message ");
      return true;
    } catch (err: any) {
      error.value = err.message || "Erro ao atualizar produto";
      console.log(" Toast message ");
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function updateProductWithImages(
    id: string,
    productData: Partial<ProductCreateRequest>,
    imageChanges: {
      newImages?: File[];
      existingImages?: ProductImage[];
      imagesToDelete?: string[];
      primaryImageId?: string | null;
    }
  ): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const updatedProduct = await productsService.updateProductWithImages(
        id,
        productData,
        imageChanges
      );

      const index = products.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        products.value[index] = updatedProduct;
      }

      if (currentProduct.value?.id === id) {
        currentProduct.value = updatedProduct;
      }

      console.log(" Toast message ");
      return true;
    } catch (err: any) {
      error.value = err.message || "Erro ao atualizar produto com imagens";
      console.log(" Toast message ");
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function deleteProduct(id: string): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      await productsService.deleteProduct(id);

      products.value = products.value.filter((p) => p.id !== id);

      if (currentProduct.value?.id === id) {
        currentProduct.value = null;
      }

      console.log(" Toast message ");
      return true;
    } catch (err: any) {
      error.value = err.message || "Erro ao remover produto";
      console.log(" Toast message ");
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function uploadImageToProduct(
    productId: string,
    image: File,
    isPrimary: boolean = false
  ): Promise<boolean> {
    try {
      const response = await productsService.uploadImageToProduct(
        productId,
        image,
        isPrimary
      );
      console.log(" Toast message ");

      if (currentProduct.value?.id === productId) {
        await fetchProduct(productId);
      }

      return true;
    } catch (err: any) {
      console.log(" Toast message ");
      return false;
    }
  }

  async function removeImageFromProduct(
    productId: string,
    imageId: string
  ): Promise<boolean> {
    try {
      await productsService.removeImageFromProduct(productId, imageId);
      console.log(" Toast message ");

      if (currentProduct.value?.id === productId) {
        await fetchProduct(productId);
      }

      return true;
    } catch (err: any) {
      console.log(" Toast message ");
      return false;
    }
  }

  function clearState() {
    products.value = [];
    currentProduct.value = null;
    error.value = null;
    pagination.value = {
      hasNext: false,
      hasPrevious: false,
      pageSize: 20,
    };
  }

  function findProductById(id: string): Product | undefined {
    return products.value.find((product) => product.id === id);
  }

  return {
    products,
    currentProduct,
    loading,
    error,
    pagination,
    currentFilters,

    activeProducts,
    productsByCategory,
    availableCategories,

    fetchProductsPaginated,
    fetchNextPage,
    fetchPreviousPage,
    fetchProducts,

    fetchProduct,
    createProduct,
    createProductWithImages,
    updateProduct,
    updateProductWithImages,
    deleteProduct,

    uploadImageToProduct,
    removeImageFromProduct,

    clearState,
    findProductById,
  };
});
