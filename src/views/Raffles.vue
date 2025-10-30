<template>
  <div class="py-12">
    <div class="container mx-auto px-4">
      <h1 class="section-title">Rifas Beneficentes</h1>
      <p class="section-subtitle">
        Concorra a prêmios incríveis e ajude o Projeto Tyler Lima Eler
      </p>

      <div v-if="rafflesStore.loading" class="text-center py-16">
        <div
          class="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-tyler-blue"
        ></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CardRifa
          v-for="raffle in rafflesStore.raffles"
          :key="raffle.id"
          :raffle="raffle"
          @buy-ticket="handleBuyTicket"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRafflesStore } from "@/stores/raffles";
import CardRifa from "@/components/CardRifa.vue";
import type { Raffle } from "@/types";

const rafflesStore = useRafflesStore();

onMounted(() => {
  rafflesStore.fetchRaffles();
});

function handleBuyTicket(raffle: Raffle) {
  alert("Funcionalidade de compra de bilhetes será implementada em breve!");
}
</script>
