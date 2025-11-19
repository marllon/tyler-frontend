<template>
  <!-- Backdrop -->
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="close"
    ></div>
  </Transition>

  <!-- Drawer -->
  <Transition name="slide">
    <div
      v-if="isOpen"
      class="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b">
        <h2 class="text-2xl font-bold text-gray-900">
          Carrinho
          <span v-if="cartStore.itemCount > 0" class="text-tyler-blue">
            ({{ cartStore.itemCount }})
          </span>
        </h2>
        <button
          @click="close"
          class="p-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Carrinho Vazio -->
      <div
        v-if="cartStore.isEmpty"
        class="flex-1 flex flex-col items-center justify-center p-6 text-center"
      >
        <svg
          class="w-24 h-24 text-gray-300 mb-4"
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
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          Seu carrinho está vazio
        </h3>
        <p class="text-gray-600 mb-6">
          Adicione produtos para começar suas compras
        </p>
        <BaseButton @click="close" variant="primary">
          Continuar Comprando
        </BaseButton>
      </div>

      <!-- Lista de Produtos -->
      <div v-else class="flex-1 overflow-y-auto p-6">
        <CartItem
          v-for="item in cartStore.items"
          :key="item.product.id"
          :item="item"
        />
      </div>

      <!-- Footer com Resumo e Checkout -->
      <div v-if="!cartStore.isEmpty" class="border-t p-6 bg-gray-50">
        <!-- Resumo -->
        <div class="space-y-2 mb-4">
          <div class="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{{ formatCurrency(cartStore.summary.subtotal) }}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Frete</span>
            <span class="text-sm">A pagar na entrega</span>
          </div>
          <div
            class="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t"
          >
            <span>Total</span>
            <span class="text-tyler-blue">
              {{ formatCurrency(cartStore.summary.total) }}
            </span>
          </div>
        </div>

        <!-- Botões -->
        <div class="space-y-3">
          <BaseButton
            @click="goToCheckout"
            variant="primary"
            size="lg"
            class="w-full"
          >
            Finalizar Compra
          </BaseButton>
          <BaseButton
            @click="close"
            variant="secondary"
            size="lg"
            class="w-full"
          >
            Continuar Comprando
          </BaseButton>
        </div>

        <!-- Link para limpar carrinho -->
        <button
          @click="clearCart"
          class="w-full text-center text-sm text-red-600 hover:text-red-700 mt-4 transition-colors"
        >
          Limpar Carrinho
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart";
import { useCurrency } from "@/composables/useCurrency";
import { useToast } from "@/composables/useToast";
import CartItem from "@/components/CartItem.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const router = useRouter();
const cartStore = useCartStore();
const { formatCurrency } = useCurrency();
const { showToast } = useToast();

const close = () => {
  emit("close");
};

const goToCheckout = () => {
  close();
  router.push("/checkout");
};

const clearCart = () => {
  if (confirm("Tem certeza que deseja limpar o carrinho?")) {
    cartStore.clearCart();
    showToast("Carrinho limpo com sucesso", "success");
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
