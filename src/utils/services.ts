import { api } from "@/utils/api";
import type {
  HealthResponse,
  PixPaymentRequest,
  PixPaymentResponse,
  PaymentStatusResponse,
  Product,
  ProductCreateRequest,
  ProductPaginationResponse,
  ProductTraditionalPaginationResponse,
  ProductFilters,
  ImageUploadResponse,
} from "@/types";

// ============================================
// Health Check Service
// ============================================
export const healthService = {
  /**
   * Verifica o status da API
   */
  async checkHealth(): Promise<HealthResponse> {
    return api.get<HealthResponse>("/health");
  },
};

// ============================================
// Payment Service (PIX)
// ============================================
export const paymentService = {
  /**
   * Criar checkout PIX
   */
  async createPixCheckout(
    data: PixPaymentRequest
  ): Promise<PixPaymentResponse> {
    return api.post<PixPaymentResponse>("/payments/checkout", data);
  },

  /**
   * Consultar status do pagamento
   */
  async getPaymentStatus(
    transactionId: string
  ): Promise<PaymentStatusResponse> {
    return api.get<PaymentStatusResponse>(`/payments/${transactionId}/status`);
  },

  /**
   * Polling para verificar status do pagamento
   * @param transactionId ID da transação
   * @param onStatusUpdate Callback chamado a cada atualização
   * @param maxAttempts Número máximo de tentativas (default: 60)
   * @param interval Intervalo entre tentativas em ms (default: 5000)
   */
  async pollPaymentStatus(
    transactionId: string,
    onStatusUpdate: (status: PaymentStatusResponse) => void,
    maxAttempts: number = 60,
    interval: number = 5000
  ): Promise<PaymentStatusResponse> {
    return new Promise((resolve, reject) => {
      let attempts = 0;

      const poll = async () => {
        try {
          attempts++;
          const status = await this.getPaymentStatus(transactionId);
          onStatusUpdate(status);

          // Payment completed successfully
          if (status.status === "PAID") {
            resolve(status);
            return;
          }

          // Payment failed or cancelled
          if (
            status.status === "FAILED" ||
            status.status === "CANCELLED" ||
            status.status === "EXPIRED"
          ) {
            reject(new Error(`Pagamento ${status.status.toLowerCase()}`));
            return;
          }

          // Continue polling if still waiting and under max attempts
          if (attempts < maxAttempts && status.status === "WAITING_PAYMENT") {
            setTimeout(poll, interval);
          } else if (attempts >= maxAttempts) {
            reject(
              new Error(
                "Timeout: Pagamento não foi confirmado no tempo esperado"
              )
            );
          }
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  },
};

// ============================================
// Products Service
// ============================================
class ProductsService {
  private readonly baseUrl: string;
  private readonly maxImageSize: number;
  private readonly maxImagesPerProduct: number;
  private readonly allowedImageTypes: string[];

  constructor() {
    this.baseUrl =
      import.meta.env.VITE_API_PRODUCTS_URL ||
      "http://localhost:8080/api/products";
    this.maxImageSize = parseInt(
      import.meta.env.VITE_MAX_IMAGE_SIZE || "10485760"
    ); // 10MB
    this.maxImagesPerProduct = parseInt(
      import.meta.env.VITE_MAX_IMAGES_PER_PRODUCT || "10"
    );
    this.allowedImageTypes = (
      import.meta.env.VITE_ALLOWED_IMAGE_TYPES ||
      "image/jpeg,image/jpg,image/png,image/webp"
    ).split(",");
  }

  // ============================================
  // LISTAGEM DE PRODUTOS
  // ============================================

  /**
   * Lista produtos usando cursor pagination (RECOMENDADO)
   */
  async getProductsPaginated(
    filters: ProductFilters = {}
  ): Promise<ProductPaginationResponse> {
    const params = new URLSearchParams();

    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.cursor) params.append("cursor", filters.cursor);
    if (filters.direction) params.append("direction", filters.direction);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortDirection)
      params.append("sortDirection", filters.sortDirection);
    if (filters.activeOnly !== undefined)
      params.append("activeOnly", filters.activeOnly.toString());
    if (filters.category) params.append("category", filters.category);

    // api.get() já retorna response.data, não o response completo
    const apiData = await api.get<any>(
      `/products/paginated?${params.toString()}`
    );
    console.log("Raw API response data:", apiData);

    if (!apiData) {
      console.error("API response data is null/undefined:", apiData);
      throw new Error("API não retornou dados válidos");
    }

    if (!apiData.products) {
      console.error(
        "API data missing products field. Available fields:",
        Object.keys(apiData)
      );
      throw new Error(
        "API não retornou produtos válidos - campo products não encontrado"
      );
    }

    // Normalizar produtos para garantir estrutura consistente
    const normalizedProducts = apiData.products.map((product: any) => ({
      ...product,
      images: product.images || [], // Garantir que images seja sempre um array
      tags: product.tags || [], // Garantir que tags seja sempre um array
    }));

    // Mapear para nossa interface
    const mappedResponse: ProductPaginationResponse = {
      products: normalizedProducts,
      pageSize: apiData.pageSize || 20,
      hasNext: apiData.hasNext || false,
      hasPrevious: false, // API não retorna este campo ainda
      nextCursor: apiData.hasNext
        ? normalizedProducts[normalizedProducts.length - 1]?.id
        : undefined,
      previousCursor: undefined,
    };

    return mappedResponse;
  }

  /**
   * Lista produtos usando paginação tradicional (para compatibilidade)
   */
  async getProducts(
    page: number = 1,
    pageSize: number = 20,
    activeOnly?: boolean,
    category?: string
  ): Promise<ProductTraditionalPaginationResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());
    if (activeOnly !== undefined)
      params.append("activeOnly", activeOnly.toString());
    if (category) params.append("category", category);

    // api.get() já retorna response.data
    const apiData = await api.get<any>(`/products?${params.toString()}`);

    // Normalizar produtos para garantir estrutura consistente
    const normalizedProducts = (apiData.products || []).map((product: any) => ({
      ...product,
      images: product.images || [], // Garantir que images seja sempre um array
      tags: product.tags || [], // Garantir que tags seja sempre um array
    }));

    return {
      ...apiData,
      products: normalizedProducts,
    };
  }

  // ============================================
  // OPERAÇÕES INDIVIDUAIS
  // ============================================

  /**
   * Busca produto por ID
   */
  async getProductById(id: string): Promise<Product> {
    const product = await api.get<Product>(`/products/${id}`);
    return product;
  }

  /**
   * Cria novo produto (SEM imagens) - usando multipart para compatibilidade
   * CACHE BUST: v2.0
   */
  async createProduct(
    productData: ProductCreateRequest
  ): Promise<{ id: string; message: string }> {
    console.log(
      "🔄 [CREATE PRODUCT] Creating product without images using FormData"
    );

    // Usar FormData mesmo sem imagens para compatibilidade com o backend
    const formData = new FormData();
    formData.append("productData", JSON.stringify(productData));
    // Não adicionar imagens (array vazio)

    console.log(
      "🚀 [CREATE PRODUCT] Sending POST request to /products with FormData"
    );
    const result = await api.post(`/products`, formData, {});

    console.log("✅ [CREATE PRODUCT] Product created:", result);
    return result;
  }

  /**
   * Cria novo produto COM imagens usando endpoint unificado
   * CACHE BUST: v2.0
   */
  async createProductWithImages(
    productData: ProductCreateRequest,
    images: File[],
    onProgress?: (progress: {
      step: string;
      current: number;
      total: number;
      percentage: number;
      message: string;
    }) => void
  ): Promise<{ id: string; message: string; imagesUploaded: number }> {
    console.log("🏪 [UNIFIED-v2] createProductWithImages called");
    console.log(
      "📦 [UNIFIED-v2] Product data (FULL):",
      JSON.stringify(productData, null, 2)
    );
    console.log("🖼️ [UNIFIED-v2] Images count:", images.length);
    this.validateImages(images);

    const totalSteps = 1; // Apenas 1 step agora - criação unificada
    let currentStep = 0;

    const updateProgress = (step: string, message: string) => {
      currentStep++;
      const percentage = Math.round((currentStep / totalSteps) * 100);
      onProgress?.({
        step,
        current: currentStep,
        total: totalSteps,
        percentage,
        message,
      });
    };

    try {
      console.log(
        "🔄 [UNIFIED-v2] Creating product with images using multipart endpoint..."
      );
      updateProgress(
        "create-product-with-images",
        "Criando produto com imagens..."
      );

      // Usar FormData para enviar produto + imagens juntos
      const formData = new FormData();

      // Filtrar apenas campos que o backend aceita (baseado no curl de exemplo)
      // VERSÃO 2 - APENAS CAMPOS BÁSICOS
      const backendProductData = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        stock: productData.stock,
      };

      console.log(
        "🔧 [UNIFIED-v2] Backend product data:",
        JSON.stringify(backendProductData, null, 2)
      );
      formData.append("productData", JSON.stringify(backendProductData));

      // Adicionar imagens se existirem
      if (images && images.length > 0) {
        console.log(
          `📤 [UNIFIED METHOD] Adding ${images.length} images to FormData`
        );
        images.forEach((image, index) => {
          formData.append("images", image);
          console.log(`  - Image ${index + 1}: ${image.name}`);
        });
      } else {
        console.log("📤 [UNIFIED METHOD] No images to add");
      }

      console.log(
        "🚀 [UNIFIED METHOD] Sending POST request to /products with FormData"
      );
      const result = await api.post(`/products`, formData, {});

      const finalResult = {
        id: result.id,
        message: result.message || "Produto criado com sucesso!",
        imagesUploaded: images.length,
      };

      console.log(
        "🎉 [UNIFIED METHOD] Product created successfully:",
        finalResult
      );
      return finalResult;
    } catch (error) {
      console.error(
        "❌ [UNIFIED METHOD] Error in createProductWithImages:",
        error
      );
      throw error;
    }
  }

  /**
   * Atualiza produto existente (não inclui imagens)
   */
  async updateProduct(
    id: string,
    productData: Partial<ProductCreateRequest>
  ): Promise<Product> {
    const response = await api.put<Product>(`/products/${id}`, productData);
    return response;
  }

  /**
   * Atualiza produto com gerenciamento completo de imagens
   */
  async updateProductWithImages(
    id: string,
    productData: Partial<ProductCreateRequest>,
    imageChanges: {
      newImages?: File[];
      existingImages?: ProductImage[];
      imagesToDelete?: string[];
      primaryImageId?: string | null;
    }
  ): Promise<Product> {
    const formData = new FormData();

    // Adicionar dados do produto como blob com Content-Type application/json
    const productBlob = new Blob([JSON.stringify(productData)], {
      type: "application/json",
    });
    formData.append("product", productBlob);

    // Adicionar novas imagens
    if (imageChanges.newImages?.length) {
      imageChanges.newImages.forEach((file, index) => {
        formData.append(`newImages`, file);
      });
    }

    // Adicionar informações sobre imagens existentes
    if (imageChanges.existingImages?.length) {
      formData.append(
        "existingImages",
        JSON.stringify(imageChanges.existingImages)
      );
    }

    // Adicionar lista de imagens para deletar
    if (imageChanges.imagesToDelete?.length) {
      formData.append(
        "imagesToDelete",
        JSON.stringify(imageChanges.imagesToDelete)
      );
    }

    // Adicionar ID da imagem principal
    if (imageChanges.primaryImageId) {
      formData.append("primaryImageId", imageChanges.primaryImageId);
    }

    const response = await api.put<Product>(
      `/products/${id}/with-images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  }

  /**
   * Remove produto
   */
  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  }

  // ============================================
  // GERENCIAMENTO DE IMAGENS
  // ============================================

  /**
   * Adiciona imagem a produto existente
   */
  async uploadImageToProduct(
    productId: string,
    image: File,
    isPrimary: boolean = false
  ): Promise<ImageUploadResponse> {
    this.validateImages([image]);

    const formData = new FormData();
    formData.append("file", image);
    formData.append("isPrimary", isPrimary.toString());

    const response = await api.post<ImageUploadResponse>(
      `/products/${productId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  }

  /**
   * Remove imagem de produto
   */
  async removeImageFromProduct(
    productId: string,
    imageId: string
  ): Promise<void> {
    await api.delete(`/products/${productId}/images/${imageId}`);
  }

  // ============================================
  // VALIDAÇÕES E UTILIDADES
  // ============================================

  /**
   * Valida arquivos de imagem
   */
  private validateImages(images: File[]): void {
    if (images.length > this.maxImagesPerProduct) {
      throw new Error(
        `Máximo de ${this.maxImagesPerProduct} imagens por produto`
      );
    }

    images.forEach((image, index) => {
      // Verifica tipo
      if (!this.allowedImageTypes.includes(image.type)) {
        throw new Error(
          `Imagem ${
            index + 1
          }: Tipo não permitido. Tipos aceitos: ${this.allowedImageTypes.join(
            ", "
          )}`
        );
      }

      // Verifica tamanho
      if (image.size > this.maxImageSize) {
        const maxSizeMB = (this.maxImageSize / 1024 / 1024).toFixed(1);
        throw new Error(
          `Imagem ${index + 1}: Tamanho muito grande. Máximo: ${maxSizeMB}MB`
        );
      }
    });
  }

  /**
   * Formata tamanho de arquivo
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  /**
   * Verifica se tipo de arquivo é válido
   */
  isValidImageType(file: File): boolean {
    return this.allowedImageTypes.includes(file.type);
  }

  /**
   * Verifica se tamanho do arquivo é válido
   */
  isValidImageSize(file: File): boolean {
    return file.size <= this.maxImageSize;
  }
}

// Instância singleton
export const productsService = new ProductsService();
