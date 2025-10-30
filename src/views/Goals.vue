<template>
  <div class="py-12">
    <div class="container mx-auto px-4">
      <h1 class="section-title">Metas de Arrecadação</h1>
      <p class="section-subtitle">
        Ajude-nos a alcançar nossos objetivos e transformar a vida de Tyler
      </p>

      <div v-if="goalsStore.loading" class="text-center py-16">
        <div
          class="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-tyler-blue"
        ></div>
      </div>

      <div v-else-if="activeGoals.length === 0" class="text-center py-16">
        <p class="text-gray-600 text-lg">Nenhuma meta ativa no momento.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BarraProgressoMeta
          v-for="goal in activeGoals"
          :key="goal.id"
          :goal="goal"
          @donate="handleDonate"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useGoalsStore } from "@/stores/goals";
import BarraProgressoMeta from "@/components/BarraProgressoMeta.vue";
import type { Goal } from "@/types";

const goalsStore = useGoalsStore();

const activeGoals = computed(() => goalsStore.goals.filter((g) => g.active));

onMounted(() => {
  goalsStore.fetchGoals();
});

function handleDonate(goal: Goal) {
  alert("Funcionalidade de doação será implementada em breve!");
}
</script>
