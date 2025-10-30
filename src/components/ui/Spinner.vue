<template>
  <div :class="spinnerClasses" role="status">
    <svg
      class="animate-spin"
      :class="sizeClass"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <span v-if="label" :class="labelClass">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "white" | "gray";
  label?: string;
  center?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  color: "primary",
  center: false,
});

const spinnerClasses = computed(() => {
  const classes = ["inline-flex", "items-center", "gap-2"];

  if (props.center) {
    classes.push("justify-center");
  }

  if (props.color === "primary") {
    classes.push("text-tyler-blue");
  } else if (props.color === "secondary") {
    classes.push("text-tyler-pink");
  } else if (props.color === "white") {
    classes.push("text-white");
  } else {
    classes.push("text-gray-600");
  }

  return classes;
});

const sizeClass = computed(() => {
  if (props.size === "xs") return "w-3 h-3";
  if (props.size === "sm") return "w-4 h-4";
  if (props.size === "md") return "w-6 h-6";
  if (props.size === "lg") return "w-8 h-8";
  return "w-12 h-12";
});

const labelClass = computed(() => {
  const classes = ["font-medium"];

  if (props.size === "xs" || props.size === "sm") {
    classes.push("text-sm");
  } else if (props.size === "lg" || props.size === "xl") {
    classes.push("text-lg");
  }

  return classes;
});
</script>
