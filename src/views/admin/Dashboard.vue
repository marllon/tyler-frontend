<template>
  <div class="p-6">
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p class="text-gray-600 mt-1">Visão geral das atividades</p>
        </div>

        <!-- User Welcome Section -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-3">
            <!-- Avatar -->
            <div
              class="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg"
            >
              {{ getUserInitials(currentUser?.email || currentUser?.name) }}
            </div>

            <!-- User Info -->
            <div class="text-left">
              <p class="text-lg font-semibold text-gray-900">
                Olá,
                {{ getFirstName(currentUser?.name || currentUser?.email) }}! 👋
              </p>
              <div class="flex items-center gap-2 text-sm">
                <span class="text-gray-600">{{ currentUser?.email }}</span>
                <span
                  class="px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="getRoleBadgeClass(currentUser?.role)"
                >
                  {{ getRoleDisplayName(currentUser?.role) }}
                </span>
                <span
                  class="px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="
                    authMode === 'firebase'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  "
                >
                  {{
                    authMode === "firebase"
                      ? "� Firebase Real"
                      : "🔧 Modo Simulado"
                  }}
                </span>
              </div>

              <!-- Aviso sobre modo mock -->
              <div v-if="authMode === 'mock'" class="mt-1">
                <p class="text-xs text-orange-600">
                  ⚠️ Dados de teste - Configure Firebase para produção
                </p>
              </div>
            </div>
          </div>

          <div class="flex gap-2">
            <RouterLink
              to="/admin/security"
              class="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
            >
              🛡️ Segurança
            </RouterLink>
            <RouterLink
              to="/admin/settings"
              class="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
            >
              ⚙️ Configurações
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-16">
      <Spinner size="xl" label="Carregando dados..." />
    </div>

    <div v-else>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <BaseCard
          class="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium opacity-90 mb-2">
                Total em Metas
              </h3>
              <p class="text-3xl font-bold">
                {{ formatCurrency(stats.totalGoals) }}
              </p>
              <p class="text-xs opacity-75 mt-1">
                {{ stats.goalsCount }} metas ativas
              </p>
            </div>
            <div class="bg-white bg-opacity-20 rounded-full p-3">
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
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
          </div>
        </BaseCard>

        <BaseCard
          class="bg-gradient-to-br from-green-500 to-green-600 text-white border-0"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium opacity-90 mb-2">Produtos</h3>
              <p class="text-3xl font-bold">{{ stats.productsCount }}</p>
              <p class="text-xs opacity-75 mt-1">
                {{ stats.productsStock }} em estoque
              </p>
            </div>
            <div class="bg-white bg-opacity-20 rounded-full p-3">
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
        </BaseCard>

        <BaseCard
          class="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium opacity-90 mb-2">Rifas</h3>
              <p class="text-3xl font-bold">{{ stats.rafflesCount }}</p>
              <p class="text-xs opacity-75 mt-1">
                {{ stats.activeRaffles }} ativas
              </p>
            </div>
            <div class="bg-white bg-opacity-20 rounded-full p-3">
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
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
            </div>
          </div>
        </BaseCard>

        <BaseCard
          class="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium opacity-90 mb-2">Eventos</h3>
              <p class="text-3xl font-bold">{{ stats.eventsCount }}</p>
              <p class="text-xs opacity-75 mt-1">
                {{ stats.upcomingEvents }} próximos
              </p>
            </div>
            <div class="bg-white bg-opacity-20 rounded-full p-3">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Charts and Details -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Metas Progress -->
        <BaseCard>
          <h2 class="text-xl font-bold mb-4">Progresso das Metas</h2>
          <div class="space-y-4">
            <div
              v-for="goal in topGoals"
              :key="goal.id"
              class="border-b border-gray-100 pb-3 last:border-0"
            >
              <div class="flex justify-between items-center mb-2">
                <span
                  class="text-sm font-medium text-gray-900 truncate max-w-xs"
                  >{{ goal.title }}</span
                >
                <span class="text-sm font-bold text-tyler-blue"
                  >{{ goal.progress }}%</span
                >
              </div>
              <ProgressBar :progress="goal.progress" size="sm" />
              <div class="flex justify-between items-center mt-1">
                <span class="text-xs text-gray-500">{{
                  formatCurrency(goal.currentAmount)
                }}</span>
                <span class="text-xs text-gray-500">{{
                  formatCurrency(goal.targetAmount)
                }}</span>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Rifas Ativas -->
        <BaseCard>
          <h2 class="text-xl font-bold mb-4">Rifas em Andamento</h2>
          <div class="space-y-4">
            <div
              v-for="raffle in activeRafflesList"
              :key="raffle.id"
              class="border-b border-gray-100 pb-3 last:border-0"
            >
              <div class="flex items-center gap-3">
                <img
                  :src="raffle.images?.[0] || raffle.imageUrl"
                  :alt="raffle.prize"
                  class="w-12 h-12 rounded object-cover"
                />
                <div class="flex-1">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-sm font-medium text-gray-900">{{
                      raffle.prize
                    }}</span>
                    <Badge variant="success">{{ raffle.progress }}%</Badge>
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ raffle.soldTickets }} /
                    {{ raffle.totalTickets }} bilhetes vendidos
                  </div>
                  <ProgressBar
                    :progress="raffle.progress"
                    size="sm"
                    color="pink"
                    class="mt-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Produtos e Eventos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Produtos Populares -->
        <BaseCard>
          <h2 class="text-xl font-bold mb-4">Produtos em Destaque</h2>
          <div class="space-y-3">
            <div
              v-for="product in topProducts"
              :key="product.id"
              class="flex items-center gap-3 border-b border-gray-100 pb-3 last:border-0"
            >
              <img
                :src="product.imageUrl"
                :alt="product.name"
                class="w-10 h-10 rounded object-cover"
              />
              <div class="flex-1">
                <div class="text-sm font-medium text-gray-900">
                  {{ product.name }}
                </div>
                <div class="text-xs text-gray-500">{{ product.category }}</div>
              </div>
              <div class="text-right">
                <div class="text-sm font-bold text-tyler-blue">
                  {{ formatCurrency(product.price) }}
                </div>
                <Badge
                  :variant="product.stock > 0 ? 'success' : 'danger'"
                  size="sm"
                >
                  {{ product.stock }} unid.
                </Badge>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Próximos Eventos -->
        <BaseCard>
          <h2 class="text-xl font-bold mb-4">Próximos Eventos</h2>
          <div class="space-y-3">
            <div
              v-for="event in upcomingEventsList"
              :key="event.id"
              class="flex items-center gap-3 border-b border-gray-100 pb-3 last:border-0"
            >
              <img
                :src="event.imageUrl"
                :alt="event.title"
                class="w-10 h-10 rounded object-cover"
              />
              <div class="flex-1">
                <div class="text-sm font-medium text-gray-900">
                  {{ event.title }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ formatDate(event.date) }} · {{ event.location }}
                </div>
              </div>
              <div class="text-right">
                <div class="text-xs text-gray-600">
                  {{ event.registeredParticipants }} /
                  {{ event.maxParticipants }}
                </div>
                <Badge variant="success" size="sm">Agendado</Badge>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { useProductsStore } from "@/stores/products";
import { useGoalsStore } from "@/stores/goals";
import { useRafflesStore } from "@/stores/raffles";
import { useEventsStore } from "@/stores/events";
import { useAuthStore } from "@/stores/auth";
import { useCurrency, useDate } from "@/composables";
import { BaseCard, Badge, ProgressBar, Spinner } from "@/components/ui";

const productsStore = useProductsStore();
const goalsStore = useGoalsStore();
const rafflesStore = useRafflesStore();
const eventsStore = useEventsStore();
const authStore = useAuthStore();
const { formatCurrency } = useCurrency();
const { formatDate } = useDate();

// Authentication info
const currentUser = computed(() => authStore.admin);
const authMode = computed(() => (authStore.useFirebase ? "firebase" : "mock"));

const loading = ref(true);

// Helper functions for user display
function getUserInitials(name?: string): string {
  if (!name) return "?";

  if (name.includes("@")) {
    // Se for email, usar primeira letra antes do @
    return name.charAt(0).toUpperCase();
  }

  // Se for nome, usar iniciais
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

function getFirstName(name?: string): string {
  if (!name) return "Usuário";

  if (name.includes("@")) {
    // Se for email, extrair nome antes do @
    const username = name.split("@")[0];
    return username.charAt(0).toUpperCase() + username.slice(1);
  }

  // Se for nome completo, pegar primeiro nome
  return name.split(" ")[0];
}

function getRoleDisplayName(role?: string): string {
  const roleNames = {
    "super-admin": "Super Admin",
    admin: "Admin",
    user: "Usuário",
  };
  return roleNames[role as keyof typeof roleNames] || "Usuário";
}

function getRoleBadgeClass(role?: string): string {
  const classes = {
    "super-admin": "bg-purple-100 text-purple-700",
    admin: "bg-blue-100 text-blue-700",
    user: "bg-gray-100 text-gray-700",
  };
  return classes[role as keyof typeof classes] || "bg-gray-100 text-gray-700";
}

const stats = computed(() => ({
  totalGoals: goalsStore.goals.reduce(
    (sum, goal) => sum + goal.currentAmount,
    0
  ),
  goalsCount: goalsStore.goals.filter((g) => g.active).length,
  productsCount: productsStore.products.filter((p) => p.active).length,
  productsStock: productsStore.products.reduce((sum, p) => sum + p.stock, 0),
  rafflesCount: rafflesStore.raffles.length,
  activeRaffles: rafflesStore.raffles.filter((r) => r.status === "ACTIVE")
    .length,
  eventsCount: eventsStore.events.length,
  upcomingEvents: eventsStore.events.filter((e) => !e.completed).length,
}));

const topGoals = computed(() =>
  [...goalsStore.goals]
    .filter((g) => g.active)
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 4)
);

const activeRafflesList = computed(() =>
  rafflesStore.raffles.filter((r) => r.status === "ACTIVE").slice(0, 3)
);

const topProducts = computed(() =>
  [...productsStore.products].filter((p) => p.active).slice(0, 5)
);

const upcomingEventsList = computed(() =>
  eventsStore.events
    .filter((e) => !e.completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4)
);

onMounted(async () => {
  loading.value = true;
  await Promise.all([
    productsStore.fetchProducts(),
    goalsStore.fetchGoals(),
    rafflesStore.fetchRaffles(),
    eventsStore.fetchEvents(),
  ]);
  loading.value = false;
});
</script>
