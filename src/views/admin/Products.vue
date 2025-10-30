<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Produtos</h1>
        <p class="text-gray-600 mt-1">Gerencie os produtos solidários</p>
      </div>
      <BaseButton @click="openCreateModal">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Novo Produto
      </BaseButton>
    </div>

    <!-- Loading State -->
    <div v-if="productsStore.loading" class="flex justify-center py-16">
      <Spinner size="xl" label="Carregando produtos..." />
    </div>

    <!-- Products Table -->
    <BaseCard v-else padding="none">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preço
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estoque
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in productsStore.products" :key="product.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img :src="product.imageUrl" :alt="product.name" class="w-12 h-12 rounded object-cover" />
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                    <div class="text-sm text-gray-500 truncate max-w-xs">{{ product.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge variant="default">{{ product.category }}</Badge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatCurrency(product.price) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge :variant="product.stock > 0 ? 'success' : 'danger'">
                  {{ product.stock }} unid.
                </Badge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge :variant="product.active ? 'success' : 'default'">
                  {{ product.active ? 'Ativo' : 'Inativo' }}
                </Badge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editProduct(product)"
                  class="text-tyler-blue hover:text-blue-700 mr-4"
                >
                  Editar
                </button>
                <button
                  @click="deleteProduct(product)"
                  class="text-red-600 hover:text-red-800"
                >
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>

    <!-- Create/Edit Modal -->
    <BaseModal v-model="showModal" :title="editingProduct ? 'Editar Produto' : 'Novo Produto'" size="lg">
      <form @submit.prevent="saveProduct" class="space-y-4">
        <BaseInput
          v-model="form.name"
          label="Nome do Produto"
          required
          :error="errors.name"
        />

        <BaseInput
          v-model="form.description"
          label="Descrição"
          type="textarea"
          required
          :error="errors.description"
        />

        <div class="grid grid-cols-2 gap-4">
          <BaseInput
            v-model="form.category"
            label="Categoria"
            required
          />
          
          <BaseInput
            v-model.number="form.price"
            label="Preço (R$)"
            type="number"
            step="0.01"
            required
            :error="errors.price"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <BaseInput
            v-model.number="form.stock"
            label="Estoque"
            type="number"
            required
          />

          <div class="flex items-center space-x-2 pt-8">
            <input
              v-model="form.active"
              type="checkbox"
              id="active"
              class="w-4 h-4 text-tyler-blue border-gray-300 rounded focus:ring-tyler-blue"
            />
            <label for="active" class="text-sm font-medium text-gray-700">
              Produto ativo
            </label>
          </div>
        </div>

        <BaseInput
          v-model="form.imageUrl"
          label="URL da Imagem"
          type="url"
          required
          hint="Cole a URL da imagem do produto"
        />

        <!-- Preview da imagem -->
        <div v-if="form.imageUrl" class="mt-4">
          <p class="text-sm font-medium text-gray-700 mb-2">Preview:</p>
          <img :src="form.imageUrl" alt="Preview" class="w-32 h-32 object-cover rounded" />
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <BaseButton variant="outline" @click="showModal = false">
            Cancelar
          </BaseButton>
          <BaseButton @click="saveProduct" :loading="saving">
            {{ editingProduct ? 'Atualizar' : 'Criar' }}
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useCurrency } from '@/composables'
import { useToast } from '@/composables'
import { BaseButton, BaseCard, BaseModal, BaseInput, Badge, Spinner } from '@/components/ui'
import type { Product } from '@/types'

const productsStore = useProductsStore()
const { formatCurrency } = useCurrency()
const { success, error: showError } = useToast()

const showModal = ref(false)
const saving = ref(false)
const editingProduct = ref<Product | null>(null)

const form = reactive({
  name: '',
  description: '',
  category: '',
  price: 0,
  stock: 0,
  imageUrl: '',
  active: true
})

const errors = reactive({
  name: '',
  description: '',
  price: ''
})

function openCreateModal() {
  resetForm()
  editingProduct.value = null
  showModal.value = true
}

function editProduct(product: Product) {
  editingProduct.value = product
  form.name = product.name
  form.description = product.description
  form.category = product.category
  form.price = product.price
  form.stock = product.stock
  form.imageUrl = product.imageUrl
  form.active = product.active
  showModal.value = true
}

function resetForm() {
  form.name = ''
  form.description = ''
  form.category = ''
  form.price = 0
  form.stock = 0
  form.imageUrl = ''
  form.active = true
  errors.name = ''
  errors.description = ''
  errors.price = ''
}

async function saveProduct() {
  // Validação
  let isValid = true
  
  if (!form.name) {
    errors.name = 'Nome é obrigatório'
    isValid = false
  } else {
    errors.name = ''
  }

  if (form.price <= 0) {
    errors.price = 'Preço deve ser maior que zero'
    isValid = false
  } else {
    errors.price = ''
  }

  if (!isValid) return

  saving.value = true

  try {
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (editingProduct.value) {
      success('Produto atualizado com sucesso!')
    } else {
      success('Produto criado com sucesso!')
    }

    showModal.value = false
    resetForm()
    // Recarregar produtos
    await productsStore.fetchProducts()
  } catch (err) {
    showError('Erro ao salvar produto')
  } finally {
    saving.value = false
  }
}

async function deleteProduct(product: Product) {
  if (!confirm(`Deseja realmente excluir o produto "${product.name}"?`)) {
    return
  }

  try {
    // Simular exclusão
    await new Promise(resolve => setTimeout(resolve, 500))
    success('Produto excluído com sucesso!')
    await productsStore.fetchProducts()
  } catch (err) {
    showError('Erro ao excluir produto')
  }
}

// Carregar produtos ao montar
productsStore.fetchProducts()
</script>
