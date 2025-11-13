import { ref, computed } from "vue";
import { firebaseService, type User } from "@/utils/firebase";
import { useAuthStore } from "@/stores/auth";

export function useFirebaseAuth() {
  const authStore = useAuthStore();

  const loading = computed(() => authStore.loading);
  const user = computed(() => authStore.user);
  const isAuthenticated = computed(() => authStore.isAuthenticated);

  async function signInWithGoogle() {
    return authStore.loginWithGoogle();
  }

  async function signIn(email: string, password: string) {
    return authStore.login(email, password);
  }

  async function signOut() {
    return authStore.logout();
  }

  async function getToken(): Promise<string | null> {
    return firebaseService.getCurrentUserToken();
  }

  async function refreshToken(): Promise<string | null> {
    const currentUser = firebaseService.getCurrentUser();
    if (currentUser) {
      return currentUser.getIdToken(true); // Force refresh
    }
    return null;
  }

  function isAdmin(): boolean {
    return authStore.admin?.role === "admin";
  }

  function waitForAuthInit(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = firebaseService.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  return {
    loading,
    user,
    isAuthenticated,
    signIn,
    signInWithGoogle,
    signOut,
    getToken,
    refreshToken,
    isAdmin,
    waitForAuthInit,
  };
}
