<template>
  <BaseCard hoverable>
    <div class="relative overflow-hidden rounded-lg mb-4">
      <img
        :src="event.coverImageUrl"
        :alt="event.title"
        class="w-full h-56 object-cover"
      />
      <div
        class="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg text-center"
      >
        <div class="text-3xl font-bold text-tyler-blue">
          {{ eventDay }}
        </div>
        <div class="text-sm text-gray-600">
          {{ eventMonth }}
        </div>
      </div>
      <div
        v-if="event.status === 'UPCOMING'"
        class="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
      >
        Próximo
      </div>
    </div>

    <h3 class="text-xl font-semibold mb-2">{{ event.title }}</h3>
    <p class="text-gray-600 text-sm mb-4 line-clamp-3">
      {{ event.description }}
    </p>

    <div class="flex items-center gap-2 text-gray-600 text-sm mb-2">
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <span>{{ formatDateTime(event.date) }}</span>
    </div>

    <div class="flex items-center gap-2 text-gray-600 text-sm mb-4">
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      <span>{{ event.location }}</span>
    </div>

    <BaseButton
      v-if="event.status === 'UPCOMING'"
      variant="outline"
      full-width
      @click="$emit('view', event)"
    >
      Ver detalhes
    </BaseButton>

    <BaseButton
      v-else
      variant="outline"
      full-width
      @click="$emit('view-gallery', event)"
    >
      Ver galeria de fotos
    </BaseButton>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Event } from "@/types";
import { useDate } from "@/composables/useDate";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

const props = defineProps<{
  event: Event;
}>();

defineEmits<{
  (e: "view", event: Event): void;
  (e: "view-gallery", event: Event): void;
}>();

const { formatDateTime } = useDate();

const eventDay = computed(() => new Date(props.event.date).getDate());

const eventMonth = computed(() =>
  new Date(props.event.date)
    .toLocaleDateString("pt-BR", { month: "short" })
    .toUpperCase()
);
</script>
