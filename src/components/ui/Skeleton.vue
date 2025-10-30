<template>
  <div :class="skeletonClasses"></div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  width?: string;
  height?: string;
  variant?: "text" | "rectangular" | "circular" | "rounded";
  animation?: "pulse" | "wave" | "none";
}

const props = withDefaults(defineProps<Props>(), {
  variant: "rectangular",
  animation: "pulse",
});

const skeletonClasses = computed(() => {
  const classes = ["bg-gray-200"];

  // Animation
  if (props.animation === "pulse") {
    classes.push("animate-pulse");
  } else if (props.animation === "wave") {
    classes.push(
      "animate-shimmer",
      "bg-gradient-to-r",
      "from-gray-200",
      "via-gray-300",
      "to-gray-200"
    );
  }

  // Variant
  if (props.variant === "text") {
    classes.push("h-4", "rounded");
  } else if (props.variant === "circular") {
    classes.push("rounded-full", "aspect-square");
  } else if (props.variant === "rounded") {
    classes.push("rounded-lg");
  } else {
    classes.push("rounded");
  }

  return classes;
});
</script>

<style scoped>
@keyframes shimmer {
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 100% 0;
  }
}

.animate-shimmer {
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
</style>
