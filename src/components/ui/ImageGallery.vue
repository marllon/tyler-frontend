<template>
  <div>
    <!-- Imagem principal -->
    <div class="relative overflow-hidden rounded-lg mb-2">
      <img
        :src="images[currentIndex]"
        :alt="`Imagem ${currentIndex + 1}`"
        class="w-full h-full object-cover transition-opacity duration-300"
      />
      
      <!-- Navegação de setas -->
      <button
        v-if="images.length > 1"
        @click="prev"
        class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
        aria-label="Imagem anterior"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        v-if="images.length > 1"
        @click="next"
        class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
        aria-label="Próxima imagem"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Indicador de imagem atual -->
      <div
        v-if="images.length > 1"
        class="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm"
      >
        {{ currentIndex + 1 }} / {{ images.length }}
      </div>
    </div>

    <!-- Miniaturas -->
    <div v-if="showThumbnails && images.length > 1" class="flex gap-2 overflow-x-auto">
      <button
        v-for="(image, index) in images"
        :key="index"
        @click="currentIndex = index"
        :class="[
          'flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all',
          currentIndex === index
            ? 'border-tyler-blue scale-105'
            : 'border-transparent opacity-60 hover:opacity-100'
        ]"
      >
        <img :src="image" :alt="`Miniatura ${index + 1}`" class="w-full h-full object-cover" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  images: string[]
  showThumbnails?: boolean
  autoPlay?: boolean
  interval?: number
}

const props = withDefaults(defineProps<Props>(), {
  showThumbnails: true,
  autoPlay: false,
  interval: 3000
})

const currentIndex = ref(0)

function next() {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

function prev() {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

// Auto-play (opcional)
if (props.autoPlay) {
  setInterval(() => {
    next()
  }, props.interval)
}
</script>
