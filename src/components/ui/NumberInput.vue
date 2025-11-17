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
      <div class="relative flex-1 flex items-center gap-2">
        <div class="relative flex-1">
          <span
            v-if="prefix"
            class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"
          >
            {{ prefix }}
          </span>
          <input
            :id="inputId"
            :type="inputType"
            :step="step"
            :min="min"
            :max="max"
            :value="modelValue"
            @input="handleInput"
            @wheel.prevent
            :placeholder="placeholder"
            :disabled="disabled"
            :class="[
              'block w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
              prefix ? 'pl-10 pr-3' : 'pl-3 pr-3',
            ]"
          />
        </div>
        <span v-if="suffix" class="text-sm text-gray-500 whitespace-nowrap">
          {{ suffix }}
        </span>
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
  prefix?: string;
  suffix?: string;
  step?: string;
  min?: string;
  max?: string;
  inputType?: "number" | "text";
}

const props = withDefaults(defineProps<Props>(), {
  increments: () => [1, 5, 10],
  placeholder: "0",
  step: "1",
  min: "0",
  inputType: "number",
});

const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();

const inputId = computed(
  () => `number-input-${Math.random().toString(36).substr(2, 9)}`
);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value =
    props.step === "1"
      ? parseInt(target.value) || 0
      : parseFloat(target.value) || 0;
  emit("update:modelValue", value);
};

const addIncrement = (amount: number) => {
  const newValue = (props.modelValue || 0) + amount;
  const maxValue = props.max ? parseFloat(props.max) : Infinity;
  emit("update:modelValue", Math.min(newValue, maxValue));
};
</script>
