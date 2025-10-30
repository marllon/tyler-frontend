<template>
  <button
    type="button"
    :class="itemClasses"
    @click="handleClick"
    :disabled="disabled"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  label?: string;
  disabled?: boolean;
  variant?: "default" | "danger";
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
});

const emit = defineEmits<{
  (e: "click"): void;
}>();

const itemClasses = computed(() => {
  const classes = [
    "w-full",
    "text-left",
    "px-4",
    "py-2",
    "text-sm",
    "transition-colors",
  ];

  if (props.disabled) {
    classes.push("text-gray-400", "cursor-not-allowed");
  } else {
    if (props.variant === "danger") {
      classes.push("text-red-700", "hover:bg-red-50", "hover:text-red-900");
    } else {
      classes.push("text-gray-700", "hover:bg-gray-100", "hover:text-gray-900");
    }
  }

  return classes;
});

function handleClick() {
  if (!props.disabled) {
    emit("click");
  }
}
</script>
