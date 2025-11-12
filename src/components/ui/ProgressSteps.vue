<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
      <div class="text-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <p class="text-sm text-gray-600 mt-1">{{ currentMessage }}</p>
      </div>

      <!-- Progress Bar -->
      <div class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-700">
            {{ currentStep }}/{{ totalSteps }}
          </span>
          <span class="text-sm font-medium text-blue-600">
            {{ percentage }}%
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div
            class="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
            :style="{ width: `${percentage}%` }"
          ></div>
        </div>
      </div>

      <!-- Current Step Details -->
      <div class="space-y-2">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="flex items-center space-x-3 text-sm"
        >
          <div class="flex-shrink-0">
            <div
              v-if="step.status === 'completed'"
              class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
            >
              <svg
                class="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <div
              v-else-if="step.status === 'current'"
              class="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
            >
              <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
            <div v-else class="w-5 h-5 bg-gray-300 rounded-full"></div>
          </div>
          <span
            :class="[
              step.status === 'completed'
                ? 'text-green-700'
                : step.status === 'current'
                ? 'text-blue-700 font-medium'
                : 'text-gray-500',
            ]"
          >
            {{ step.name }}
          </span>
        </div>
      </div>

      <!-- Cancel Button (opcional) -->
      <div v-if="showCancel" class="mt-6 flex justify-center">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Step {
  name: string;
  status: "pending" | "current" | "completed";
}

interface Props {
  show: boolean;
  title: string;
  currentStep: number;
  totalSteps: number;
  percentage: number;
  currentMessage: string;
  steps: Step[];
  showCancel?: boolean;
}

defineProps<Props>();
defineEmits<{
  cancel: [];
}>();
</script>
