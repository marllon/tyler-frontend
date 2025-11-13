<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Eventos</h1>
        <p class="text-gray-600 mt-1">Gerencie os eventos solidários</p>
      </div>
      <BaseButton @click="openCreateModal">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Novo Evento
      </BaseButton>
    </div>

    <!-- Loading State -->
    <div v-if="eventsStore.loading" class="flex justify-center py-16">
      <Spinner size="xl" label="Carregando eventos..." />
    </div>

    <!-- Events Table -->
    <BaseCard v-else padding="none">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Evento
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Local
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participantes
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
            <tr v-for="event in eventsStore.events" :key="event.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <img :src="event.imageUrl" :alt="event.title" class="w-12 h-12 rounded object-cover" />
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ event.title }}</div>
                    <div class="text-sm text-gray-500 truncate max-w-xs">
                      {{ event.gallery ? `${event.gallery.length} fotos na galeria` : 'Sem galeria' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(event.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ event.location }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ event.registeredParticipants }} / {{ event.maxParticipants }}
                </div>
                <div class="w-20 bg-gray-200 rounded-full h-1.5 mt-1">
                  <div
                    class="bg-tyler-blue h-1.5 rounded-full"
                    :style="{ width: `${(event.registeredParticipants / event.maxParticipants) * 100}%` }"
                  ></div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge :variant="event.completed ? 'default' : 'success'">
                  {{ event.completed ? 'Realizado' : 'Agendado' }}
                </Badge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editEvent(event)"
                  class="text-tyler-blue hover:text-blue-700 mr-4"
                >
                  Editar
                </button>
                <button
                  @click="deleteEvent(event)"
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
    <BaseModal v-model="showModal" :title="editingEvent ? 'Editar Evento' : 'Novo Evento'" size="lg">
      <form @submit.prevent="saveEvent" class="space-y-4">
        <BaseInput
          v-model="form.title"
          label="Título do Evento"
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
            v-model="form.date"
            label="Data"
            type="date"
            required
          />
          
          <BaseInput
            v-model="form.location"
            label="Local"
            required
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <BaseInput
            v-model.number="form.registeredParticipants"
            label="Participantes Inscritos"
            type="number"
            required
          />

          <BaseInput
            v-model.number="form.maxParticipants"
            label="Vagas Disponíveis"
            type="number"
            required
          />
        </div>

        <div class="flex items-center space-x-2">
          <input
            v-model="form.completed"
            type="checkbox"
            id="completed"
            class="w-4 h-4 text-tyler-blue border-gray-300 rounded focus:ring-tyler-blue"
          />
          <label for="completed" class="text-sm font-medium text-gray-700">
            Evento já realizado
          </label>
        </div>

        <BaseInput
          v-model="form.imageUrl"
          label="URL da Imagem Principal"
          type="url"
          required
          hint="Cole a URL da imagem do evento"
        />

        <!-- Preview da imagem principal -->
        <div v-if="form.imageUrl" class="mt-4">
          <p class="text-sm font-medium text-gray-700 mb-2">Preview:</p>
          <img :src="form.imageUrl" alt="Preview" class="w-32 h-32 object-cover rounded" />
        </div>

        <!-- Galeria de fotos (apenas para eventos realizados) -->
        <div v-if="form.completed" class="space-y-3">
          <label class="block text-sm font-medium text-gray-700">
            Galeria de Fotos do Evento
          </label>
          
          <div v-for="(image, index) in form.gallery" :key="index" class="flex gap-2">
            <BaseInput
              v-model="form.gallery[index]"
              :placeholder="`URL da foto ${index + 1}`"
              type="url"
            />
            <button
              v-if="form.gallery.length > 0"
              type="button"
              @click="removeGalleryImage(index)"
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
            @click="addGalleryImage"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Adicionar Foto à Galeria
          </BaseButton>

          <!-- Preview da galeria -->
          <div v-if="form.gallery.some(img => img)" class="mt-4">
            <p class="text-sm font-medium text-gray-700 mb-2">Preview da Galeria:</p>
            <div class="grid grid-cols-4 gap-2">
              <img
                v-for="(image, index) in form.gallery.filter(img => img)"
                :key="index"
                :src="image"
                alt="Preview"
                class="w-full h-24 object-cover rounded"
              />
            </div>
          </div>
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <BaseButton variant="outline" @click="showModal = false">
            Cancelar
          </BaseButton>
          <BaseButton @click="saveEvent" :loading="saving">
            {{ editingEvent ? 'Atualizar' : 'Criar' }}
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useEventsStore } from '@/stores/events'
import { useDate } from '@/composables'
import { useToast } from '@/composables'
import { BaseButton, BaseCard, BaseModal, BaseInput, Badge, Spinner } from '@/components/ui'
import type { Event } from '@/types'

const eventsStore = useEventsStore()
const { formatDate } = useDate()
const { success, error: showError } = useToast()

const showModal = ref(false)
const saving = ref(false)
const editingEvent = ref<Event | null>(null)

const form = reactive({
  title: '',
  description: '',
  date: '',
  location: '',
  registeredParticipants: 0,
  maxParticipants: 0,
  imageUrl: '',
  completed: false,
  gallery: [] as string[]
})

const errors = reactive({
  title: '',
  description: ''
})
watch(() => form.completed, (isCompleted) => {
  if (!isCompleted) {
    form.gallery = []
  }
})

function openCreateModal() {
  resetForm()
  editingEvent.value = null
  showModal.value = true
}

function editEvent(event: Event) {
  editingEvent.value = event
  form.title = event.title
  form.description = event.description
  form.date = event.date
  form.location = event.location
  form.registeredParticipants = event.registeredParticipants
  form.maxParticipants = event.maxParticipants
  form.imageUrl = event.imageUrl
  form.completed = event.completed
  form.gallery = event.gallery ? [...event.gallery] : []
  showModal.value = true
}

function resetForm() {
  form.title = ''
  form.description = ''
  form.date = ''
  form.location = ''
  form.registeredParticipants = 0
  form.maxParticipants = 0
  form.imageUrl = ''
  form.completed = false
  form.gallery = []
  errors.title = ''
  errors.description = ''
}

function addGalleryImage() {
  form.gallery.push('')
}

function removeGalleryImage(index: number) {
  form.gallery.splice(index, 1)
}

async function saveEvent() {
  let isValid = true
  
  if (!form.title) {
    errors.title = 'Título é obrigatório'
    isValid = false
  } else {
    errors.title = ''
  }

  if (!form.description) {
    errors.description = 'Descrição é obrigatória'
    isValid = false
  } else {
    errors.description = ''
  }

  if (!isValid) return

  saving.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (editingEvent.value) {
      success('Evento atualizado com sucesso!')
    } else {
      success('Evento criado com sucesso!')
    }

    showModal.value = false
    resetForm()
    await eventsStore.fetchEvents()
  } catch (err) {
    showError('Erro ao salvar evento')
  } finally {
    saving.value = false
  }
}

async function deleteEvent(event: Event) {
  if (!confirm(`Deseja realmente excluir o evento "${event.title}"?`)) {
    return
  }

  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    success('Evento excluído com sucesso!')
    await eventsStore.fetchEvents()
  } catch (err) {
    showError('Erro ao excluir evento')
  }
}
eventsStore.fetchEvents()
</script>
