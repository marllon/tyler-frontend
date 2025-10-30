<template>
  <div class="py-12">
    <div class="container mx-auto px-4 max-w-2xl">
      <h1 class="section-title text-center">Entre em Contato</h1>
      <p class="section-subtitle text-center">
        Tem dúvidas ou sugestões? Envie-nos uma mensagem!
      </p>

      <form @submit.prevent="handleSubmit" class="card">
        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-2" for="name">
            Nome *
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="input-field"
            placeholder="Seu nome completo"
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-2" for="email">
            E-mail *
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="input-field"
            placeholder="seu@email.com"
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-2" for="phone">
            Telefone
          </label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            class="input-field"
            placeholder="(00) 00000-0000"
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-2" for="subject">
            Assunto *
          </label>
          <input
            id="subject"
            v-model="form.subject"
            type="text"
            required
            class="input-field"
            placeholder="Assunto da mensagem"
          />
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 font-medium mb-2" for="message">
            Mensagem *
          </label>
          <textarea
            id="message"
            v-model="form.message"
            required
            rows="6"
            class="input-field resize-none"
            placeholder="Escreva sua mensagem..."
          ></textarea>
        </div>

        <div
          v-if="error"
          class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <p class="text-red-700 text-sm">{{ error }}</p>
        </div>

        <div
          v-if="success"
          class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <p class="text-green-700 text-sm">Mensagem enviada com sucesso!</p>
        </div>

        <button type="submit" :disabled="loading" class="btn-primary w-full">
          {{ loading ? "Enviando..." : "Enviar mensagem" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const form = ref({
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
});

const loading = ref(false);
const error = ref("");
const success = ref(false);

async function handleSubmit() {
  loading.value = true;
  error.value = "";
  success.value = false;

  try {
    // TODO: Implementar envio real
    await new Promise((resolve) => setTimeout(resolve, 1000));
    success.value = true;
    form.value = { name: "", email: "", phone: "", subject: "", message: "" };
  } catch (err) {
    error.value = "Erro ao enviar mensagem. Tente novamente.";
  } finally {
    loading.value = false;
  }
}
</script>
