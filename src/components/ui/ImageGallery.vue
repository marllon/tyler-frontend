<template>
  <div class="image-gallery">
    <!-- Gallery Principal -->
    <div v-if="images.length > 0" class="gallery-container">
      <!-- Imagem Principal -->
      <div class="main-image-container">
        <div class="relative group">
          <img
            :src="currentImage.url"
            :alt="`${productName} - Imagem ${currentIndex + 1}`"
            class="main-image"
            @load="handleImageLoad"
            @error="handleImageError"
          />

          <!-- Loading State -->
          <div v-if="imageLoading" class="loading-overlay">
            <Spinner class="w-8 h-8 text-blue-500" />
          </div>

          <!-- Primary Badge -->
          <div
            v-if="currentImage.isPrimary"
            class="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-medium shadow-lg"
          >
            Principal
          </div>

          <!-- Navigation Arrows (apenas se múltiplas imagens) -->
          <div v-if="images.length > 1" class="navigation-arrows">
            <button
              @click="previousImage"
              :disabled="currentIndex === 0"
              class="nav-button nav-button-left"
              aria-label="Imagem anterior"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              @click="nextImage"
              :disabled="currentIndex === images.length - 1"
              class="nav-button nav-button-right"
              aria-label="Próxima imagem"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <!-- Fullscreen Button -->
          <button
            @click="openFullscreen"
            class="absolute top-3 right-3 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Ver em tela cheia"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </button>
        </div>

        <!-- Image Counter -->
        <div v-if="images.length > 1" class="image-counter">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>
      </div>

      <!-- Thumbnails -->
      <div
        v-if="images.length > 1 && showThumbnails"
        class="thumbnails-container"
      >
        <div class="thumbnails-scroll">
          <button
            v-for="(image, index) in images"
            :key="image.id"
            @click="setCurrentImage(index)"
            :class="[
              'thumbnail',
              { 'thumbnail-active': index === currentIndex },
            ]"
            :aria-label="`Ver imagem ${index + 1}`"
          >
            <img
              :src="image.url"
              :alt="`Thumbnail ${index + 1}`"
              class="thumbnail-image"
            />
            <div v-if="image.isPrimary" class="thumbnail-primary-badge">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Estado Vazio -->
    <div v-else class="empty-state">
      <div class="empty-state-content">
        <svg
          class="empty-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 class="empty-title">Nenhuma imagem</h3>
        <p class="empty-description">Este produto ainda não possui imagens.</p>
      </div>
    </div>

    <!-- Fullscreen Modal -->
    <Teleport to="body">
      <div
        v-if="fullscreenOpen"
        class="fullscreen-modal"
        @click="closeFullscreen"
        @keydown.esc="closeFullscreen"
      >
        <div class="fullscreen-content" @click.stop>
          <button
            @click="closeFullscreen"
            class="fullscreen-close"
            aria-label="Fechar tela cheia"
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

          <img
            :src="currentImage.url"
            :alt="`${productName} - Imagem em tela cheia`"
            class="fullscreen-image"
          />

          <!-- Fullscreen Navigation -->
          <div v-if="images.length > 1" class="fullscreen-navigation">
            <button
              @click="previousImage"
              :disabled="currentIndex === 0"
              class="fullscreen-nav-button"
            >
              <svg
                class="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              @click="nextImage"
              :disabled="currentIndex === images.length - 1"
              class="fullscreen-nav-button"
            >
              <svg
                class="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <div class="fullscreen-info">
            <span class="fullscreen-counter"
              >{{ currentIndex + 1 }} / {{ images.length }}</span
            >
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import type { ProductImage } from "@/types";
import Spinner from "./Spinner.vue";

interface Props {
  images: ProductImage[];
  productName?: string;
  showThumbnails?: boolean;
  aspectRatio?: "square" | "landscape" | "portrait" | "auto";
  size?: "small" | "medium" | "large";
}

const props = withDefaults(defineProps<Props>(), {
  images: () => [],
  productName: "Produto",
  showThumbnails: true,
  aspectRatio: "auto",
  size: "medium",
});
const currentIndex = ref(0);
const imageLoading = ref(false);
const fullscreenOpen = ref(false);
const currentImage = computed(() => {
  if (props.images.length === 0) return null;
  return props.images[currentIndex.value] || props.images[0];
});
const setCurrentImage = (index: number) => {
  if (index >= 0 && index < props.images.length) {
    currentIndex.value = index;
  }
};

const nextImage = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++;
  }
};

const previousImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const handleImageLoad = () => {
  imageLoading.value = false;
};

const handleImageError = () => {
  imageLoading.value = false;
  console.error("Erro ao carregar imagem:", currentImage.value?.url);
};

const openFullscreen = () => {
  fullscreenOpen.value = true;
  document.body.style.overflow = "hidden";
};

const closeFullscreen = () => {
  fullscreenOpen.value = false;
  document.body.style.overflow = "auto";
};
const handleKeydown = (event: KeyboardEvent) => {
  if (!fullscreenOpen.value) return;

  if (event.key === "ArrowRight") {
    nextImage();
  } else if (event.key === "ArrowLeft") {
    previousImage();
  } else if (event.key === "Escape") {
    closeFullscreen();
  }
};
watch(
  () => props.images,
  () => {
    currentIndex.value = 0;
  },
  { immediate: true }
);

watch(currentIndex, () => {
  imageLoading.value = true;
});
onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "auto";
});
</script>

<style scoped>
.image-gallery {
  @apply w-full;
}

.gallery-container {
  @apply space-y-4;
}

.main-image-container {
  @apply relative;
}

.main-image {
  @apply w-full h-80 object-cover rounded-lg shadow-lg transition-all duration-300;
}

.loading-overlay {
  @apply absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center;
}

.navigation-arrows {
  @apply absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none;
}

.nav-button {
  @apply pointer-events-auto bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}

.nav-button-left {
  @apply ml-3;
}

.nav-button-right {
  @apply mr-3;
}

.image-counter {
  @apply absolute bottom-3 right-3 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm font-medium;
}

.thumbnails-container {
  @apply w-full;
}

.thumbnails-scroll {
  @apply flex space-x-3 overflow-x-auto pb-2;
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}

.thumbnails-scroll::-webkit-scrollbar {
  height: 6px;
}

.thumbnails-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.thumbnails-scroll::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 3px;
}

.thumbnails-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}

.thumbnail {
  @apply relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

.thumbnail-active {
  @apply border-blue-500 ring-2 ring-blue-500 ring-offset-2;
}

.thumbnail-image {
  @apply w-full h-full object-cover;
}

.thumbnail-primary-badge {
  @apply absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-1 shadow-lg;
}

.empty-state {
  @apply bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center;
}

.empty-state-content {
  @apply max-w-sm mx-auto;
}

.empty-icon {
  @apply mx-auto h-12 w-12 text-gray-400 mb-4;
}

.empty-title {
  @apply text-lg font-medium text-gray-900 mb-2;
}

.empty-description {
  @apply text-gray-500;
}

.fullscreen-modal {
  @apply fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center;
}

.fullscreen-content {
  @apply relative max-w-full max-h-full p-4;
}

.fullscreen-close {
  @apply absolute top-4 right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-200;
}

.fullscreen-image {
  @apply max-w-full max-h-full object-contain;
}

.fullscreen-navigation {
  @apply absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4;
}

.fullscreen-nav-button {
  @apply bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-4 rounded-full transition-all duration-200 disabled:opacity-25;
}

.fullscreen-info {
  @apply absolute bottom-4 left-1/2 transform -translate-x-1/2;
}

.fullscreen-counter {
  @apply bg-black bg-opacity-75 text-white px-4 py-2 rounded-full text-sm font-medium;
}
@media (max-width: 640px) {
  .main-image {
    @apply h-64;
  }

  .thumbnail {
    @apply w-16 h-16;
  }

  .nav-button {
    @apply p-1.5;
  }
}
</style>
