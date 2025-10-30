<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info";
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
  outlined?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  size: "md",
  rounded: false,
  outlined: false,
});

const badgeClasses = computed(() => {
  const classes = [
    "inline-flex",
    "items-center",
    "justify-center",
    "font-medium",
    "transition-colors",
  ];

  // Size
  if (props.size === "sm") {
    classes.push("text-xs", "px-2", "py-0.5");
  } else if (props.size === "md") {
    classes.push("text-sm", "px-2.5", "py-1");
  } else {
    classes.push("text-base", "px-3", "py-1.5");
  }

  // Rounded
  if (props.rounded) {
    classes.push("rounded-full");
  } else {
    classes.push("rounded-md");
  }

  // Variant styles
  if (props.outlined) {
    classes.push("border-2");

    if (props.variant === "primary") {
      classes.push("border-tyler-blue", "text-tyler-blue", "bg-transparent");
    } else if (props.variant === "secondary") {
      classes.push("border-tyler-pink", "text-tyler-pink", "bg-transparent");
    } else if (props.variant === "success") {
      classes.push("border-green-600", "text-green-600", "bg-transparent");
    } else if (props.variant === "warning") {
      classes.push("border-yellow-600", "text-yellow-600", "bg-transparent");
    } else if (props.variant === "danger") {
      classes.push("border-red-600", "text-red-600", "bg-transparent");
    } else if (props.variant === "info") {
      classes.push("border-blue-600", "text-blue-600", "bg-transparent");
    } else {
      classes.push("border-gray-600", "text-gray-600", "bg-transparent");
    }
  } else {
    if (props.variant === "primary") {
      classes.push("bg-tyler-blue", "text-white");
    } else if (props.variant === "secondary") {
      classes.push("bg-tyler-pink", "text-white");
    } else if (props.variant === "success") {
      classes.push("bg-green-100", "text-green-800");
    } else if (props.variant === "warning") {
      classes.push("bg-yellow-100", "text-yellow-800");
    } else if (props.variant === "danger") {
      classes.push("bg-red-100", "text-red-800");
    } else if (props.variant === "info") {
      classes.push("bg-blue-100", "text-blue-800");
    } else {
      classes.push("bg-gray-100", "text-gray-800");
    }
  }

  return classes;
});
</script>
