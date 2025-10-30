<template>
  <div class="py-12">
    <div class="container mx-auto px-4">
      <h1 class="section-title">Eventos</h1>
      <p class="section-subtitle">
        Acompanhe nossos eventos e participe desta jornada
      </p>

      <div v-if="eventsStore.loading" class="text-center py-16">
        <div
          class="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-tyler-blue"
        ></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CardEvento
          v-for="event in eventsStore.events"
          :key="event.id"
          :event="event"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useEventsStore } from "@/stores/events";
import CardEvento from "@/components/CardEvento.vue";

const eventsStore = useEventsStore();

onMounted(() => {
  eventsStore.fetchEvents();
});
</script>
