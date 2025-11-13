<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Rifas</h1>
        <p class="text-gray-600 mt-1">Gerencie as rifas e sorteios</p>
      </div>
      <BaseButton @click="openCreateModal">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nova Rifa
      </BaseButton>
    </div>

    <!-- Loading State -->
    <div v-if="rafflesStore.loading" class="flex justify-center py-16">
      <Spinner size="xl" label="Carregando rifas..." />
    </div>

    <!-- Raffles Table -->
    <BaseCard v-else padding="none">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prêmio
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preço/Bilhete
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bilhetes
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progresso
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sorteio
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
            <tr v-for="raffle in rafflesStore.raffles" :key="raffle.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <img 
                    :src="raffle.images?.[0] || raffle.imageUrl" 
                    :alt="raffle.prize" 
                    class="w-12 h-12 rounded object-cover" 
                  />
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ raffle.prize }}</div>
                    <div class="text-sm text-gray-500">
                      {{ raffle.images?.length || 1 }} imagem(ns)
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatCurrency(raffle.ticketPrice) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ raffle.soldTickets }} / {{ raffle.totalTickets }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      class="bg-tyler-pink h-2 rounded-full"
                      :style="{ width: `${Math.min(raffle.progress, 100)}%` }"
                    ></div>
                  </div>
                  <span class="text-sm text-gray-900">{{ raffle.progress }}%</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ raffle.drawDate ? formatDate(raffle.drawDate) : 'A definir' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge :variant="getStatusVariant(raffle.status)">
                  {{ getStatusLabel(raffle.status) }}
                </Badge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  v-if="raffle.status === 'ACTIVE'"
                  @click="drawRaffle(raffle)"
                  class="text-green-600 hover:text-green-800 mr-4"
                >
                  Sortear
                </button>
                <button
                  @click="editRaffle(raffle)"
                  class="text-tyler-blue hover:text-blue-700 mr-4"
                >
                  Editar
                </button>
                <button
                  @click="deleteRaffle(raffle)"
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
    <BaseModal v-model="showModal" :title="editingRaffle ? 'Editar Rifa' : 'Nova Rifa'" size="lg">
      <form @submit.prevent="saveRaffle" class="space-y-4">
        <BaseInput
          v-model="form.prize"
          label="Prêmio"
          required
          :error="errors.prize"
        />

        <BaseInput
          v-model="form.description"
          label="Descrição"
          type="textarea"
          required
          :error="errors.description"
        />

        <div class="grid grid-cols-3 gap-4">
          <BaseInput
            v-model.number="form.ticketPrice"
            label="Preço do Bilhete (R$)"
            type="number"
            step="0.01"
            required
            :error="errors.ticketPrice"
          />
          
          <BaseInput
            v-model.number="form.totalTickets"
            label="Total de Bilhetes"
            type="number"
            required
          />

          <BaseInput
            v-model.number="form.soldTickets"
            label="Bilhetes Vendidos"
            type="number"
            required
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <BaseInput
            v-model="form.drawDate"
            label="Data do Sorteio"
            type="date"
          />

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              v-model="form.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tyler-blue"
            >
              <option value="ACTIVE">Ativo</option>
              <option value="ENDED">Encerrado</option>
              <option value="DRAWN">Sorteado</option>
            </select>
          </div>
        </div>

        <div v-if="form.status === 'DRAWN'">
          <BaseInput
            v-model="form.winnerTicket"
            label="Bilhete Vencedor"
          />
        </div>

        <!-- URLs das Imagens -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700">
            Imagens da Rifa
          </label>
          
          <div v-for="(image, index) in form.images" :key="index" class="flex gap-2">
            <BaseInput
              v-model="form.images[index]"
              :placeholder="`URL da imagem ${index + 1}`"
              type="url"
            />
            <button
              v-if="form.images.length > 1"
              type="button"
              @click="removeImage(index)"
              class="px-3 py-2 text-red-600 hover:text-red-800"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <BaseButton
            type="button"
            variant="outline"
            size="sm"
            @click="addImage"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Adicionar Imagem
          </BaseButton>
        </div>

        <!-- Preview das imagens -->
        <div v-if="form.images.some(img => img)" class="mt-4">
          <p class="text-sm font-medium text-gray-700 mb-2">Preview:</p>
          <div class="grid grid-cols-4 gap-2">
            <img
              v-for="(image, index) in form.images.filter(img => img)"
              :key="index"
              :src="image"
              alt="Preview"
              class="w-full h-24 object-cover rounded"
            />
          </div>
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <BaseButton variant="outline" @click="showModal = false">
            Cancelar
          </BaseButton>
          <BaseButton @click="saveRaffle" :loading="saving">
            {{ editingRaffle ? 'Atualizar' : 'Criar' }}
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRafflesStore } from '@/stores/raffles'
import { useCurrency, useDate } from '@/composables'
import { useToast } from '@/composables'
import { BaseButton, BaseCard, BaseModal, BaseInput, Badge, Spinner } from '@/components/ui'
import type { Raffle } from '@/types'

const rafflesStore = useRafflesStore()
const { formatCurrency } = useCurrency()
const { formatDate } = useDate()
const { success, error: showError } = useToast()

const showModal = ref(false)
const saving = ref(false)
const editingRaffle = ref<Raffle | null>(null)

const form = reactive({
  prize: '',
  description: '',
  ticketPrice: 0,
  totalTickets: 0,
  soldTickets: 0,
  drawDate: '',
  status: 'ACTIVE' as Raffle['status'],
  winnerTicket: '',
  images: ['']
})

const errors = reactive({
  prize: '',
  description: '',
  ticketPrice: ''
})

function openCreateModal() {
  resetForm()
  editingRaffle.value = null
  showModal.value = true
}

function editRaffle(raffle: Raffle) {
  editingRaffle.value = raffle
  form.prize = raffle.prize
  form.description = raffle.description
  form.ticketPrice = raffle.ticketPrice
  form.totalTickets = raffle.totalTickets
  form.soldTickets = raffle.soldTickets
  form.drawDate = raffle.drawDate || ''
  form.status = raffle.status
  form.winnerTicket = raffle.winnerTicket || ''
  form.images = raffle.images && raffle.images.length > 0 ? [...raffle.images] : [raffle.imageUrl || '']
  showModal.value = true
}

function resetForm() {
  form.prize = ''
  form.description = ''
  form.ticketPrice = 0
  form.totalTickets = 0
  form.soldTickets = 0
  form.drawDate = ''
  form.status = 'ACTIVE'
  form.winnerTicket = ''
  form.images = ['']
  errors.prize = ''
  errors.description = ''
  errors.ticketPrice = ''
}

function addImage() {
  form.images.push('')
}

function removeImage(index: number) {
  form.images.splice(index, 1)
}

async function saveRaffle() {
  let isValid = true
  
  if (!form.prize) {
    errors.prize = 'Prêmio é obrigatório'
    isValid = false
  } else {
    errors.prize = ''
  }

  if (form.ticketPrice <= 0) {
    errors.ticketPrice = 'Preço deve ser maior que zero'
    isValid = false
  } else {
    errors.ticketPrice = ''
  }

  if (!isValid) return

  saving.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (editingRaffle.value) {
      success('Rifa atualizada com sucesso!')
    } else {
      success('Rifa criada com sucesso!')
    }

    showModal.value = false
    resetForm()
    await rafflesStore.fetchRaffles()
  } catch (err) {
    showError('Erro ao salvar rifa')
  } finally {
    saving.value = false
  }
}

async function deleteRaffle(raffle: Raffle) {
  if (!confirm(`Deseja realmente excluir a rifa "${raffle.prize}"?`)) {
    return
  }

  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    success('Rifa excluída com sucesso!')
    await rafflesStore.fetchRaffles()
  } catch (err) {
    showError('Erro ao excluir rifa')
  }
}

async function drawRaffle(raffle: Raffle) {
  const ticketNumber = prompt(`Digite o número do bilhete vencedor (1-${raffle.totalTickets}):`)
  
  if (!ticketNumber) return

  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    success(`Sorteio realizado! Bilhete vencedor: #${ticketNumber}`)
    await rafflesStore.fetchRaffles()
  } catch (err) {
    showError('Erro ao realizar sorteio')
  }
}

function getStatusVariant(status: Raffle['status']) {
  switch (status) {
    case 'ACTIVE':
      return 'success'
    case 'ENDED':
      return 'warning'
    case 'DRAWN':
      return 'default'
    default:
      return 'default'
  }
}

function getStatusLabel(status: Raffle['status']) {
  switch (status) {
    case 'ACTIVE':
      return 'Ativo'
    case 'ENDED':
      return 'Encerrado'
    case 'DRAWN':
      return 'Sorteado'
    default:
      return status
  }
}
rafflesStore.fetchRaffles()
</script>
