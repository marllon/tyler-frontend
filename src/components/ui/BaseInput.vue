<template>
  <div class="relative">
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="inputClasses"
      @input="handleInput"
      @blur="emit('blur')"
      @focus="emit('focus')"
    />
    <label v-if="label" :for="id" class="block text-gray-700 font-medium mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
    <p v-else-if="hint" class="mt-1 text-sm text-gray-500">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  id?: string;
  modelValue: string | number;
  type?: "text" | "email" | "password" | "tel" | "number" | "url";
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  disabled: false,
  required: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
  (e: "blur"): void;
  (e: "focus"): void;
}>();

const inputClasses = computed(() => {
  const base =
    "w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent";
  const state = props.error
    ? "border-red-300 focus:ring-red-500"
    : "border-gray-300 focus:ring-tyler-blue";
  const disabled = props.disabled
    ? "bg-gray-100 cursor-not-allowed"
    : "bg-white";

  return `${base} ${state} ${disabled}`;
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = props.type === "number" ? Number(target.value) : target.value;
  emit("update:modelValue", value);
};
</script>
