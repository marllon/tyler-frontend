<template>
  <div :class="avatarClasses">
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      class="w-full h-full object-cover"
      @error="handleImageError"
    />
    <span v-else-if="initials" class="font-semibold">
      {{ initials }}
    </span>
    <svg
      v-else
      class="w-2/3 h-2/3 text-gray-400"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fill-rule="evenodd"
        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
        clip-rule="evenodd"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

interface Props {
  src?: string;
  alt?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  rounded?: boolean;
  status?: "online" | "offline" | "away" | "busy";
}

const props = withDefaults(defineProps<Props>(), {
  alt: "Avatar",
  size: "md",
  rounded: true,
});

const imageError = ref(false);

const avatarClasses = computed(() => {
  const classes = [
    "relative",
    "inline-flex",
    "items-center",
    "justify-center",
    "overflow-hidden",
    "bg-gray-200",
    "text-gray-600",
    "flex-shrink-0",
  ];

  // Size
  if (props.size === "xs") {
    classes.push("w-6", "h-6", "text-xs");
  } else if (props.size === "sm") {
    classes.push("w-8", "h-8", "text-sm");
  } else if (props.size === "md") {
    classes.push("w-10", "h-10", "text-base");
  } else if (props.size === "lg") {
    classes.push("w-12", "h-12", "text-lg");
  } else if (props.size === "xl") {
    classes.push("w-16", "h-16", "text-xl");
  } else {
    classes.push("w-20", "h-20", "text-2xl");
  }

  // Rounded
  if (props.rounded) {
    classes.push("rounded-full");
  } else {
    classes.push("rounded-md");
  }

  return classes;
});

const initials = computed(() => {
  if (!props.name) return null;

  const names = props.name.trim().split(" ");
  if (names.length >= 2) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return names[0].substring(0, 2).toUpperCase();
});

function handleImageError() {
  imageError.value = true;
}
</script>
