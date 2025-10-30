<template>
  <BaseCard>
    <!-- Galeria de Imagens ou Imagem Única -->
    <div class="relative mb-4">
      <ImageGallery
        v-if="raffle.images && raffle.images.length > 0"
        :images="raffle.images"
        :showThumbnails="false"
      />
      <div v-else class="relative overflow-hidden rounded-lg">
        <img
          :src="raffle.imageUrl || '/default-raffle.jpg'"
          :alt="raffle.title"
          class="w-full h-48 object-cover"
        />
      </div>
      
      <!-- Badge de Status -->
      <div
        class="absolute top-4 right-4 bg-tyler-pink text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg"
      >
        {{
          raffle.status === "ACTIVE"
            ? "Ativa"
            : raffle.status === "ENDED"
            ? "Encerrada"
            : raffle.status === "DRAWN"
            ? "Sorteada"
            : "Cancelada"
        }}
      </div>
    </div>

    <h3 class="text-xl font-semibold mb-2">{{ raffle.title }}</h3>
    <p class="text-gray-600 text-sm mb-4">{{ raffle.description }}</p>

    <div class="bg-tyler-gray rounded-lg p-4 mb-4">
      <div class="text-center mb-2">
        <span class="text-gray-600 text-sm">Prêmio</span>
        <p class="text-lg font-bold text-tyler-blue">{{ raffle.prize }}</p>
      </div>
    </div>

    <ProgressBar
      :percentage="progressPercentage"
      :height="12"
      color="pink"
      animated
      class="mb-2"
    />
    <div class="flex justify-between text-sm mb-4 text-gray-600">
      <span>{{ raffle.soldTickets }} vendidos</span>
      <span>{{ remainingTickets }} restantes</span>
    </div>

    <div class="flex items-center justify-between mb-4">
      <span class="text-gray-600 text-sm">Valor do bilhete:</span>
      <span class="text-2xl font-bold text-tyler-blue">
        {{ formatCurrency(raffle.ticketPrice) }}
      </span>
    </div>

    <div class="text-sm text-gray-500 mb-4">
      Sorteio:
      {{
        formatDate(raffle.deadline, {
          month: "long",
          day: "2-digit",
          year: "numeric",
        })
      }}
    </div>

    <BaseButton
      variant="secondary"
      full-width
      :disabled="raffle.status !== 'ACTIVE' || remainingTickets === 0"
      @click="$emit('buy-ticket', raffle)"
    >
      {{
        raffle.status !== "ACTIVE"
          ? "Encerrada"
          : remainingTickets === 0
          ? "Esgotada"
          : "Comprar bilhetes"
      }}
    </BaseButton>

    <div
      v-if="
        raffle.status === 'DRAWN' && raffle.winnerTicketNumber !== undefined
      "
      class="mt-4 p-4 bg-green-50 rounded-lg"
    >
      <p class="text-center text-green-800 font-semibold">
        🎉 Número sorteado:
        <span class="text-2xl">{{ raffle.winnerTicketNumber }}</span>
      </p>
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
</script>
