<template>
  <div class="py-12 bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Rifas Beneficentes
        </h1>
        <p class="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Concorra a prêmios incríveis e ajude o Projeto Tyler Lima Eler. Cada
          bilhete é uma contribuição que faz a diferença!
        </p>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Busca -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Buscar rifas
            </label>
            <input
              v-model="filters.searchTerm"
              type="text"
              placeholder="Buscar por título, descrição ou prêmio..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyler-pink focus:border-transparent transition-all"
              @input="debouncedSearch"
            />
          </div>

          <!-- Ordenar -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ordenar por
            </label>
            <select
              v-model="filters.sortBy"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyler-pink focus:border-transparent transition-all"
              @change="applyFilters"
            >
              <option value="createdAt">Mais recentes</option>
              <option value="drawDate">Data do sorteio</option>
              <option value="ticketPrice">Menor preço</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="rafflesStore.loading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="h-48 bg-gray-200"></div>
            <div class="p-6 space-y-4">
              <div class="h-6 bg-gray-200 rounded w-3/4"></div>
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded w-5/6"></div>
              <div class="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Rifas Grid -->
      <div v-else-if="rafflesStore.raffles.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <CardRifa
            v-for="raffle in rafflesStore.raffles"
            :key="raffle.id"
            :raffle="raffle"
            @buy-ticket="handleBuyTicket"
            class="transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          />
        </div>

        <!-- Paginação -->
        <div
          v-if="rafflesStore.pagination.totalPages > 1"
          class="flex justify-center items-center gap-4 mt-12"
        >
          <button
            @click="previousPage"
            :disabled="!rafflesStore.pagination.hasPrevious"
            class="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
          >
            ← Anterior
          </button>

          <span class="text-gray-600 font-medium">
            Página {{ rafflesStore.pagination.page + 1 }} de
            {{ rafflesStore.pagination.totalPages }}
          </span>

          <button
            @click="nextPage"
            :disabled="!rafflesStore.pagination.hasNext"
            class="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
          >
            Próxima →
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6"
        >
          <svg
            class="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          Nenhuma rifa disponível
        </h3>
        <p class="text-gray-600">
          No momento não há rifas ativas. Volte em breve para participar!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRafflesStore } from "@/stores/raffles";
import CardRifa from "@/components/CardRifa.vue";
import type { Raffle, RaffleFilters } from "@/types";

const rafflesStore = useRafflesStore();

const filters = ref<RaffleFilters>({
  page: 0,
  pageSize: 9,
  status: "ACTIVE",
  activeOnly: true,
  sortBy: "createdAt",
  sortDirection: "DESC",
  searchTerm: "",
});

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
  rafflesStore.fetchRaffles(filters.value);
});

function applyFilters() {
  filters.value.page = 0;
  rafflesStore.fetchRaffles(filters.value);
}

function debouncedSearch() {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    applyFilters();
  }, 500);
}

function nextPage() {
  if (rafflesStore.pagination.hasNext) {
    filters.value.page = (filters.value.page || 0) + 1;
    rafflesStore.fetchRaffles(filters.value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function previousPage() {
  if (rafflesStore.pagination.hasPrevious && filters.value.page! > 0) {
    filters.value.page = filters.value.page! - 1;
    rafflesStore.fetchRaffles(filters.value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function handleBuyTicket(raffle: Raffle) {
  alert("Funcionalidade de compra de bilhetes será implementada em breve!");
}
</script>
