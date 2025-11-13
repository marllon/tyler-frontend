<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Configurações</h1>
      <p class="text-gray-600 mt-1">Configure aspectos gerais do sistema</p>
    </div>

    <div class="grid gap-6">
      <!-- Configurações da API -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">API Tyler</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              URL Base da API
            </label>
            <input
              type="text"
              :value="apiConfig.baseURL"
              readonly
              class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Timeout (ms)
            </label>
            <input
              type="number"
              :value="apiConfig.timeout"
              readonly
              class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
            />
          </div>

          <div
            class="flex items-center justify-between p-4 bg-blue-50 rounded-lg"
          >
            <div>
              <h3 class="font-medium text-blue-900">Status da Conexão</h3>
              <p class="text-sm text-blue-700">{{ connectionStatus }}</p>
            </div>
            <button
              @click="testConnection"
              :disabled="testing"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ testing ? "Testando..." : "Testar Conexão" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Configurações PIX -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">PIX / PagBank</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Ambiente
            </label>
            <select
              v-model="pixConfig.environment"
              @change="savePixConfig"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="sandbox">Sandbox (Teste)</option>
              <option value="production">Produção</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Chave PIX (Produção)
            </label>
            <input
              type="text"
              v-model="pixConfig.pixKey"
              @input="savePixConfig"
              placeholder="Digite a chave PIX para produção"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Valor Mínimo Doação
              </label>
              <input
                type="number"
                v-model="pixConfig.minAmount"
                @input="savePixConfig"
                step="0.01"
                min="0.01"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Valor Máximo Doação
              </label>
              <input
                type="number"
                v-model="pixConfig.maxAmount"
                @input="savePixConfig"
                step="0.01"
                min="0.01"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Configurações de Notificações -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Notificações</h2>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-900">Email de Doações</h3>
              <p class="text-sm text-gray-600">
                Receber email quando uma nova doação for feita
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="notifications.donations"
                @change="saveNotifications"
                class="sr-only peer"
              />
              <div
                class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
              ></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-900">Email de Pedidos</h3>
              <p class="text-sm text-gray-600">
                Receber email quando um novo pedido for feito
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="notifications.orders"
                @change="saveNotifications"
                class="sr-only peer"
              />
              <div
                class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
              ></div>
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email para Notificações
            </label>
            <input
              type="email"
              v-model="notifications.email"
              @input="saveNotifications"
              placeholder="admin@exemplo.com"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <!-- Configurações do Site -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Site</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nome da Organização
            </label>
            <input
              type="text"
              v-model="siteConfig.organizationName"
              @input="saveSiteConfig"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              v-model="siteConfig.description"
              @input="saveSiteConfig"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Telefone de Contato
              </label>
              <input
                type="tel"
                v-model="siteConfig.phone"
                @input="saveSiteConfig"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Email de Contato
              </label>
              <input
                type="email"
                v-model="siteConfig.email"
                @input="saveSiteConfig"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { api } from "@/utils/api";
const apiConfig = computed(() => ({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  timeout: 30000,
}));
const connectionStatus = ref("Não testado");
const testing = ref(false);
const pixConfig = ref({
  environment: "sandbox",
  pixKey: "",
  minAmount: 1.0,
  maxAmount: 10000.0,
});
const notifications = ref({
  donations: true,
  orders: true,
  email: "",
});
const siteConfig = ref({
  organizationName: "Tyler - Organização Beneficente",
  description:
    "Ajudando a transformar vidas através da solidariedade e do trabalho comunitário.",
  phone: "",
  email: "",
});
async function testConnection() {
  testing.value = true;
  try {
    const response = await api.get("/health");
    connectionStatus.value = response.data ? "Conectado ✓" : "Erro na resposta";
  } catch (error) {
    connectionStatus.value = "Falha na conexão ✗";
  } finally {
    testing.value = false;
  }
}

function savePixConfig() {
  localStorage.setItem("tyler-pix-config", JSON.stringify(pixConfig.value));
}

function saveNotifications() {
  localStorage.setItem(
    "tyler-notifications",
    JSON.stringify(notifications.value)
  );
}

function saveSiteConfig() {
  localStorage.setItem("tyler-site-config", JSON.stringify(siteConfig.value));
}

function loadConfigurations() {
  const savedPixConfig = localStorage.getItem("tyler-pix-config");
  if (savedPixConfig) {
    pixConfig.value = { ...pixConfig.value, ...JSON.parse(savedPixConfig) };
  }
  const savedNotifications = localStorage.getItem("tyler-notifications");
  if (savedNotifications) {
    notifications.value = {
      ...notifications.value,
      ...JSON.parse(savedNotifications),
    };
  }
  const savedSiteConfig = localStorage.getItem("tyler-site-config");
  if (savedSiteConfig) {
    siteConfig.value = { ...siteConfig.value, ...JSON.parse(savedSiteConfig) };
  }
}

onMounted(() => {
  loadConfigurations();
});
</script>
