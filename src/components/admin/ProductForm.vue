<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Informações Básicas -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Nome -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
          Nome do Produto *
        </label>
        <BaseInput
          id="name"
          v-model="form.name"
          type="text"
          required
          placeholder="Ex: Camiseta Tyler"
          :error="errors.name"
        />
      </div>

      <!-- Categoria -->
      <div>
        <label
          for="category"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          Categoria *
        </label>
        <select
          id="category"
          v-model="form.category"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Selecione uma categoria</option>
          <option value="Vestuário">Vestuário</option>
          <option value="Casa">Casa & Decoração</option>
          <option value="Acessórios">Acessórios</option>
          <option value="Papelaria">Papelaria</option>
          <option value="Eletrônicos">Eletrônicos</option>
          <option value="Esporte">Esporte & Lazer</option>
          <option value="Outros">Outros</option>
        </select>
      </div>

      <!-- Preço -->
      <div>
        <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
          Preço (R$) *
        </label>
        <BaseInput
          id="price"
          v-model.number="form.price"
          type="number"
          step="0.01"
          min="0"
          required
          placeholder="0,00"
          :error="errors.price"
        />
      </div>

      <!-- Estoque -->
      <div>
        <label for="stock" class="block text-sm font-medium text-gray-700 mb-2">
          Estoque *
        </label>
        <BaseInput
          id="stock"
          v-model.number="form.stock"
          type="number"
          min="0"
          required
          placeholder="0"
          :error="errors.stock"
        />
      </div>
    </div>

    <!-- Descrição -->
    <div>
      <label
        for="description"
        class="block text-sm font-medium text-gray-700 mb-2"
      >
        Descrição *
      </label>
      <textarea
        id="description"
        v-model="form.description"
        required
        rows="4"
        placeholder="Descreva o produto detalhadamente..."
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    <!-- Informações Adicionais -->
    <div class="border-t pt-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        Informações Adicionais (Opcional)
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Marca -->
        <div>
          <label
            for="brand"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Marca
          </label>
          <BaseInput
            id="brand"
            v-model="form.brand"
            type="text"
            placeholder="Ex: Nike, Apple, etc."
          />
        </div>

        <!-- Modelo -->
        <div>
          <label
            for="model"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Modelo
          </label>
          <BaseInput
            id="model"
            v-model="form.model"
            type="text"
            placeholder="Ex: Air Max, iPhone 14, etc."
          />
        </div>

        <!-- Cor -->
        <div>
          <label
            for="color"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Cor
          </label>
          <BaseInput
            id="color"
            v-model="form.color"
            type="text"
            placeholder="Ex: Azul, Vermelho, etc."
          />
        </div>

        <!-- Peso -->
        <div>
          <label
            for="weight"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Peso
          </label>
          <BaseInput
            id="weight"
            v-model="form.weight"
            type="text"
            placeholder="Ex: 500g, 1.2kg"
          />
        </div>

        <!-- Dimensões -->
        <div>
          <label
            for="dimensions"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Dimensões
          </label>
          <BaseInput
            id="dimensions"
            v-model="form.dimensions"
            type="text"
            placeholder="Ex: 30x20x10cm"
          />
        </div>

        <!-- Garantia -->
        <div>
          <label
            for="warranty"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Garantia
          </label>
          <BaseInput
            id="warranty"
            v-model="form.warranty"
            type="text"
            placeholder="Ex: 12 meses, 2 anos"
          />
        </div>
      </div>

      <!-- Tags -->
      <div class="mt-6">
        <label for="tags" class="block text-sm font-medium text-gray-700 mb-2">
          Tags (separadas por vírgula)
        </label>
        <BaseInput
          id="tags"
          v-model="tagsInput"
          type="text"
          placeholder="Ex: casual, confortável, algodão"
          @blur="processTags"
        />
        <div
          v-if="form.tags && form.tags.length > 0"
          class="mt-2 flex flex-wrap gap-2"
        >
          <Badge
            v-for="(tag, index) in form.tags"
            :key="index"
            variant="secondary"
            class="cursor-pointer"
            @click="removeTag(index)"
          >
            {{ tag }} ×
          </Badge>
        </div>
      </div>
    </div>

    <!-- Upload de Imagens -->
    <div class="border-t pt-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Imagens do Produto</h3>

      <!-- Modo Edição: Sempre mostrar gerenciamento + upload -->
      <div v-if="isEdit" class="space-y-6">
        <!-- Gerenciamento de Imagens Existentes (se houver) -->
        <div v-if="existingImages.length > 0">
          <h4 class="text-md font-medium text-gray-700 mb-4">Imagens Atuais</h4>
          <ProductImageManager
            :images="existingImages"
            @update:images="updateExistingImages"
            @primary-changed="onPrimaryImageChanged"
            @image-deleted="onImageDeleted"
            @images-reordered="onImagesReordered"
          />
        </div>

        <!-- Upload de Novas Imagens -->
        <div>
          <h4 class="text-md font-medium text-gray-700 mb-4">
            {{
              existingImages.length > 0
                ? "Adicionar Novas Imagens"
                : "Adicionar Imagens"
            }}
          </h4>
          <ImageUpload
            v-model="selectedImages"
            :max-files="10"
            @validation-change="onImageValidationChange"
          />
        </div>
      </div>

      <!-- Modo Criação: Apenas upload -->
      <div v-else>
        <ImageUpload
          v-model="selectedImages"
          :max-files="10"
          @validation-change="onImageValidationChange"
        />
      </div>
    </div>

    <!-- Status Ativo -->
    <div class="border-t pt-6">
      <div class="flex items-center">
        <input
          id="active"
          v-model="form.active"
          type="checkbox"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label for="active" class="ml-2 block text-sm text-gray-900">
          Produto ativo (visível na loja)
        </label>
      </div>
    </div>

    <!-- Botões de Ação -->
    <div class="flex justify-end space-x-4 pt-6 border-t">
      <BaseButton
        type="button"
        variant="outline"
        @click="$emit('cancel')"
        :disabled="loading"
      >
        Cancelar
      </BaseButton>

      <BaseButton
        type="submit"
        variant="primary"
        :loading="loading"
        :disabled="!isFormValid"
      >
        {{ isEdit ? "Atualizar Produto" : "Criar Produto" }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import type { ProductCreateRequest, Product, ProductImage } from "@/types";
import {
  BaseInput,
  BaseButton,
  ImageUpload,
  ProductImageManager,
  Badge,
} from "@/components/ui";

interface Props {
  initialData?: Product | null;
  loading?: boolean;
}

interface Emits {
  (
    e: "submit",
    data: {
      productData: ProductCreateRequest;
      images: File[];
      existingImages?: ProductImage[];
      imagesToDelete?: string[];
      primaryImageId?: string | null;
    }
  ): void;
  (e: "cancel"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const form = ref<ProductCreateRequest>({
  name: "",
  description: "",
  price: 0,
  category: "",
  stock: 0,
  active: true,
  brand: "",
  model: "",
  weight: "",
  dimensions: "",
  color: "",
  warranty: "",
  tags: [],
});

const selectedImages = ref<File[]>([]);
const tagsInput = ref("");
const errors = ref<Record<string, string>>({});
const isImagesValid = ref(false);
const existingImages = ref<ProductImage[]>([]);
const imagesToDelete = ref<string[]>([]);
const primaryImageId = ref<string | null>(null);

const isEdit = computed(() => !!props.initialData);

const isFormValid = computed(() => {
  return (
    form.value.name.trim().length > 0 &&
    form.value.description.trim().length > 0 &&
    form.value.category.trim().length > 0 &&
    form.value.price > 0 &&
    form.value.stock >= 0 &&
    Object.keys(errors.value).length === 0
  );
});

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      loadInitialData(newData);
    } else {
      resetForm();
    }
  },
  { immediate: true }
);
watch(() => form.value.name, validateName);
watch(() => form.value.price, validatePrice);
watch(() => form.value.stock, validateStock);

function loadInitialData(product: Product) {
  form.value = {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    stock: product.stock,
    active: product.active,
    brand: product.brand || "",
    model: product.model || "",
    weight: product.weight || "",
    dimensions: product.dimensions || "",
    color: product.color || "",
    warranty: product.warranty || "",
    tags: product.tags || [],
  };
  tagsInput.value = product.tags?.join(", ") || "";
  if (product.images && product.images.length > 0) {
    console.log("ProductForm - Processando imagens:", product.images);
    existingImages.value = product.images.map((img) => ({
      id: img.id,
      url: img.url,
      isPrimary: img.isPrimary || false,
      isMain: img.isPrimary || false, // Compatibilidade com ProductImageManager
      uploadedAt: img.uploadedAt,
    }));
    const primaryImage = product.images.find((img) => img.isPrimary);
    primaryImageId.value = primaryImage?.id?.toString() || null;

    console.log("Imagens carregadas para edição:", existingImages.value);
  } else {
    existingImages.value = [];
    primaryImageId.value = null;
    console.log("ProductForm - Nenhuma imagem encontrada no produto");
  }
}

function resetForm() {
  form.value = {
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    active: true,
    brand: "",
    model: "",
    weight: "",
    dimensions: "",
    color: "",
    warranty: "",
    tags: [],
  };
  selectedImages.value = [];
  tagsInput.value = "";
  errors.value = {};
  existingImages.value = [];
  imagesToDelete.value = [];
  primaryImageId.value = null;
}

function processTags() {
  if (tagsInput.value.trim()) {
    form.value.tags = tagsInput.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
      .slice(0, 10); // Máximo 10 tags
  } else {
    form.value.tags = [];
  }
}

function removeTag(index: number) {
  form.value.tags?.splice(index, 1);
  tagsInput.value = form.value.tags?.join(", ") || "";
}

function validateName() {
  if (form.value.name.trim().length === 0) {
    errors.value.name = "Nome é obrigatório";
  } else if (form.value.name.trim().length < 3) {
    errors.value.name = "Nome deve ter pelo menos 3 caracteres";
  } else {
    delete errors.value.name;
  }
}

function validatePrice() {
  if (form.value.price <= 0) {
    errors.value.price = "Preço deve ser maior que zero";
  } else if (form.value.price > 999999) {
    errors.value.price = "Preço muito alto";
  } else {
    delete errors.value.price;
  }
}

function validateStock() {
  if (form.value.stock < 0) {
    errors.value.stock = "Estoque não pode ser negativo";
  } else {
    delete errors.value.stock;
  }
}

function onImageValidationChange(isValid: boolean) {
  isImagesValid.value = isValid;
}

function updateExistingImages(newImages: ProductImage[]) {
  existingImages.value = newImages;
}

function onPrimaryImageChanged(imageId: string | number) {
  primaryImageId.value = imageId.toString();
}

function onImageDeleted(imageId: string | number) {
  imagesToDelete.value.push(imageId.toString());
}

function onImagesReordered(newOrder: ProductImage[]) {
  existingImages.value = newOrder;
}

function handleSubmit() {
  validateName();
  validatePrice();
  validateStock();

  if (!isFormValid.value) {
    return;
  }
  processTags();
  const cleanData = { ...form.value };
  if (!cleanData.brand?.trim()) delete cleanData.brand;
  if (!cleanData.model?.trim()) delete cleanData.model;
  if (!cleanData.weight?.trim()) delete cleanData.weight;
  if (!cleanData.dimensions?.trim()) delete cleanData.dimensions;
  if (!cleanData.color?.trim()) delete cleanData.color;
  if (!cleanData.warranty?.trim()) delete cleanData.warranty;
  if (!cleanData.tags?.length) delete cleanData.tags;

  emit("submit", {
    productData: cleanData,
    images: selectedImages.value,
    existingImages: isEdit.value ? existingImages.value : undefined,
    imagesToDelete: isEdit.value ? imagesToDelete.value : undefined,
    primaryImageId: isEdit.value ? primaryImageId.value : undefined,
  });
}

onMounted(() => {
  if (props.initialData) {
    validateName();
    validatePrice();
    validateStock();
  }
});
</script>
