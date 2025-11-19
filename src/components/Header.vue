<template>
  <header class="bg-white shadow-md sticky top-0 z-50">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-3">
          <div class="text-2xl">❤️</div>
          <div>
            <h1 class="text-xl font-bold text-tyler-blue">Projeto Tyler</h1>
            <p class="text-xs text-gray-600">Lima Eler</p>
          </div>
        </RouterLink>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center gap-6">
          <RouterLink to="/" class="nav-link">Início</RouterLink>
          <RouterLink to="/products" class="nav-link">Produtos</RouterLink>
          <RouterLink to="/goals" class="nav-link">Metas</RouterLink>
          <RouterLink to="/raffles" class="nav-link">Rifas</RouterLink>
          <RouterLink to="/events" class="nav-link">Eventos</RouterLink>
          <RouterLink to="/about" class="nav-link">Sobre</RouterLink>
          <RouterLink to="/contact" class="nav-link">Contato</RouterLink>

          <!-- Meus Pedidos (apenas se autenticado) -->
          <RouterLink
            v-if="userStore.isAuthenticated"
            to="/my-orders"
            class="nav-link"
          >
            Meus Pedidos
          </RouterLink>

          <!-- Carrinho -->
          <CartIcon @toggle="cartDrawerOpen = true" />

          <a
            :href="instagramUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-tyler-pink hover:text-pink-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
              />
            </svg>
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center gap-4">
          <!-- Carrinho Mobile -->
          <CartIcon @toggle="cartDrawerOpen = true" />

          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="text-gray-700"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                v-if="!mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden mt-4 pb-4">
        <div class="flex flex-col gap-4">
          <RouterLink
            to="/"
            class="nav-link-mobile"
            @click="mobileMenuOpen = false"
            >Início</RouterLink
          >
          <RouterLink
            to="/products"
            class="nav-link-mobile"
            @click="mobileMenuOpen = false"
            >Produtos</RouterLink
          >
          <RouterLink
            to="/goals"
            class="nav-link-mobile"
            @click="mobileMenuOpen = false"
            >Metas</RouterLink
          >
          <RouterLink
            to="/raffles"
            class="nav-link-mobile"
            @click="mobileMenuOpen = false"
            >Rifas</RouterLink
          >
          <RouterLink
            to="/events"
            class="nav-link-mobile"
            @click="mobileMenuOpen = false"
            >Eventos</RouterLink
          >
          <RouterLink
            to="/about"
            class="nav-link-mobile"
            @click="mobileMenuOpen = false"
            >Sobre</RouterLink
          >
          <RouterLink
            to="/contact"
            class="nav-link-mobile"
            @click="mobileMenuOpen = false"
            >Contato</RouterLink
          >
          <RouterLink
            v-if="userStore.isAuthenticated"
            to="/my-orders"
            class="nav-link-mobile"
            @click="mobileMenuOpen = false"
            >Meus Pedidos</RouterLink
          >
        </div>
      </div>
    </nav>

    <!-- Cart Drawer -->
    <CartDrawer :is-open="cartDrawerOpen" @close="cartDrawerOpen = false" />
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { useUserStore } from "@/stores/user";
import CartIcon from "@/components/ui/CartIcon.vue";
import CartDrawer from "@/components/CartDrawer.vue";

const userStore = useUserStore();
const mobileMenuOpen = ref(false);
const cartDrawerOpen = ref(false);
const instagramUrl =
  import.meta.env.VITE_INSTAGRAM_URL ||
  "https://www.instagram.com/tylerlimaeler/";
</script>

<style scoped>
.nav-link {
  @apply text-gray-700 hover:text-tyler-blue font-medium transition-colors;
}

.nav-link.router-link-active {
  @apply text-tyler-blue;
}

.nav-link-mobile {
  @apply text-gray-700 hover:text-tyler-blue font-medium transition-colors py-2;
}

.nav-link-mobile.router-link-active {
  @apply text-tyler-blue;
}
</style>
