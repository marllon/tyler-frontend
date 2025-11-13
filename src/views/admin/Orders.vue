<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Pedidos</h1>
        <p class="text-gray-600 mt-1">Gerencie pedidos de produtos</p>
      </div>
      <div class="flex gap-3">
        <select
          v-model="statusFilter"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tyler-blue"
        >
          <option value="all">Todos os Status</option>
          <option value="pending">Pendente</option>
          <option value="processing">Processando</option>
          <option value="shipped">Enviado</option>
          <option value="delivered">Entregue</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-16">
      <Spinner size="xl" label="Carregando pedidos..." />
    </div>

    <!-- Orders Table -->
    <BaseCard v-else padding="none">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pedido
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produtos
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
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
            <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">#{{ order.orderNumber }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ order.customerName }}</div>
                <div class="text-xs text-gray-500">{{ order.customerEmail }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">
                  {{ order.items.length }} item(ns)
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                {{ formatCurrency(order.total) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(order.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge :variant="getStatusVariant(order.status)">
                  {{ getStatusLabel(order.status) }}
                </Badge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="viewOrder(order)"
                  class="text-tyler-blue hover:text-blue-700 mr-4"
                >
                  Ver Detalhes
                </button>
                <button
                  v-if="order.status !== 'delivered' && order.status !== 'cancelled'"
                  @click="updateStatus(order)"
                  class="text-green-600 hover:text-green-800"
                >
                  Atualizar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredOrders.length === 0" class="text-center py-12">
          <p class="text-gray-500">Nenhum pedido encontrado</p>
        </div>
      </div>
    </BaseCard>

    <!-- Order Details Modal -->
    <BaseModal v-model="showDetailsModal" :title="`Pedido #${selectedOrder?.orderNumber}`" size="lg">
      <div v-if="selectedOrder" class="space-y-6">
        <!-- Customer Info -->
        <div>
          <h3 class="text-lg font-semibold mb-3">Informações do Cliente</h3>
          <div class="bg-gray-50 rounded-lg p-4 space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Nome:</span>
              <span class="font-medium">{{ selectedOrder.customerName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Email:</span>
              <span class="font-medium">{{ selectedOrder.customerEmail }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Telefone:</span>
              <span class="font-medium">{{ selectedOrder.customerPhone }}</span>
            </div>
          </div>
        </div>

        <!-- Shipping Address -->
        <div>
          <h3 class="text-lg font-semibold mb-3">Endereço de Entrega</h3>
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-gray-900">{{ selectedOrder.shippingAddress }}</p>
          </div>
        </div>

        <!-- Order Items -->
        <div>
          <h3 class="text-lg font-semibold mb-3">Itens do Pedido</h3>
          <div class="space-y-2">
            <div
              v-for="item in selectedOrder.items"
              :key="item.productId"
              class="flex justify-between items-center bg-gray-50 rounded-lg p-3"
            >
              <div class="flex-1">
                <div class="font-medium text-gray-900">{{ item.productName }}</div>
                <div class="text-sm text-gray-500">Qtd: {{ item.quantity }}</div>
              </div>
              <div class="text-right">
                <div class="font-medium text-gray-900">{{ formatCurrency(item.price * item.quantity) }}</div>
                <div class="text-sm text-gray-500">{{ formatCurrency(item.price) }} cada</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Total -->
        <div class="border-t pt-4">
          <div class="flex justify-between items-center text-lg font-bold">
            <span>Total:</span>
            <span class="text-tyler-blue">{{ formatCurrency(selectedOrder.total) }}</span>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <BaseButton variant="outline" @click="showDetailsModal = false">
            Fechar
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCurrency, useDate } from '@/composables'
import { useToast } from '@/composables'
import { BaseCard, BaseModal, BaseButton, Badge, Spinner } from '@/components/ui'

interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
}

const { formatCurrency } = useCurrency()
const { formatDate } = useDate()
const { success } = useToast()

const loading = ref(false)
const statusFilter = ref('all')
const showDetailsModal = ref(false)
const selectedOrder = ref<Order | null>(null)
const orders = ref<Order[]>([
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerName: 'Maria Silva',
    customerEmail: 'maria@email.com',
    customerPhone: '(11) 98765-4321',
    shippingAddress: 'Rua das Flores, 123 - São Paulo/SP - CEP 01234-567',
    items: [
      { productId: '1', productName: 'Camiseta Solidária Tyler', quantity: 2, price: 59.90 },
      { productId: '2', productName: 'Caneca Personalizada', quantity: 1, price: 35.00 }
    ],
    total: 154.80,
    status: 'pending',
    createdAt: '2024-11-15'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerName: 'João Santos',
    customerEmail: 'joao@email.com',
    customerPhone: '(21) 91234-5678',
    shippingAddress: 'Av. Principal, 456 - Rio de Janeiro/RJ - CEP 20000-000',
    items: [
      { productId: '3', productName: 'Moletom Tyler', quantity: 1, price: 89.90 }
    ],
    total: 89.90,
    status: 'shipped',
    createdAt: '2024-11-14'
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerName: 'Ana Costa',
    customerEmail: 'ana@email.com',
    customerPhone: '(31) 99876-5432',
    shippingAddress: 'Rua Central, 789 - Belo Horizonte/MG - CEP 30000-000',
    items: [
      { productId: '4', productName: 'Boné Tyler', quantity: 1, price: 45.00 },
      { productId: '5', productName: 'Adesivos (Kit)', quantity: 2, price: 15.00 }
    ],
    total: 75.00,
    status: 'delivered',
    createdAt: '2024-11-10'
  }
])

const filteredOrders = computed(() => {
  if (statusFilter.value === 'all') {
    return orders.value
  }
  return orders.value.filter(order => order.status === statusFilter.value)
})

function viewOrder(order: Order) {
  selectedOrder.value = order
  showDetailsModal.value = true
}

function getStatusVariant(status: Order['status']) {
  switch (status) {
    case 'pending':
      return 'warning'
    case 'processing':
      return 'default'
    case 'shipped':
      return 'default'
    case 'delivered':
      return 'success'
    case 'cancelled':
      return 'danger'
    default:
      return 'default'
  }
}

function getStatusLabel(status: Order['status']) {
  switch (status) {
    case 'pending':
      return 'Pendente'
    case 'processing':
      return 'Processando'
    case 'shipped':
      return 'Enviado'
    case 'delivered':
      return 'Entregue'
    case 'cancelled':
      return 'Cancelado'
    default:
      return status
  }
}

async function updateStatus(order: Order) {
  const nextStatus: Record<Order['status'], Order['status'] | null> = {
    pending: 'processing',
    processing: 'shipped',
    shipped: 'delivered',
    delivered: null,
    cancelled: null
  }

  const next = nextStatus[order.status]
  if (!next) return
  await new Promise(resolve => setTimeout(resolve, 500))
  order.status = next
  success(`Status atualizado para: ${getStatusLabel(next)}`)
}
</script>
