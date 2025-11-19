<template>
  <BaseCard hoverable clickable>
    <div class="group">
      <div class="relative overflow-hidden rounded-lg mb-4">
        <img
          :src="product.imageUrl"
          :alt="product.name"
          class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div
          v-if="product.stock === 0"
          class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <span class="text-white font-bold text-lg">Esgotado</span>
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
        <BaseButton
          size="sm"
          :disabled="product.stock === 0"
          @click="$emit('buy', product)"
        >
          {{ product.stock === 0 ? "Esgotado" : "Comprar" }}
        </BaseButton>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import type { Product } from "@/types";
import { useCurrency, useSafeHtml } from "@/composables";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

defineProps<{
  product: Product;
}>();

defineEmits<{
  (e: "buy", product: Product): void;
}>();

const { formatCurrency } = useCurrency();
const { processDescription } = useSafeHtml();
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
