<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="modelValue"
      :class="modalClasses"
      @click.self="handleBackdropClick"
    >
      <div :class="contentClasses">
        <!-- Header -->
        <div
          v-if="title || $slots.header"
          class="flex items-center justify-between mb-4 pb-4 border-b"
        >
          <slot name="header">
            <h3 class="text-xl font-bold text-gray-900">{{ title }}</h3>
          </slot>
          <button
            v-if="closable"
            @click="close"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div :class="bodyClasses">
          <slot />
        </div>

        <!-- Footer -->
        <div v-if="$slots.footer" class="mt-6 pt-4 border-t">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";

interface Props {
  modelValue: boolean;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closable?: boolean;
  closeOnBackdrop?: boolean;
  scrollable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  closable: true,
  closeOnBackdrop: true,
  scrollable: true,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "close"): void;
}>();

const modalClasses = computed(() => {
  return "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4";
});

const contentClasses = computed(() => {
  const base = "bg-white rounded-xl shadow-2xl";

  const sizes = {
    sm: "max-w-sm w-full",
    md: "max-w-md w-full",
    lg: "max-w-2xl w-full",
    xl: "max-w-4xl w-full",
    full: "max-w-7xl w-full h-full",
  };

  const padding = "p-6";
  const structure = props.scrollable ? "max-h-[90vh] flex flex-col" : "";

  return `${base} ${sizes[props.size]} ${padding} ${structure}`;
});

const bodyClasses = computed(() => {
  return props.scrollable ? "overflow-y-auto flex-1" : "";
});

const close = () => {
  emit("update:modelValue", false);
  emit("close");
};

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    close();
  }
};

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
);
</script>
