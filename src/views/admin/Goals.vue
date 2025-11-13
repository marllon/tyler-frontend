<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Metas de Arrecadação</h1>
        <p class="text-gray-600 mt-1">Gerencie as metas de arrecadação</p>
      </div>
      <BaseButton @click="openCreateModal">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nova Meta
      </BaseButton>
    </div>

    <!-- Loading State -->
    <div v-if="goalsStore.loading" class="flex justify-center py-16">
      <Spinner size="xl" label="Carregando metas..." />
    </div>

    <!-- Goals Table -->
    <BaseCard v-else padding="none">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Meta
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor Alvo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Arrecadado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progresso
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prazo
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
            <tr v-for="goal in goalsStore.goals" :key="goal.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ goal.title }}</div>
                <div class="text-sm text-gray-500 truncate max-w-xs">{{ goal.description }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatCurrency(goal.targetAmount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-tyler-blue">
                {{ formatCurrency(goal.currentAmount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      class="bg-tyler-blue h-2 rounded-full"
                      :style="{ width: `${Math.min(goal.progress, 100)}%` }"
                    ></div>
                  </div>
                  <span class="text-sm text-gray-900">{{ goal.progress }}%</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ goal.deadline ? formatDate(goal.deadline) : 'Sem prazo' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge :variant="goal.active ? 'success' : 'default'">
                  {{ goal.active ? 'Ativa' : 'Inativa' }}
                </Badge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editGoal(goal)"
                  class="text-tyler-blue hover:text-blue-700 mr-4"
                >
                  Editar
                </button>
                <button
                  @click="deleteGoal(goal)"
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
    <BaseModal v-model="showModal" :title="editingGoal ? 'Editar Meta' : 'Nova Meta'" size="lg">
      <form @submit.prevent="saveGoal" class="space-y-4">
        <BaseInput
          v-model="form.title"
          label="Título da Meta"
          required
          :error="errors.title"
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
            v-model.number="form.targetAmount"
            label="Valor Alvo (R$)"
            type="number"
            step="0.01"
            required
            :error="errors.targetAmount"
          />
          
          <BaseInput
            v-model.number="form.currentAmount"
            label="Valor Arrecadado (R$)"
            type="number"
            step="0.01"
            required
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <BaseInput
            v-model="form.deadline"
            label="Prazo"
            type="date"
            hint="Deixe em branco se não houver prazo"
          />

          <div class="flex items-center space-x-2 pt-8">
            <input
              v-model="form.active"
              type="checkbox"
              id="active-goal"
              class="w-4 h-4 text-tyler-blue border-gray-300 rounded focus:ring-tyler-blue"
            />
            <label for="active-goal" class="text-sm font-medium text-gray-700">
              Meta ativa
            </label>
          </div>
        </div>

        <BaseInput
          v-model="form.imageUrl"
          label="URL da Imagem"
          type="url"
          hint="Cole a URL da imagem da meta"
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
          <BaseButton @click="saveGoal" :loading="saving">
            {{ editingGoal ? 'Atualizar' : 'Criar' }}
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useGoalsStore } from '@/stores/goals'
import { useCurrency, useDate } from '@/composables'
import { useToast } from '@/composables'
import { BaseButton, BaseCard, BaseModal, BaseInput, Badge, Spinner } from '@/components/ui'
import type { Goal } from '@/types'

const goalsStore = useGoalsStore()
const { formatCurrency } = useCurrency()
const { formatDate } = useDate()
const { success, error: showError } = useToast()

const showModal = ref(false)
const saving = ref(false)
const editingGoal = ref<Goal | null>(null)

const form = reactive({
  title: '',
  description: '',
  targetAmount: 0,
  currentAmount: 0,
  deadline: '',
  imageUrl: '',
  active: true
})

const errors = reactive({
  title: '',
  description: '',
  targetAmount: ''
})

function openCreateModal() {
  resetForm()
  editingGoal.value = null
  showModal.value = true
}

function editGoal(goal: Goal) {
  editingGoal.value = goal
  form.title = goal.title
  form.description = goal.description
  form.targetAmount = goal.targetAmount
  form.currentAmount = goal.currentAmount
  form.deadline = goal.deadline || ''
  form.imageUrl = goal.imageUrl || ''
  form.active = goal.active
  showModal.value = true
}

function resetForm() {
  form.title = ''
  form.description = ''
  form.targetAmount = 0
  form.currentAmount = 0
  form.deadline = ''
  form.imageUrl = ''
  form.active = true
  errors.title = ''
  errors.description = ''
  errors.targetAmount = ''
}

async function saveGoal() {
  let isValid = true
  
  if (!form.title) {
    errors.title = 'Título é obrigatório'
    isValid = false
  } else {
    errors.title = ''
  }

  if (form.targetAmount <= 0) {
    errors.targetAmount = 'Valor alvo deve ser maior que zero'
    isValid = false
  } else {
    errors.targetAmount = ''
  }

  if (!isValid) return

  saving.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (editingGoal.value) {
      success('Meta atualizada com sucesso!')
    } else {
      success('Meta criada com sucesso!')
    }

    showModal.value = false
    resetForm()
    await goalsStore.fetchGoals()
  } catch (err) {
    showError('Erro ao salvar meta')
  } finally {
    saving.value = false
  }
}

async function deleteGoal(goal: Goal) {
  if (!confirm(`Deseja realmente excluir a meta "${goal.title}"?`)) {
    return
  }

  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    success('Meta excluída com sucesso!')
    await goalsStore.fetchGoals()
  } catch (err) {
    showError('Erro ao excluir meta')
  }
}
goalsStore.fetchGoals()
</script>
