<template>
  <div class="relative">
    <div
      class="bg-gray-200 rounded-full overflow-hidden"
      :style="{ height: `${height}px` }"
    >
      <div
        class="h-full transition-all duration-500 ease-out"
        :class="barClass"
        :style="{ width: `${clampedPercentage}%` }"
      >
        <div v-if="animated" class="h-full w-full animate-pulse"></div>
      </div>
    </div>
    <div
      v-if="showLabel"
      class="flex justify-between items-center mt-2 text-sm"
    >
      <span class="text-gray-600">{{ label }}</span>
      <span :class="percentageClass" class="font-semibold">
        {{ clampedPercentage.toFixed(0) }}%
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  percentage: number;
  height?: number;
  color?: "blue" | "pink" | "green" | "gradient";
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  height: 16,
  color: "gradient",
  showLabel: false,
  label: "",
  animated: false,
});

const clampedPercentage = computed(() => {
  return Math.min(Math.max(props.percentage, 0), 100);
});

const barClass = computed(() => {
  const colors = {
    blue: "bg-tyler-blue",
    pink: "bg-tyler-pink",
    green: "bg-green-500",
    gradient: "bg-gradient-to-r from-tyler-blue to-tyler-pink",
  };

  return colors[props.color];
});

const percentageClass = computed(() => {
  if (clampedPercentage.value >= 100) return "text-green-600";
  if (clampedPercentage.value >= 75) return "text-tyler-blue";
  if (clampedPercentage.value >= 50) return "text-yellow-600";
  return "text-gray-600";
});
</script>
