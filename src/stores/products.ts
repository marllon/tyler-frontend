import { defineStore } from "pinia";
import { ref } from "vue";
import type { Product, ApiResponse } from "@/types";
import { api } from "@/utils/api";

// Dados dummy para demonstração
const DUMMY_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Camiseta Projeto Tyler",
    description: "Camiseta 100% algodão com logo do projeto. Disponível em várias cores e tamanhos.",
    price: 59.90,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    stock: 50,
    active: true,
    category: "Vestuário",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "Caneca",
    description: "Caneca de porcelana personalizada com mensagem inspiradora.",
    price: 35.00,
    imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400",
    stock: 30,
    active: true,
    category: "Casa",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    name: "Boné Tyler",
    description: "Boné ajustável bordado com logo do projeto.",
    price: 45.00,
    imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400",
    stock: 25,
    active: true,
    category: "Vestuário",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "4",
    name: "Ecobag Sustentável",
    description: "Ecobag reutilizável em lona com estampa exclusiva.",
    price: 39.90,
    imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400",
    stock: 40,
    active: true,
    category: "Acessórios",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "5",
    name: "Adesivo Pack",
    description: "Kit com 5 adesivos personalizados do projeto.",
    price: 15.00,
    imageUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400",
    stock: 100,
    active: true,
    category: "Acessórios",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "6",
    name: "Caderno Tyler",
    description: "Caderno universitário 96 folhas com capa personalizada.",
    price: 28.50,
    imageUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=400",
    stock: 0,
    active: true,
    category: "Papelaria",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "7",
    name: "Moletom Solidário",
    description: "Moletom de algodão com capuz e bolso canguru.",
    price: 89.90,
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
    stock: 20,
    active: true,
    category: "Vestuário",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "8",
    name: "Squeeze Personalizada",
    description: "Garrafa térmica 500ml com logo do projeto.",
    price: 42.00,
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
    stock: 35,
    active: true,
    category: "Casa",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useProductsStore = defineStore("products", () => {
  const products = ref<Product[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchProducts() {
    loading.value = true;
    error.value = null;
    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Usar dados dummy por enquanto
      products.value = DUMMY_PRODUCTS;
      
      // TODO: Quando o backend estiver pronto, descomentar:
      // const response = await api.get<ApiResponse<Product[]>>("/products");
      // if (response.success && response.data) {
      //   products.value = response.data;
      // }
    } catch (err: any) {
      error.value = err.message || "Erro ao carregar produtos";
    } finally {
      loading.value = false;
    }
  }

  async function fetchProduct(id: string): Promise<Product | null> {
    try {
      // Usar dados dummy por enquanto
      const product = DUMMY_PRODUCTS.find(p => p.id === id);
      return product || null;
      
      // TODO: Quando o backend estiver pronto, descomentar:
      // const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
      // return response.data || null;
    } catch (err) {
      return null;
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    fetchProduct,
  };
});
