<template>
  <div>
    <!-- Hero Section -->
    <section
      class="bg-gradient-to-r from-tyler-blue to-tyler-pink text-white py-20"
    >
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            Projeto Tyler Lima Eler
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-white/90">
            Juntos pela esperança, solidariedade e amor. Cada contribuição faz a
            diferença na vida de Tyler e sua família.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <RouterLink
              to="/goals"
              class="btn-primary bg-white text-tyler-blue hover:bg-gray-100"
            >
              Fazer uma doação
            </RouterLink>
            <RouterLink
              to="/about"
              class="btn-outline border-white text-white hover:bg-white hover:text-tyler-blue"
            >
              Conheça a história
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Instagram Section -->
    <section class="py-12 bg-tyler-gray">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto text-center">
          <p class="text-gray-700 mb-4">
            Acompanhe a jornada de Tyler no Instagram
          </p>
          <a
            :href="instagramUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 text-tyler-pink hover:text-pink-600 font-semibold transition-colors"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
              />
            </svg>
            @tylerlimaeler
          </a>
        </div>
      </div>
    </section>

    <!-- Metas em Destaque -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="section-title text-center">Metas de Arrecadação</h2>
        <p class="section-subtitle text-center">
          Ajude-nos a alcançar nossos objetivos
        </p>

        <div v-if="goalsStore.loading" class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-tyler-blue"
          ></div>
        </div>

        <div
          v-else-if="activeGoals.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <BarraProgressoMeta
            v-for="goal in activeGoals.slice(0, 3)"
            :key="goal.id"
            :goal="goal"
            @donate="handleDonate"
          />
        </div>

        <div v-else class="text-center text-gray-600 py-12">
          Nenhuma meta ativa no momento.
        </div>

        <div v-if="activeGoals.length > 3" class="text-center mt-8">
          <RouterLink to="/goals" class="btn-primary">
            Ver todas as metas
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Produtos -->
    <section class="py-16 bg-tyler-gray">
      <div class="container mx-auto px-4">
        <h2 class="section-title text-center">Produtos Solidários</h2>
        <p class="section-subtitle text-center">
          Adquira nossos produtos e ajude o projeto
        </p>

        <div v-if="productsStore.loading" class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-tyler-blue"
          ></div>
        </div>

        <div
          v-else-if="activeProducts.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <CardProduto
            v-for="product in activeProducts.slice(0, 4)"
            :key="product.id"
            :product="product"
            @buy="handleBuy"
          />
        </div>

        <div v-if="activeProducts.length > 4" class="text-center mt-8">
          <RouterLink to="/products" class="btn-primary">
            Ver todos os produtos
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Rifas -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="section-title text-center">Rifas Beneficentes</h2>
        <p class="section-subtitle text-center">
          Concorra a prêmios incríveis e ajude Tyler
        </p>

        <div v-if="rafflesStore.loading" class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-tyler-blue"
          ></div>
        </div>

        <div
          v-else-if="activeRaffles.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <CardRifa
            v-for="raffle in activeRaffles.slice(0, 3)"
            :key="raffle.id"
            :raffle="raffle"
            @buy-ticket="handleBuyTicket"
          />
        </div>

        <div v-if="activeRaffles.length > 3" class="text-center mt-8">
          <RouterLink to="/raffles" class="btn-secondary">
            Ver todas as rifas
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section
      class="py-20 bg-gradient-to-r from-tyler-pink to-tyler-blue text-white"
    >
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold mb-6">
            Faça Parte Desta História
          </h2>
          <p class="text-xl mb-8 text-white/90">
            Sua solidariedade transforma vidas. Junte-se a nós nesta jornada de
            esperança e amor.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <RouterLink
              to="/contact"
              class="btn-primary bg-white text-tyler-blue hover:bg-gray-100"
            >
              Entre em contato
            </RouterLink>
            <RouterLink
              to="/about"
              class="btn-outline border-white text-white hover:bg-white hover:text-tyler-blue"
            >
              Saiba mais
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { RouterLink } from "vue-router";
import { useProductsStore } from "@/stores/products";
import { useGoalsStore } from "@/stores/goals";
import { useRafflesStore } from "@/stores/raffles";
import CardProduto from "@/components/CardProduto.vue";
import BarraProgressoMeta from "@/components/BarraProgressoMeta.vue";
import CardRifa from "@/components/CardRifa.vue";
import type { Product, Goal, Raffle } from "@/types";

const productsStore = useProductsStore();
const goalsStore = useGoalsStore();
const rafflesStore = useRafflesStore();

const instagramUrl =
  import.meta.env.VITE_INSTAGRAM_URL ||
  "https://www.instagram.com/tylerlimaeler/";

const activeProducts = computed(() =>
  productsStore.products.filter((p) => p.active)
);

const activeGoals = computed(() => goalsStore.goals.filter((g) => g.active));

const activeRaffles = computed(() =>
  rafflesStore.raffles.filter((r) => r.status === "ACTIVE")
);

onMounted(() => {
  productsStore.fetchProducts();
  goalsStore.fetchGoals();
  rafflesStore.fetchRaffles();
});

function handleBuy(product: Product) {
  console.log("Comprar produto:", product);
  alert("Funcionalidade de checkout será implementada em breve!");
}

function handleDonate(goal: Goal) {
  console.log("Doar para meta:", goal);
  alert("Funcionalidade de doação será implementada em breve!");
}

function handleBuyTicket(raffle: Raffle) {
  console.log("Comprar bilhete:", raffle);
  alert("Funcionalidade de compra de bilhetes será implementada em breve!");
}
</script>
