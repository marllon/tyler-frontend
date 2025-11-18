<template>
  <BaseCard class="overflow-hidden transition-shadow hover:shadow-lg">
    <!-- Galeria de Imagens ou Placeholder -->
    <div class="relative mb-4 overflow-hidden rounded-t-lg">
      <ImageGallery
        v-if="raffle.imageUrls && raffle.imageUrls.length > 0"
        :images="galleryImages"
        :showThumbnails="false"
      />
      <div
        v-else
        class="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center h-48"
      >
        <svg
          class="w-20 h-20 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <!-- Badge de Status -->
      <div
        :class="[
          'absolute top-4 right-4 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm',
          statusBadgeClass,
        ]"
      >
        {{ statusLabel }}
      </div>

      <!-- Contador de Imagens -->
      <div
        v-if="raffle.imageUrls && raffle.imageUrls.length > 1"
        class="absolute bottom-4 left-4 bg-black bg-opacity-60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium"
      >
        {{ raffle.imageUrls.length }} fotos
      </div>
    </div>

    <div class="px-6 pb-6">
      <!-- Título e Descrição -->
      <h3 class="text-xl font-bold mb-2 text-gray-900 line-clamp-2">
        {{ raffle.title }}
      </h3>
      <p class="text-gray-600 text-sm mb-4 line-clamp-2">
        {{ raffle.description }}
      </p>

      <!-- Prêmio em Destaque -->
      <div
        class="bg-gradient-to-r from-tyler-pink/10 to-tyler-blue/10 rounded-lg p-4 mb-4 border border-gray-100"
      >
        <div class="text-center">
          <span
            class="text-gray-600 text-xs font-medium uppercase tracking-wide"
            >Prêmio</span
          >
          <p class="text-lg font-bold text-tyler-blue mt-1">
            {{ raffle.prize }}
          </p>
        </div>
      </div>

      <!-- Barra de Progresso -->
      <div class="mb-4">
        <ProgressBar
          :percentage="progressPercentage"
          :height="10"
          color="pink"
          animated
          class="mb-2"
        />
        <div class="flex justify-between text-sm text-gray-600">
          <span class="font-medium">{{ raffle.soldTickets }} vendidos</span>
          <span
            :class="{ 'text-red-600 font-semibold': remainingTickets < 10 }"
          >
            {{ remainingTickets }} disponíveis
          </span>
        </div>
      </div>

      <!-- Valor do Bilhete -->
      <div
        class="flex items-baseline justify-between mb-4 bg-gray-50 rounded-lg p-3"
      >
        <span class="text-gray-600 text-sm font-medium">Valor do bilhete:</span>
        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-bold text-tyler-pink">
            {{ formatCurrency(raffle.ticketPrice) }}
          </span>
        </div>
      </div>

      <!-- Data do Sorteio -->
      <div
        class="flex items-center gap-2 text-sm text-gray-600 mb-4 bg-blue-50 rounded-lg p-3"
      >
        <svg
          class="w-4 h-4 text-tyler-blue"
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
        <span class="font-medium">
          Sorteio em
          {{
            formatDate(raffle.drawDate, {
              month: "long",
              day: "2-digit",
              year: "numeric",
            })
          }}
        </span>
      </div>

      <!-- Botão de Ação -->
      <BaseButton
        variant="secondary"
        full-width
        :disabled="raffle.status !== 'ACTIVE' || remainingTickets === 0"
        @click="$emit('buy-ticket', raffle)"
        class="font-semibold text-base py-3"
      >
        {{ buttonLabel }}
      </BaseButton>

      <!-- Resultado do Sorteio -->
      <div
        v-if="
          raffle.status === 'DRAWN' && raffle.winnerTicketNumber !== undefined
        "
        class="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg"
      >
        <p class="text-center text-green-800 font-semibold">
          🎉 Número sorteado:
          <span class="text-3xl block mt-2 font-bold">{{
            raffle.winnerTicketNumber
          }}</span>
        </p>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Raffle } from "@/types";
import { useCurrency } from "@/composables/useCurrency";
import { useDate } from "@/composables/useDate";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import ProgressBar from "@/components/ui/ProgressBar.vue";
import ImageGallery from "@/components/ui/ImageGallery.vue";

const props = defineProps<{
  raffle: Raffle;
}>();

defineEmits<{
  (e: "buy-ticket", raffle: Raffle): void;
}>();

const { formatCurrency } = useCurrency();
const { formatDate } = useDate();
const galleryImages = computed(() => {
  if (!props.raffle.imageUrls || props.raffle.imageUrls.length === 0) {
    return [];
  }

  return props.raffle.imageUrls.map((url, index) => ({
    id: `${props.raffle.id}-${index}`,
    url: url,
    isPrimary: index === 0,
  }));
});

const remainingTickets = computed(
  () => props.raffle.totalTickets - props.raffle.soldTickets
);

const progressPercentage = computed(() => {
  if (props.raffle.totalTickets === 0) return 0;
  return Math.min(
    (props.raffle.soldTickets / props.raffle.totalTickets) * 100,
    100
  );
});

const statusLabel = computed(() => {
  const labels: Record<string, string> = {
    ACTIVE: "Ativa",
    ENDED: "Encerrada",
    DRAWN: "Sorteada",
    CANCELLED: "Cancelada",
  };
  return labels[props.raffle.status] || "Ativa";
});

const statusBadgeClass = computed(() => {
  const classes: Record<string, string> = {
    ACTIVE: "bg-green-500 text-white",
    ENDED: "bg-orange-500 text-white",
    DRAWN: "bg-blue-500 text-white",
    CANCELLED: "bg-red-500 text-white",
  };
  return classes[props.raffle.status] || "bg-green-500 text-white";
});

const buttonLabel = computed(() => {
  if (props.raffle.status !== "ACTIVE") return "Rifa Encerrada";
  if (remainingTickets.value === 0) return "Esgotada";
  if (remainingTickets.value < 10)
    return `Últimos ${remainingTickets.value} bilhetes!`;
  return "Comprar Bilhetes";
});
</script>
