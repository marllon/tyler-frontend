<template>
  <div class="relative inline-block text-left" ref="dropdownRef">
    <div>
      <button
        type="button"
        @click="toggleDropdown"
        :class="buttonClasses"
        :disabled="disabled"
      >
        <slot name="trigger">
          <span>{{ label }}</span>
          <svg
            class="ml-2 -mr-1 h-5 w-5 transition-transform"
            :class="{ 'rotate-180': isOpen }"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </slot>
      </button>
    </div>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        :class="menuClasses"
        role="menu"
        aria-orientation="vertical"
      >
        <div class="py-1" role="none">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

interface Props {
  label?: string;
  position?: "left" | "right";
  width?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: "Opções",
  position: "right",
  width: "w-56",
});

const emit = defineEmits<{
  (e: "open"): void;
  (e: "close"): void;
}>();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const buttonClasses = computed(() => {
  const classes = [
    "inline-flex",
    "justify-center",
    "items-center",
    "w-full",
    "rounded-md",
    "border",
    "border-gray-300",
    "shadow-sm",
    "px-4",
    "py-2",
    "bg-white",
    "text-sm",
    "font-medium",
    "text-gray-700",
    "hover:bg-gray-50",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-offset-2",
    "focus:ring-tyler-blue",
    "transition-colors",
  ];

  if (props.disabled) {
    classes.push("opacity-50", "cursor-not-allowed");
  }

  return classes;
});

const menuClasses = computed(() => {
  const classes = [
    "absolute",
    "z-10",
    "mt-2",
    props.width,
    "rounded-md",
    "shadow-lg",
    "bg-white",
    "ring-1",
    "ring-black",
    "ring-opacity-5",
    "focus:outline-none",
  ];

  if (props.position === "right") {
    classes.push("right-0", "origin-top-right");
  } else {
    classes.push("left-0", "origin-top-left");
  }

  return classes;
});

function toggleDropdown() {
  if (props.disabled) return;

  isOpen.value = !isOpen.value;

  if (isOpen.value) {
    emit("open");
  } else {
    emit("close");
  }
}

function closeDropdown() {
  if (isOpen.value) {
    isOpen.value = false;
    emit("close");
  }
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

defineExpose({ close: closeDropdown });
</script>
