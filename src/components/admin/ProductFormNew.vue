<template>
  <!-- Progress Steps Modal -->
  <ProgressSteps
    :show="showProgress"
    title="Criando Produto"
    :current-step="progressState.current"
    :total-steps="progressState.total"
    :percentage="progressState.percentage"
    :current-message="progressState.message"
    :steps="progressSteps"
  />

  <form @submit.prevent="handleSubmit" class="space-y-8">
    <!-- SEÇÃO DE IMAGENS - PRIMEIRO -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3
        class="text-lg font-medium text-gray-900 mb-6 border-b border-gray-200 pb-3"
      >
        Imagens do Produto
      </h3>

      <!-- Novo Gerenciador Unificado (estilo Mercado Livre) -->
      <UnifiedImageUpload
        :images="allImages"
        :max-files="10"
        @update:images="updateAllImages"
        @primary-changed="onPrimaryImageChanged"
        @image-deleted="onImageDeleted"
      />
    </div>

    <!-- INFORMAÇÕES BÁSICAS -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3
        class="text-lg font-medium text-gray-900 mb-6 border-b border-gray-200 pb-3"
      >
        Informações Básicas
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Nome -->
        <div>
          <label
            for="name"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
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
          <PriceInput
            v-model="form.price"
            label="Preço (R$) *"
            placeholder="0,00"
            :increments="[5, 10, 20]"
            hint="Use os botões para incrementar rapidamente"
          />
          <p v-if="errors.price" class="mt-1 text-sm text-red-600">
            {{ errors.price }}
          </p>
        </div>

        <!-- Estoque -->
        <div>
          <NumberInput
            v-model="form.stock"
            label="Estoque *"
            placeholder="0"
            :increments="[1, 5, 10]"
            suffix="unid."
            hint="Use os botões para incrementar rapidamente"
          />
          <p v-if="errors.stock" class="mt-1 text-sm text-red-600">
            {{ errors.stock }}
          </p>
        </div>
      </div>

      <!-- Descrição -->
      <div class="mt-6">
        <label
          for="description"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          Descrição *
          <span class="text-xs text-gray-500 font-normal ml-2">
            (Aceita HTML ou texto simples - quebras de linha são preservadas)
          </span>
        </label>
        <textarea
          id="description"
          v-model="form.description"
          required
          rows="6"
          placeholder="Digite a descrição do produto...&#10;&#10;Use HTML para formatação avançada: &lt;strong&gt;negrito&lt;/strong&gt;, &lt;em&gt;itálico&lt;/em&gt;, &lt;br&gt;, etc.&#10;Ou simplesmente digite texto - as quebras de linha serão preservadas automaticamente."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>

      <!-- Status Ativo -->
      <div class="mt-6 pt-4 border-t border-gray-200">
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
    </div>

    <!-- INFORMAÇÕES ADICIONAIS (Opcionais e Recolhível) -->
    <div class="bg-white rounded-lg border border-gray-200">
      <button
        type="button"
        @click="showAdditionalInfo = !showAdditionalInfo"
        class="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
      >
        <h3 class="text-lg font-medium text-gray-900">
          Informações Adicionais (Opcional)
        </h3>
        <svg
          class="w-5 h-5 text-gray-500 transition-transform"
          :class="{ 'rotate-180': showAdditionalInfo }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div v-if="showAdditionalInfo" class="px-6 pb-6">
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
          <label
            for="tags"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
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
      <BaseButton type="submit" :loading="loading" :disabled="!isFormValid">
        {{ isEdit ? "Atualizar Produto" : "Criar Produto" }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import type { ProductCreateRequest, Product, ProductImage } from "@/types";
import { useSafeHtml } from "@/composables";
import {
  BaseInput,
  BaseButton,
  UnifiedImageUpload,
  Badge,
  ProgressSteps,
  PriceInput,
  NumberInput,
} from "@/components/ui";

const { sanitizeHtml, processDescription, isHtml } = useSafeHtml();

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
  (e: "form-change"): void;
  (
    e: "progress",
    data: {
      step: string;
      current: number;
      total: number;
      percentage: number;
      message: string;
    }
  ): void;
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
const newImageFiles = ref<File[]>([]); // Armazenar Files das novas imagens
const tagsInput = ref("");
const errors = ref<Record<string, string>>({});
const isImagesValid = ref(false);
const existingImages = ref<ProductImage[]>([]);
const imagesToDelete = ref<string[]>([]);
const primaryImageId = ref<string | null>(null);
const showImageUpload = ref(true); // Mostrar upload por padrão
const showAdditionalInfo = ref(false);

const allImages = ref<any[]>([]);

const showProgress = ref(false);
const progressState = ref({
  step: "",
  current: 0,
  total: 0,
  percentage: 0,
  message: "",
});

const progressSteps = computed(() => {
  const steps = [{ name: "Criando produto", status: "pending" as const }];

  newImageFiles.value.forEach((file, index) => {
    steps.push({
      name: `Imagem ${index + 1}: ${file.name}`,
      status: "pending" as const,
    });
  });

  return steps.map((step, index) => ({
    ...step,
    status:
      index < progressState.value.current - 1
        ? "completed"
        : index === progressState.value.current - 1
        ? "current"
        : "pending",
  }));
});

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

watch(
  () => form.value,
  () => {
    emit("form-change");
  },
  { deep: true }
);

watch(
  () => existingImages.value,
  () => {
    emit("form-change");
  },
  { deep: true }
);

watch(
  () => newImageFiles.value.length,
  () => {
    emit("form-change");
  }
);

function loadInitialData(product: Product) {
  form.value = {
    name: product.name,
    description: product.description,
    price: parseFloat(product.price.toFixed(2)), // Garante 2 casas decimais
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
    existingImages.value = product.images.map((img) => ({
      id: img.id,
      url: img.url,
      isPrimary: img.isPrimary || false,
      isMain: img.isPrimary || false, // Compatibilidade com SimpleImageManager
      uploadedAt: img.uploadedAt,
    }));

    const primaryImage = product.images.find((img) => img.isPrimary);
    primaryImageId.value = primaryImage?.id?.toString() || null;
  } else {
    existingImages.value = [];
    primaryImageId.value = null;
  }

  showAdditionalInfo.value = !!(
    product.brand ||
    product.model ||
    product.weight ||
    product.dimensions ||
    product.color ||
    product.warranty ||
    product.tags?.length
  );
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
  newImageFiles.value = [];
  tagsInput.value = "";
  errors.value = {};
  existingImages.value = [];
  imagesToDelete.value = [];
  primaryImageId.value = null;
  showImageUpload.value = false;
  showAdditionalInfo.value = false;
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

function onFilesSelected(files: File[]) {
  selectedImages.value = files;
}

function closeImageUpload() {
  if (existingImages.value.length > 0) {
    showImageUpload.value = false;
  }
  selectedImages.value = []; // Limpar seleção se o usuário cancelar
}

function addSelectedImages() {
  if (selectedImages.value.length === 0) return;

  newImageFiles.value.push(...selectedImages.value);

  const newImageData: ProductImage[] = selectedImages.value.map(
    (file, index) => ({
      id: `temp-${Date.now()}-${index}`, // ID temporário para novas imagens
      url: URL.createObjectURL(file), // URL temporária para preview
      isPrimary: existingImages.value.length === 0 && index === 0, // Primeira imagem se não houver outras
      isMain: existingImages.value.length === 0 && index === 0, // Compatibilidade
      uploadedAt: new Date().toISOString(),
      _fileIndex:
        newImageFiles.value.length - selectedImages.value.length + index, // Índice para encontrar o File original
    })
  );

  existingImages.value.push(...newImageData);

  emit("form-change");

  showImageUpload.value = false;
  selectedImages.value = [];
}

function updateExistingImages(newImages: ProductImage[]) {
  existingImages.value = newImages;
}

function updateAllImages(newImages: any[]) {
  console.log("🖼️ UpdateAllImages called:", newImages);

  const existing = newImages.filter((img) => !img.file);
  const newFiles = newImages.filter((img) => img.file);

  existingImages.value = existing;
  newImageFiles.value = newFiles.map((img) => img.file);

  allImages.value = newImages;

  emit("form-change");
}

function onPrimaryImageChanged(imageId: string | number) {
  primaryImageId.value = imageId.toString();
}

function onImageDeleted(imageId: string | number) {
  imagesToDelete.value.push(imageId.toString());
  emit("form-change");
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

  cleanData.price = parseFloat(cleanData.price.toFixed(2));

  if (!cleanData.brand?.trim()) delete cleanData.brand;
  if (!cleanData.model?.trim()) delete cleanData.model;
  if (!cleanData.weight?.trim()) delete cleanData.weight;
  if (!cleanData.dimensions?.trim()) delete cleanData.dimensions;
  if (!cleanData.color?.trim()) delete cleanData.color;
  if (!cleanData.warranty?.trim()) delete cleanData.warranty;
  if (!cleanData.tags?.length) delete cleanData.tags;

  const imagesToSubmit = allImages.value
    .filter((img) => img.file) // Apenas imagens novas com arquivo
    .map((img) => img.file);

  if (imagesToSubmit.length > 0) {
    showProgress.value = true;
    progressState.value = {
      step: "create-product",
      current: 0,
      total: 1 + imagesToSubmit.length,
      percentage: 0,
      message: "Iniciando criação do produto...",
    };
  }

  console.log("🚀 Submitting product with images:", {
    productData: cleanData,
    images: imagesToSubmit,
    imagesCount: imagesToSubmit.length,
  });

  emit("submit", {
    productData: cleanData,
    images: imagesToSubmit,
    existingImages: isEdit.value ? existingImagesForSubmit : undefined,
    imagesToDelete: isEdit.value ? imagesToDelete.value : undefined,
    primaryImageId: isEdit.value ? primaryImageId.value : undefined,
  });
}

function updateProgress(progress: {
  step: string;
  current: number;
  total: number;
  percentage: number;
  message: string;
}) {
  progressState.value = progress;
  emit("progress", progress);
}

function finishProgress() {
  showProgress.value = false;
  progressState.value = {
    step: "",
    current: 0,
    total: 0,
    percentage: 0,
    message: "",
  };
}

defineExpose({
  updateProgress,
  finishProgress,
});

onMounted(() => {
  if (props.initialData) {
    validateName();
    validatePrice();
    validateStock();
  }

  allImages.value = [...existingImages.value];
});
</script>

<style scoped>
:deep(.prose img) {
  @apply inline-block max-w-full h-auto max-h-24 rounded border border-gray-200;
  margin: 0.25rem;
}

:deep(.prose p) {
  @apply my-1;
}

:deep(.prose br) {
  @apply block my-1;
}

:deep(.prose strong),
:deep(.prose b) {
  @apply font-semibold text-gray-900;
}

:deep(.prose em),
:deep(.prose i) {
  @apply italic;
}

:deep(.prose a) {
  @apply text-blue-600 hover:underline;
}

:deep(.prose ul),
:deep(.prose ol) {
  @apply pl-5 my-2 list-disc;
}

:deep(.prose li) {
  @apply my-1;
}

:deep(.prose h1),
:deep(.prose h2),
:deep(.prose h3),
:deep(.prose h4) {
  @apply font-bold mt-3 mb-2;
}

:deep(.prose h1) {
  @apply text-xl;
}

:deep(.prose h2) {
  @apply text-lg;
}

:deep(.prose h3) {
  @apply text-base;
}
</style>
