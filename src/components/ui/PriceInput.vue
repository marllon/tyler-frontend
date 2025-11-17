<template>
  <div class="space-y-2">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700"
    >
      {{ label }}
    </label>
    <div class="flex items-center gap-2">
      <div class="relative flex-1">
        <span
          class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"
        >
          R$
        </span>
        <input
          :id="inputId"
          type="number"
          step="0.01"
          min="0"
          :value="modelValue"
          @input="handleInput"
          @wheel.prevent
          :placeholder="placeholder"
          :disabled="disabled"
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
      <div class="flex gap-1">
        <button
          v-for="increment in increments"
          :key="increment"
          type="button"
          @click="addIncrement(increment)"
          :disabled="disabled"
          class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
        >
          +{{ increment }}
        </button>
      </div>
    </div>
    <p v-if="hint" class="text-sm text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  modelValue: number;
  label?: string;
  placeholder?: string;
  hint?: string;
  disabled?: boolean;
  increments?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  increments: () => [5, 10, 20],
  placeholder: "0,00",
});

const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();

const inputId = computed(
  () => `price-input-${Math.random().toString(36).substr(2, 9)}`
);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let value = parseFloat(target.value) || 0;
  value = parseFloat(value.toFixed(2));
  emit("update:modelValue", value);
};

const addIncrement = (amount: number) => {
  let newValue = (props.modelValue || 0) + amount;
  newValue = parseFloat(newValue.toFixed(2));
  emit("update:modelValue", newValue);
};
</script>
