<template>
  <div class="flex items-center gap-4 py-4 border-b last:border-b-0">
    <!-- Imagem do Produto -->
    <div class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
      <img
        v-if="item.product.images && item.product.images.length > 0"
        :src="getPrimaryImage()"
        :alt="item.product.name"
        class="w-full h-full object-cover"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center text-gray-400"
      >
        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>

    <!-- Informações do Produto -->
    <div class="flex-1 min-w-0">
      <h4 class="font-medium text-gray-900 truncate">
        {{ item.product.name }}
      </h4>
      <p class="text-sm text-gray-500">
        {{ formatCurrency(item.product.price) }}
      </p>
      <p v-if="item.product.stock <= 5" class="text-xs text-orange-600 mt-1">
        Apenas {{ item.product.stock }} em estoque
      </p>
    </div>

    <!-- Controles de Quantidade -->
    <div class="flex items-center gap-2">
      <button
        @click="decrementQuantity"
        class="w-8 h-8 rounded-full border border-gray-300 hover:border-tyler-blue hover:text-tyler-blue transition-colors flex items-center justify-center"
        :disabled="loading"
      >
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
            d="M20 12H4"
          />
        </svg>
      </button>

      <span class="w-12 text-center font-medium">{{ item.quantity }}</span>

      <button
        @click="incrementQuantity"
        class="w-8 h-8 rounded-full border border-gray-300 hover:border-tyler-blue hover:text-tyler-blue transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="loading || item.quantity >= item.product.stock"
      >
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
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>

    <!-- Subtotal e Remover -->
    <div class="flex flex-col items-end gap-2">
      <p class="font-semibold text-tyler-blue">
        {{ formatCurrency(item.product.price * item.quantity) }}
      </p>
      <button
        @click="removeItem"
        class="text-sm text-red-600 hover:text-red-700 transition-colors"
        :disabled="loading"
      >
        Remover
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { CartItem } from "@/types";
import { useCurrency } from "@/composables/useCurrency";
import { useCartStore } from "@/stores/cart";
import { useToast } from "@/composables/useToast";

const props = defineProps<{
  item: CartItem;
}>();

const { formatCurrency } = useCurrency();
const cartStore = useCartStore();
const { showToast } = useToast();

const loading = ref(false);

const getPrimaryImage = () => {
  const primary = props.item.product.images?.find((img) => img.isPrimary);
  return primary?.url || props.item.product.images?.[0]?.url;
};

const incrementQuantity = async () => {
  loading.value = true;
  try {
    cartStore.incrementQuantity(props.item.product.id);
  } catch (error: any) {
    showToast(error.message || "Erro ao atualizar quantidade", "error");
  } finally {
    loading.value = false;
  }
};

const decrementQuantity = async () => {
  loading.value = true;
  try {
    cartStore.decrementQuantity(props.item.product.id);
  } catch (error: any) {
    showToast(error.message || "Erro ao atualizar quantidade", "error");
  } finally {
    loading.value = false;
  }
};

const removeItem = async () => {
  loading.value = true;
  try {
    cartStore.removeItem(props.item.product.id);
    showToast("Produto removido do carrinho", "success");
  } catch (error: any) {
    showToast(error.message || "Erro ao remover produto", "error");
  } finally {
    loading.value = false;
  }
};
</script>
