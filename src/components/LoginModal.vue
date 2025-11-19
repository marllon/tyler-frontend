<template>
  <BaseModal
    :model-value="isOpen"
    @update:model-value="handleModalChange"
    @close="close"
    title="Entre na sua conta"
  >
    <div class="space-y-6">
      <!-- Tabs -->
      <div class="flex border-b">
        <button
          @click="mode = 'login'"
          class="flex-1 pb-3 font-medium transition-colors"
          :class="
            mode === 'login'
              ? 'text-tyler-blue border-b-2 border-tyler-blue'
              : 'text-gray-500 hover:text-gray-700'
          "
        >
          Entrar
        </button>
        <button
          @click="mode = 'register'"
          class="flex-1 pb-3 font-medium transition-colors"
          :class="
            mode === 'register'
              ? 'text-tyler-blue border-b-2 border-tyler-blue'
              : 'text-gray-500 hover:text-gray-700'
          "
        >
          Criar Conta
        </button>
      </div>

      <!-- Login com Google -->
      <button
        @click="handleGoogleLogin"
        :disabled="userStore.loading"
        class="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        <span class="font-medium">Continuar com Google</span>
      </button>

      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">ou</span>
        </div>
      </div>

      <!-- Formulário de Login -->
      <form
        v-if="mode === 'login'"
        @submit.prevent="handleEmailLogin"
        class="space-y-4"
      >
        <BaseInput
          v-model="email"
          type="email"
          label="Email"
          placeholder="seu@email.com"
          required
          :disabled="userStore.loading"
        />
        <BaseInput
          v-model="password"
          type="password"
          label="Senha"
          placeholder="••••••••"
          required
          :disabled="userStore.loading"
        />

        <button
          type="button"
          @click="showResetPassword = true"
          class="text-sm text-tyler-blue hover:underline"
        >
          Esqueci minha senha
        </button>

        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          class="w-full"
          :disabled="userStore.loading"
        >
          <Spinner v-if="userStore.loading" size="sm" class="mr-2" />
          Entrar
        </BaseButton>
      </form>

      <!-- Formulário de Registro -->
      <form v-else @submit.prevent="handleRegister" class="space-y-4">
        <BaseInput
          v-model="displayName"
          type="text"
          label="Nome completo"
          placeholder="João Silva"
          required
          :disabled="userStore.loading"
        />
        <BaseInput
          v-model="email"
          type="email"
          label="Email"
          placeholder="seu@email.com"
          required
          :disabled="userStore.loading"
        />
        <BaseInput
          v-model="password"
          type="password"
          label="Senha"
          placeholder="Mínimo 6 caracteres"
          required
          minlength="6"
          :disabled="userStore.loading"
        />
        <BaseInput
          v-model="confirmPassword"
          type="password"
          label="Confirmar senha"
          placeholder="Digite a senha novamente"
          required
          :disabled="userStore.loading"
        />

        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          class="w-full"
          :disabled="userStore.loading"
        >
          <Spinner v-if="userStore.loading" size="sm" class="mr-2" />
          Criar Conta
        </BaseButton>
      </form>

      <!-- Reset Password Modal -->
      <BaseModal
        :is-open="showResetPassword"
        @close="showResetPassword = false"
        title="Recuperar Senha"
      >
        <form @submit.prevent="handlePasswordReset" class="space-y-4">
          <p class="text-sm text-gray-600">
            Digite seu email para receber um link de recuperação de senha.
          </p>
          <BaseInput
            v-model="resetEmail"
            type="email"
            label="Email"
            placeholder="seu@email.com"
            required
          />
          <BaseButton type="submit" variant="primary" class="w-full">
            Enviar Link
          </BaseButton>
        </form>
      </BaseModal>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import { useToast } from "@/composables/useToast";
import BaseModal from "@/components/ui/BaseModal.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import Spinner from "@/components/ui/Spinner.vue";

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "success"): void;
}>();

const userStore = useUserStore();
const { showToast } = useToast();

const mode = ref<"login" | "register">("login");
const email = ref("");
const password = ref("");
const displayName = ref("");
const confirmPassword = ref("");
const showResetPassword = ref(false);
const resetEmail = ref("");

const close = () => {
  emit("close");
};

const handleModalChange = (value: boolean) => {
  if (!value) {
    close();
  }
};

const handleGoogleLogin = async () => {
  const result = await userStore.loginWithGoogle();

  if (result.success) {
    showToast("Login realizado com sucesso!", "success");
    emit("success");
    close();
  } else {
    showToast(result.error || "Erro ao fazer login", "error");
  }
};

const handleEmailLogin = async () => {
  const result = await userStore.loginWithEmail(email.value, password.value);

  if (result.success) {
    showToast("Login realizado com sucesso!", "success");
    emit("success");
    close();
  } else {
    showToast(result.error || "Erro ao fazer login", "error");
  }
};

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    showToast("As senhas não coincidem", "error");
    return;
  }

  const result = await userStore.register(
    email.value,
    password.value,
    displayName.value
  );

  if (result.success) {
    showToast("Conta criada com sucesso!", "success");
    emit("success");
    close();
  } else {
    showToast(result.error || "Erro ao criar conta", "error");
  }
};

const handlePasswordReset = async () => {
  const result = await userStore.resetPassword(resetEmail.value);

  if (result.success) {
    showToast("Link de recuperação enviado para seu email!", "success");
    showResetPassword.value = false;
    resetEmail.value = "";
  } else {
    showToast(result.error || "Erro ao enviar link", "error");
  }
};
</script>
