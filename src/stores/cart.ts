import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Product, CartItem, CartSummary } from "@/types";

const CART_STORAGE_KEY = "tyler_cart";

export const useCartStore = defineStore("cart", () => {
  const items = ref<CartItem[]>([]);
  const loadCart = () => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        items.value = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
      items.value = [];
    }
  };
  const saveCart = () => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.value));
    } catch (error) {
      console.error("Erro ao salvar carrinho:", error);
    }
  };
  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const subtotal = computed(() => {
    return items.value.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  });

  const summary = computed<CartSummary>(() => {
    const sub = subtotal.value;
    const shipping = 0; // Frete a pagar na entrega
    return {
      subtotal: sub,
      shipping,
      total: sub + shipping,
      itemCount: itemCount.value,
    };
  });

  const isEmpty = computed(() => items.value.length === 0);
  const addItem = (product: Product, quantity: number = 1) => {
    if (product.stock < quantity) {
      throw new Error("Quantidade indisponível em estoque");
    }

    const existingItem = items.value.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        throw new Error("Quantidade excede estoque disponível");
      }
      existingItem.quantity = newQuantity;
    } else {
      items.value.push({
        product,
        quantity,
        addedAt: new Date().toISOString(),
      });
    }

    saveCart();
  };

  const removeItem = (productId: string) => {
    items.value = items.value.filter((item) => item.product.id !== productId);
    saveCart();
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    const item = items.value.find((item) => item.product.id === productId);
    if (!item) return;

    if (quantity > item.product.stock) {
      throw new Error("Quantidade excede estoque disponível");
    }

    item.quantity = quantity;
    saveCart();
  };

  const incrementQuantity = (productId: string) => {
    const item = items.value.find((item) => item.product.id === productId);
    if (!item) return;

    if (item.quantity >= item.product.stock) {
      throw new Error("Estoque máximo atingido");
    }

    item.quantity += 1;
    saveCart();
  };

  const decrementQuantity = (productId: string) => {
    const item = items.value.find((item) => item.product.id === productId);
    if (!item) return;

    if (item.quantity <= 1) {
      removeItem(productId);
      return;
    }

    item.quantity -= 1;
    saveCart();
  };

  const clearCart = () => {
    items.value = [];
    saveCart();
  };

  const hasProduct = (productId: string) => {
    return items.value.some((item) => item.product.id === productId);
  };

  const getItemQuantity = (productId: string): number => {
    const item = items.value.find((item) => item.product.id === productId);
    return item?.quantity || 0;
  };
  loadCart();

  return {
    items,
    itemCount,
    subtotal,
    summary,
    isEmpty,
    addItem,
    removeItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    hasProduct,
    getItemQuantity,
  };
});
