<template>
  <BaseCard hoverable>
    <div class="group">
      <div class="relative overflow-hidden rounded-lg mb-4">
        <img
          :src="getPrimaryImage()"
          :alt="product.name"
          class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div
          v-if="product.stock === 0"
          class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <span class="text-white font-bold text-lg">Esgotado</span>
        </div>

        <!-- Badge de "No Carrinho" -->
        <div
          v-if="isInCart"
          class="absolute top-2 right-2 bg-tyler-blue text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            />
          </svg>
          {{ cartQuantity }}
        </div>
      </div>

      <h3 class="text-xl font-semibold mb-2">{{ product.name }}</h3>
      <div
        class="text-gray-600 text-sm mb-4 line-clamp-2 prose prose-sm max-w-none"
        v-html="processDescription(product.description)"
      ></div>

      <div class="flex items-center justify-between">
        <span class="text-2xl font-bold text-tyler-blue">
          {{ formatCurrency(product.price) }}
        </span>

        <!-- Botão adicionar ao carrinho -->
        <BaseButton
          v-if="!isInCart"
          size="sm"
          :disabled="product.stock === 0 || loading"
          @click="addToCart"
        >
          <svg
            v-if="!loading"
            class="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <Spinner v-else size="sm" />
          {{ product.stock === 0 ? "Esgotado" : "Adicionar" }}
        </BaseButton>

        <!-- Botão "Ver Carrinho" quando já está no carrinho -->
        <BaseButton
          v-else
          size="sm"
          variant="secondary"
          @click="$emit('view-cart')"
        >
          Ver Carrinho
        </BaseButton>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Product } from "@/types";
import { useCurrency, useSafeHtml } from "@/composables";
import { useCartStore } from "@/stores/cart";
import { useToast } from "@/composables/useToast";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import Spinner from "@/components/ui/Spinner.vue";

const props = defineProps<{
  product: Product;
}>();

defineEmits<{
  (e: "view-cart"): void;
}>();

const { formatCurrency } = useCurrency();

const { processDescription } = useSafeHtml();
const cartStore = useCartStore();
const toast = useToast();

const loading = ref(false);

const isInCart = computed(() => cartStore.hasProduct(props.product.id));
const cartQuantity = computed(() =>
  cartStore.getItemQuantity(props.product.id)
);

const getPrimaryImage = () => {
  if (props.product.images && props.product.images.length > 0) {
    const primary = props.product.images.find((img) => img.isPrimary);
    return primary?.url || props.product.images[0].url;
  }

  return `https://placehold.co/400x300/e5e7eb/6b7280?text=${encodeURIComponent(
    props.product.name
  )}`;
};

const addToCart = async () => {
  loading.value = true;
  try {
    cartStore.addItem(props.product, 1);
    toast.success(`${props.product.name} adicionado ao carrinho!`);
  } catch (error: any) {
    toast.error(error.message || "Erro ao adicionar ao carrinho");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>

:deep(.prose) {
  @apply text-gray-600;
}

:deep(.prose img) {
  @apply inline-block max-w-full h-auto max-h-16 rounded;
  margin: 0.25rem 0;
}

:deep(.prose p) {
  @apply my-1;
}

:deep(.prose br) {
  @apply block my-1;
}

:deep(.prose strong),
:deep(.prose b) {
  @apply font-semibold text-gray-700;
}

:deep(.prose em),
:deep(.prose i) {
  @apply italic;
}

:deep(.prose a) {
  @apply text-tyler-blue hover:underline;
}

:deep(.prose ul),
:deep(.prose ol) {
  @apply pl-4 my-1;
}

:deep(.prose li) {
  @apply my-0.5;
}
</style>
