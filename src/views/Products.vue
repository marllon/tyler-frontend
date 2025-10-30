<template>
  <div class="py-12">
    <div class="container mx-auto px-4">
      <h1 class="section-title">Nossos Produtos</h1>
      <p class="section-subtitle">
        Adquira produtos solidários e ajude o Projeto Tyler Lima Eler
      </p>

      <div v-if="productsStore.loading" class="text-center py-16">
        <div
          class="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-tyler-blue"
        ></div>
        <p class="mt-4 text-gray-600">Carregando produtos...</p>
      </div>

      <div v-else-if="productsStore.error" class="text-center py-16">
        <p class="text-red-600">{{ productsStore.error }}</p>
        <button @click="productsStore.fetchProducts()" class="btn-primary mt-4">
          Tentar novamente
        </button>
      </div>

      <div v-else-if="activeProducts.length === 0" class="text-center py-16">
        <p class="text-gray-600 text-lg">
          Nenhum produto disponível no momento.
        </p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardProduto
          v-for="product in activeProducts"
          :key="product.id"
          :product="product"
          @buy="handleBuy"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useProductsStore } from "@/stores/products";
import CardProduto from "@/components/CardProduto.vue";
import type { Product } from "@/types";

const productsStore = useProductsStore();

const activeProducts = computed(() =>
  productsStore.products.filter((p) => p.active)
);

onMounted(() => {
  productsStore.fetchProducts();
});

function handleBuy(product: Product) {
  // TODO: Implementar checkout
  console.log("Comprar produto:", product);
  alert("Funcionalidade de checkout será implementada em breve!");
}
</script>
