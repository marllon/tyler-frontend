<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Doações</h1>
        <p class="text-gray-600 mt-1">Gerencie as doações recebidas</p>
      </div>
      <div class="flex gap-3">
        <select
          v-model="goalFilter"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tyler-blue"
        >
          <option value="all">Todas as Metas</option>
          <option v-for="goal in goalsStore.goals" :key="goal.id" :value="goal.id">
            {{ goal.title }}
          </option>
        </select>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <BaseCard class="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium opacity-90 mb-1">Total de Doações</h3>
            <p class="text-2xl font-bold">{{ formatCurrency(totalDonations) }}</p>
            <p class="text-xs opacity-75 mt-1">{{ donations.length }} doações</p>
          </div>
          <div class="bg-white bg-opacity-20 rounded-full p-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </BaseCard>

      <BaseCard class="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium opacity-90 mb-1">Doação Média</h3>
            <p class="text-2xl font-bold">{{ formatCurrency(averageDonation) }}</p>
            <p class="text-xs opacity-75 mt-1">por doador</p>
          </div>
          <div class="bg-white bg-opacity-20 rounded-full p-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </BaseCard>

      <BaseCard class="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium opacity-90 mb-1">Este Mês</h3>
            <p class="text-2xl font-bold">{{ formatCurrency(monthlyDonations) }}</p>
            <p class="text-xs opacity-75 mt-1">novembro 2024</p>
          </div>
          <div class="bg-white bg-opacity-20 rounded-full p-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-16">
      <Spinner size="xl" label="Carregando doações..." />
    </div>

    <!-- Donations Table -->
    <BaseCard v-else padding="none">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doador
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Meta
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Método
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mensagem
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="donation in filteredDonations" :key="donation.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ donation.donorName }}</div>
                <div class="text-xs text-gray-500">{{ donation.donorEmail }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge variant="default">{{ donation.goalTitle }}</Badge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                {{ formatCurrency(donation.amount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge :variant="getPaymentMethodVariant(donation.paymentMethod)">
                  {{ getPaymentMethodLabel(donation.paymentMethod) }}
                </Badge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(donation.createdAt) }}
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-500 max-w-xs truncate">
                  {{ donation.message || '-' }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredDonations.length === 0" class="text-center py-12">
          <p class="text-gray-500">Nenhuma doação encontrada</p>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGoalsStore } from '@/stores/goals'
import { useCurrency, useDate } from '@/composables'
import { BaseCard, Badge, Spinner } from '@/components/ui'

interface Donation {
  id: string
  donorName: string
  donorEmail: string
  goalId: string
  goalTitle: string
  amount: number
  paymentMethod: 'pix' | 'credit_card' | 'boleto'
  message?: string
  createdAt: string
}

const goalsStore = useGoalsStore()
const { formatCurrency } = useCurrency()
const { formatDate } = useDate()

const loading = ref(false)
const goalFilter = ref('all')

// Dados de exemplo
const donations = ref<Donation[]>([
  {
    id: '1',
    donorName: 'Ana Paula Santos',
    donorEmail: 'ana.santos@email.com',
    goalId: '1',
    goalTitle: 'Tratamento Médico',
    amount: 500.00,
    paymentMethod: 'pix',
    message: 'Força Tyler! Deus abençoe!',
    createdAt: '2024-11-15T10:30:00'
  },
  {
    id: '2',
    donorName: 'Carlos Eduardo Silva',
    donorEmail: 'carlos.silva@email.com',
    goalId: '1',
    goalTitle: 'Tratamento Médico',
    amount: 1000.00,
    paymentMethod: 'credit_card',
    message: 'Estamos orando por você!',
    createdAt: '2024-11-14T15:20:00'
  },
  {
    id: '3',
    donorName: 'Maria Oliveira',
    donorEmail: 'maria.oliveira@email.com',
    goalId: '2',
    goalTitle: 'Sessões de Fisioterapia',
    amount: 250.00,
    paymentMethod: 'pix',
    message: '',
    createdAt: '2024-11-13T09:15:00'
  },
  {
    id: '4',
    donorName: 'João Pedro Costa',
    donorEmail: 'joao.costa@email.com',
    goalId: '3',
    goalTitle: 'Medicamentos Especiais',
    amount: 300.00,
    paymentMethod: 'boleto',
    message: 'Continue firme! Você é um guerreiro!',
    createdAt: '2024-11-12T14:45:00'
  },
  {
    id: '5',
    donorName: 'Fernanda Lima',
    donorEmail: 'fernanda.lima@email.com',
    goalId: '1',
    goalTitle: 'Tratamento Médico',
    amount: 750.00,
    paymentMethod: 'credit_card',
    message: 'Que Deus te proteja sempre!',
    createdAt: '2024-11-11T11:30:00'
  },
  {
    id: '6',
    donorName: 'Roberto Alves',
    donorEmail: 'roberto.alves@email.com',
    goalId: '4',
    goalTitle: 'Adaptação da Casa',
    amount: 1500.00,
    paymentMethod: 'pix',
    message: 'Família Tyler, vocês são inspiradores!',
    createdAt: '2024-11-10T16:00:00'
  },
  {
    id: '7',
    donorName: 'Juliana Mendes',
    donorEmail: 'juliana.mendes@email.com',
    goalId: '2',
    goalTitle: 'Sessões de Fisioterapia',
    amount: 400.00,
    paymentMethod: 'pix',
    message: '',
    createdAt: '2024-11-09T10:00:00'
  },
  {
    id: '8',
    donorName: 'Pedro Henrique',
    donorEmail: 'pedro.henrique@email.com',
    goalId: '5',
    goalTitle: 'Material Escolar Adaptado',
    amount: 200.00,
    paymentMethod: 'credit_card',
    message: 'Educação é fundamental! Sucesso!',
    createdAt: '2024-11-08T13:20:00'
  }
])

const filteredDonations = computed(() => {
  if (goalFilter.value === 'all') {
    return donations.value
  }
  return donations.value.filter(donation => donation.goalId === goalFilter.value)
})

const totalDonations = computed(() => 
  donations.value.reduce((sum, d) => sum + d.amount, 0)
)

const averageDonation = computed(() => 
  donations.value.length > 0 ? totalDonations.value / donations.value.length : 0
)

const monthlyDonations = computed(() => {
  const currentMonth = new Date().getMonth()
  return donations.value
    .filter(d => new Date(d.createdAt).getMonth() === currentMonth)
    .reduce((sum, d) => sum + d.amount, 0)
})

function getPaymentMethodVariant(method: Donation['paymentMethod']) {
  switch (method) {
    case 'pix':
      return 'success'
    case 'credit_card':
      return 'default'
    case 'boleto':
      return 'warning'
    default:
      return 'default'
  }
}

function getPaymentMethodLabel(method: Donation['paymentMethod']) {
  switch (method) {
    case 'pix':
      return 'PIX'
    case 'credit_card':
      return 'Cartão de Crédito'
    case 'boleto':
      return 'Boleto'
    default:
      return method
  }
}

onMounted(() => {
  goalsStore.fetchGoals()
})
</script>
