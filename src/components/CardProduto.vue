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
      <p class="text-gray-600 text-sm mb-4 line-clamp-2">
        {{ product.description }}
      </p>

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
import { useCurrency } from "@/composables/useCurrency";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

defineProps<{
  product: Product;
}>();

defineEmits<{
  (e: "buy", product: Product): void;
}>();

const { formatCurrency } = useCurrency();
</script>
