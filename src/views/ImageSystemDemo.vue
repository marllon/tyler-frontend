<!-- 
  EXEMPLO DE INTEGRAÇÃO COMPLETA DOS COMPONENTES DE IMAGEM
  
  Este arquivo demonstra como usar o sistema completo de gerenciamento
  de imagens para produtos no frontend Tyler.
-->

<template>
  <div class="max-w-4xl mx-auto p-6 space-y-8">
    <header>
      <h1 class="text-3xl font-bold text-gray-900">
        Sistema de Imagens - Demonstração
      </h1>
      <p class="text-gray-600 mt-2">
        Exemplos de uso dos componentes ImageUpload, ImageGallery e
        ProductImageManager
      </p>
    </header>

    <!-- Exemplo 1: Upload de Imagens para Novo Produto -->
    <section class="bg-white border border-gray-200 rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">
        1. Upload para Novo Produto
      </h2>
      <p class="text-gray-600 mb-4">
        Use o ImageUpload para adicionar imagens a um novo produto:
      </p>

      <ImageUpload
        v-model="newProductImages"
        :max-files="8"
        :max-file-size="5242880"
        allowed-types="image/jpeg,image/jpg,image/png,image/webp"
        @validation-change="onNewImagesValidationChange"
      />

      <div
        v-if="newProductImages.length > 0"
        class="mt-4 p-3 bg-green-50 border border-green-200 rounded"
      >
        <p class="text-green-800 text-sm">
          ✅ {{ newProductImages.length }}
          {{
            newProductImages.length === 1
              ? "imagem selecionada"
              : "imagens selecionadas"
          }}
        </p>
      </div>
    </section>

    <!-- Exemplo 2: Galeria de Imagens -->
    <section class="bg-white border border-gray-200 rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">
        2. Galeria de Imagens
      </h2>
      <p class="text-gray-600 mb-4">
        Visualize imagens com navegação, fullscreen e thumbnails:
      </p>

      <div class="grid grid-cols-4 gap-4">
        <div
          v-for="(image, index) in sampleImages"
          :key="index"
          class="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
          @click="openGallery(index)"
        >
          <img
            :src="image.url"
            :alt="image.alt"
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <ImageGallery
        v-if="showGallery"
        :images="sampleImages"
        :initial-index="galleryIndex"
        @close="closeGallery"
      />
    </section>

    <!-- Exemplo 3: Gerenciamento de Produto Existente -->
    <section class="bg-white border border-gray-200 rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">
        3. Gerenciar Produto Existente
      </h2>
      <p class="text-gray-600 mb-4">
        Use o ProductImageManager para editar imagens de produtos existentes:
      </p>

      <ProductImageManager
        :images="existingProductImages"
        @update:images="updateExistingImages"
        @primary-changed="onPrimaryChanged"
        @image-deleted="onImageDeleted"
        @images-reordered="onImagesReordered"
      />
    </section>

    <!-- Exemplo 4: Formulário Completo -->
    <section class="bg-white border border-gray-200 rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">
        4. Formulário Completo de Produto
      </h2>
      <p class="text-gray-600 mb-4">Exemplo de como integrar no ProductForm:</p>

      <div class="bg-gray-50 border border-gray-200 rounded p-4">
        <pre
          class="text-sm text-gray-700 overflow-x-auto"
        ><code>&lt;!-- No ProductForm.vue --&gt;
&lt;div class="border-t pt-6"&gt;
  &lt;h3 class="text-lg font-medium text-gray-900 mb-4"&gt;Imagens do Produto&lt;/h3&gt;
  
  &lt;!-- Modo Edição --&gt;
  &lt;div v-if="isEdit && initialData?.images?.length" class="space-y-6"&gt;
    &lt;ProductImageManager
      :images="existingImages"
      @update:images="updateExistingImages"
      @primary-changed="onPrimaryImageChanged"
      @image-deleted="onImageDeleted"
      @images-reordered="onImagesReordered"
    /&gt;
    
    &lt;div class="border-t pt-4"&gt;
      &lt;h4 class="text-md font-medium text-gray-700 mb-4"&gt;Adicionar Novas Imagens&lt;/h4&gt;
      &lt;ImageUpload
        v-model="selectedImages"
        :max-files="10"
        @validation-change="onImageValidationChange"
      /&gt;
    &lt;/div&gt;
  &lt;/div&gt;
  
  &lt;!-- Modo Criação --&gt;
  &lt;div v-else&gt;
    &lt;ImageUpload
      v-model="selectedImages"
      :max-files="10"
      @validation-change="onImageValidationChange"
    /&gt;
  &lt;/div&gt;
&lt;/div&gt;</code></pre>
      </div>
    </section>

    <!-- Estatísticas -->
    <section class="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-blue-900 mb-4">
        📊 Estatísticas dos Componentes
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-lg p-4">
          <h4 class="font-medium text-gray-900">ImageUpload</h4>
          <p class="text-2xl font-bold text-blue-600">
            {{ newProductImages.length }}
          </p>
          <p class="text-sm text-gray-600">Imagens pendentes</p>
        </div>

        <div class="bg-white rounded-lg p-4">
          <h4 class="font-medium text-gray-900">ImageGallery</h4>
          <p class="text-2xl font-bold text-green-600">
            {{ sampleImages.length }}
          </p>
          <p class="text-sm text-gray-600">Imagens na galeria</p>
        </div>

        <div class="bg-white rounded-lg p-4">
          <h4 class="font-medium text-gray-900">ProductImageManager</h4>
          <p class="text-2xl font-bold text-purple-600">
            {{ existingProductImages.length }}
          </p>
          <p class="text-sm text-gray-600">Imagens do produto</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  ImageUpload,
  ImageGallery,
  ProductImageManager,
} from "@/components/ui";
import type { ProductImage } from "@/types";

// ============================================
// STATE
// ============================================
const newProductImages = ref<File[]>([]);
const showGallery = ref(false);
const galleryIndex = ref(0);

const existingProductImages = ref<ProductImage[]>([
  {
    id: "1",
    url: "https://picsum.photos/400/400?random=1",
    alt: "Produto exemplo 1",
    isMain: true,
    order: 1,
  },
  {
    id: "2",
    url: "https://picsum.photos/400/400?random=2",
    alt: "Produto exemplo 2",
    isMain: false,
    order: 2,
  },
  {
    id: "3",
    url: "https://picsum.photos/400/400?random=3",
    alt: "Produto exemplo 3",
    isMain: false,
    order: 3,
  },
]);

const sampleImages = [
  {
    id: "1",
    url: "https://picsum.photos/600/600?random=10",
    alt: "Imagem exemplo 1",
  },
  {
    id: "2",
    url: "https://picsum.photos/600/600?random=11",
    alt: "Imagem exemplo 2",
  },
  {
    id: "3",
    url: "https://picsum.photos/600/600?random=12",
    alt: "Imagem exemplo 3",
  },
  {
    id: "4",
    url: "https://picsum.photos/600/600?random=13",
    alt: "Imagem exemplo 4",
  },
];

// ============================================
// METHODS
// ============================================
function onNewImagesValidationChange(isValid: boolean) {
  console.log("Validação das novas imagens:", isValid);
}

function openGallery(index: number) {
  galleryIndex.value = index;
  showGallery.value = true;
}

function closeGallery() {
  showGallery.value = false;
  galleryIndex.value = 0;
}

function updateExistingImages(newImages: ProductImage[]) {
  existingProductImages.value = newImages;
  console.log("Imagens existentes atualizadas:", newImages);
}

function onPrimaryChanged(imageId: string | number) {
  console.log("Nova imagem principal:", imageId);
}

function onImageDeleted(imageId: string | number) {
  console.log("Imagem deletada:", imageId);
}

function onImagesReordered(newOrder: ProductImage[]) {
  console.log("Nova ordem das imagens:", newOrder);
}
</script>

<style scoped>
/* Adicione estilos personalizados se necessário */
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
