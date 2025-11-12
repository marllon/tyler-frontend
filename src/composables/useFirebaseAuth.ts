import { ref, computed } from "vue";
import { firebaseService, type User } from "@/utils/firebase";
import { useAuthStore } from "@/stores/auth";

export function useFirebaseAuth() {
  const authStore = useAuthStore();

  const loading = computed(() => authStore.loading);
  const user = computed(() => authStore.user);
  const isAuthenticated = computed(() => authStore.isAuthenticated);

  /**
   * Login com Google
   */
  async function signInWithGoogle() {
    return authStore.loginWithGoogle();
  }

  /**
   * Login com email e senha
   */
  async function signIn(email: string, password: string) {
    return authStore.login(email, password);
  }

  /**
   * Logout
   */
  async function signOut() {
    return authStore.logout();
  }

  /**
   * Obter token atual do usuário
   */
  async function getToken(): Promise<string | null> {
    return firebaseService.getCurrentUserToken();
  }

  /**
   * Verificar se token ainda é válido
   */
  async function refreshToken(): Promise<string | null> {
    const currentUser = firebaseService.getCurrentUser();
    if (currentUser) {
      return currentUser.getIdToken(true); // Force refresh
    }
    return null;
  }

  /**
   * Verificar se usuário tem permissões de admin
   */
  function isAdmin(): boolean {
    return authStore.admin?.role === "admin";
  }

  /**
   * Aguardar inicialização do Firebase Auth
   */
  function waitForAuthInit(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = firebaseService.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  return {
    // State
    loading,
    user,
    isAuthenticated,

    // Actions
    signIn,
    signInWithGoogle,
    signOut,
    getToken,
    refreshToken,
    isAdmin,
    waitForAuthInit,
  };
}
