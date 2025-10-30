<template>
  <BaseCard>
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-semibold">{{ goal.title }}</h3>
      <span class="text-sm text-gray-500"> {{ percentage.toFixed(0) }}% </span>
    </div>

    <p class="text-gray-600 text-sm mb-4">{{ goal.description }}</p>

    <ProgressBar
      :percentage="percentage"
      :height="16"
      color="gradient"
      show-label
      label="Progresso"
      animated
      class="mb-4"
    />

    <div class="flex justify-between text-sm mb-4">
      <span class="text-gray-600">
        Arrecadado:
        <strong class="text-tyler-blue">{{
          formatCurrency(goal.currentAmount)
        }}</strong>
      </span>
      <span class="text-gray-600">
        Meta:
        <strong class="text-gray-900">{{
          formatCurrency(goal.targetAmount)
        }}</strong>
      </span>
    </div>

    <div v-if="goal.deadline" class="text-sm text-gray-500 mb-4">
      Prazo: {{ formatDate(goal.deadline) }}
    </div>

    <BaseButton full-width @click="$emit('donate', goal)">
      Doar para esta meta
    </BaseButton>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Goal } from "@/types";
import { useCurrency } from "@/composables/useCurrency";
import { useDate } from "@/composables/useDate";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import ProgressBar from "@/components/ui/ProgressBar.vue";

const props = defineProps<{
  goal: Goal;
}>();

defineEmits<{
  (e: "donate", goal: Goal): void;
}>();

const { formatCurrency } = useCurrency();
const { formatDate } = useDate();

const percentage = computed(() => {
  if (props.goal.targetAmount === 0) return 0;
  return (props.goal.currentAmount / props.goal.targetAmount) * 100;
});
</script>
