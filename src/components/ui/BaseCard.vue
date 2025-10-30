<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
  clickable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  padding: "md",
  hoverable: false,
  clickable: false,
});

const cardClasses = computed(() => {
  const base = "bg-white rounded-xl shadow-lg transition-all duration-300";

  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const interactive = props.hoverable ? "hover:shadow-xl" : "";
  const cursor = props.clickable ? "cursor-pointer" : "";

  return `${base} ${paddings[props.padding]} ${interactive} ${cursor}`;
});
</script>
