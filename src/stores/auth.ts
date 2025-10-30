import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { AdminInfo } from "@/types";
import { api } from "@/utils/api";

export const useAuthStore = defineStore("auth", () => {
  const admin = ref<AdminInfo | null>(null);
  const token = ref<string | null>(localStorage.getItem("admin_token"));

  const isAuthenticated = computed(() => !!token.value && !!admin.value);

  async function login(email: string, password: string) {
    try {
      const response = await api.post<{
        success: boolean;
        token?: string;
        admin?: AdminInfo;
        error?: string;
      }>("/admin/login", { email, password });

      if (response.success && response.token && response.admin) {
        token.value = response.token;
        admin.value = response.admin;
        localStorage.setItem("admin_token", response.token);
        return { success: true };
      } else {
        return {
          success: false,
          error: response.error || "Erro ao fazer login",
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || "Erro ao fazer login",
      };
    }
  }

  function logout() {
    token.value = null;
    admin.value = null;
    localStorage.removeItem("admin_token");
  }

  // Check if token is valid on store initialization
  async function checkAuth() {
    if (token.value) {
      try {
        // Verify token with backend
        // const response = await api.get('/admin/me')
        // For now, just keep the token
      } catch (error) {
        logout();
      }
    }
  }

  return {
    admin,
    token,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };
});
