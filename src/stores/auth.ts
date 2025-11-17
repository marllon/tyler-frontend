import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { AdminInfo } from "@/types";
import { firebaseService, type User } from "@/utils/firebase";
import { mockAuthService, type MockUser } from "@/utils/mockAuth";
import { authorizationService } from "@/utils/authorization";

export const useAuthStore = defineStore("auth", () => {
  const admin = ref<AdminInfo | null>(null);
  const user = ref<User | MockUser | null>(null);
  const token = ref<string | null>(localStorage.getItem("admin_token"));
  const loading = ref(false);
  const useFirebase = ref(true); // Flag para controlar se usa Firebase ou mock
  const authInitialized = ref(false); // Flag para indicar que auth foi inicializado
  const authStateReady = ref(false); // Flag para indicar que o estado de auth está pronto

  const isAuthenticated = computed(() => {
    const hasToken = !!token.value;
    const hasUser = !!user.value || !!admin.value;
    const result = hasToken && hasUser;
    console.log(
      "🔐 [AUTH COMPUTED] isAuthenticated:",
      result,
      "| token:",
      hasToken,
      "| user:",
      hasUser
    );
    return result;
  });

  async function loginWithGoogle() {
    loading.value = true;

    try {
      const firebaseResult = await firebaseService.signInWithGoogle();

      if (firebaseResult.success) {
        const authResult = await authorizationService.checkEmailAuthorization(
          firebaseResult.user!.email || ""
        );

        if (!authResult.authorized) {
          await firebaseService.signOut();
          return {
            success: false,
            error:
              authResult.reason ||
              "Email não autorizado para acessar o sistema",
          };
        }

        useFirebase.value = true;
        user.value = firebaseResult.user!;
        token.value = firebaseResult.token!;

        admin.value = {
          id: firebaseResult.user!.uid,
          name:
            firebaseResult.user!.displayName ||
            firebaseResult.user!.email ||
            "Admin",
          email: firebaseResult.user!.email || "",
          role: authResult.role || "admin",
        };

        localStorage.setItem("admin_token", firebaseResult.token!);
        return { success: true };
      }

      console.warn(
        "⚠️ Firebase Google Auth não disponível, usando mock para desenvolvimento"
      );
      useFirebase.value = false;

      const mockResult = await mockAuthService.signInWithGoogle();

      if (!mockResult.success) {
        return {
          success: false,
          error: mockResult.error || "Erro ao fazer login com Google",
        };
      }

      const authResult = await authorizationService.checkEmailAuthorization(
        mockResult.user!.email || ""
      );

      if (!authResult.authorized) {
        mockAuthService.clearMockUser();
        return {
          success: false,
          error:
            authResult.reason ||
            "Email não autorizado para acessar o sistema (modo desenvolvimento)",
        };
      }

      user.value = mockResult.user!;
      token.value = mockResult.token!;

      admin.value = {
        id: mockResult.user!.uid,
        name: mockResult.user!.displayName || mockResult.user!.email || "Admin",
        email: mockResult.user!.email || "",
        role: authResult.role || "admin",
      };

      localStorage.setItem("admin_token", mockResult.token!);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Erro ao fazer login com Google",
      };
    } finally {
      loading.value = false;
    }
  }

  async function login(email: string, password: string) {
    loading.value = true;

    try {
      const firebaseResult = await firebaseService.signIn(email, password);

      if (firebaseResult.success) {
        const authResult = await authorizationService.checkEmailAuthorization(
          firebaseResult.user!.email || ""
        );

        if (!authResult.authorized) {
          await firebaseService.signOut();
          return {
            success: false,
            error:
              authResult.reason ||
              "Email não autorizado para acessar o sistema",
          };
        }

        useFirebase.value = true;
        user.value = firebaseResult.user!;
        token.value = firebaseResult.token!;

        admin.value = {
          id: firebaseResult.user!.uid,
          name:
            firebaseResult.user!.displayName ||
            firebaseResult.user!.email ||
            "Admin",
          email: firebaseResult.user!.email || "",
          role: authResult.role || "admin",
        };

        localStorage.setItem("admin_token", firebaseResult.token!);
        return { success: true };
      }

      console.warn(
        "⚠️ Firebase não disponível, usando autenticação mock para desenvolvimento"
      );
      useFirebase.value = false;

      const mockResult = await mockAuthService.signIn(email, password);

      if (!mockResult.success) {
        return {
          success: false,
          error: mockResult.error || "Erro ao fazer login",
        };
      }

      user.value = mockResult.user!;
      token.value = mockResult.token!;

      admin.value = {
        id: mockResult.user!.uid,
        name: mockResult.user!.displayName || mockResult.user!.email || "Admin",
        email: mockResult.user!.email || "",
        role: "admin",
      };

      mockAuthService.saveMockUser(mockResult.user!, mockResult.token!);
      localStorage.setItem("admin_token", mockResult.token!);

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Erro ao fazer login",
      };
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    loading.value = true;

    try {
      if (useFirebase.value) {
        await firebaseService.signOut();
      } else {
        await mockAuthService.signOut();
        mockAuthService.clearMockUser();
      }

      token.value = null;
      admin.value = null;
      user.value = null;
      localStorage.removeItem("admin_token");

      return { success: true };
    } catch (error) {
      console.error("Erro ao fazer logout:", error);

      token.value = null;
      admin.value = null;
      user.value = null;
      localStorage.removeItem("admin_token");

      if (!useFirebase.value) {
        mockAuthService.clearMockUser();
      }

      return { success: false, error: "Erro ao fazer logout" };
    } finally {
      loading.value = false;
    }
  }

  function initializeAuth() {
    console.log("🔧 [AUTH] Inicializando listeners de autenticação...");

    try {
      return firebaseService.onAuthStateChanged((firebaseUser) => {
        console.log(
          "🔧 [AUTH] onAuthStateChanged Firebase:",
          firebaseUser ? firebaseUser.email : "null"
        );

        if (firebaseUser) {
          useFirebase.value = true;
          user.value = firebaseUser;
          admin.value = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email || "Admin",
            email: firebaseUser.email || "",
            role: "admin",
          };

          firebaseUser.getIdToken().then((newToken) => {
            token.value = newToken;
            localStorage.setItem("admin_token", newToken);
            console.log("✅ [AUTH] Sessão Firebase restaurada");
            authStateReady.value = true;
          });
        } else {
          console.log("🔧 [AUTH] Firebase sem usuário, verificando Mock...");
          checkMockAuth();
        }

        if (!authInitialized.value) {
          authInitialized.value = true;
          console.log("✅ [AUTH] Autenticação inicializada");
        }
      });
    } catch (error) {
      console.warn("⚠️ [AUTH] Firebase não disponível, usando sistema mock");
      checkMockAuth();
      authInitialized.value = true;
      return () => {}; // Retorna função vazia para cleanup
    }
  }

  function checkMockAuth() {
    useFirebase.value = false;

    mockAuthService.onAuthStateChanged((mockUser) => {
      console.log(
        "🔧 [AUTH] onAuthStateChanged Mock:",
        mockUser ? mockUser.email : "null"
      );

      if (mockUser) {
        user.value = mockUser;
        admin.value = {
          id: mockUser.uid,
          name: mockUser.displayName || mockUser.email || "Admin",
          email: mockUser.email || "",
          role: "admin",
        };

        const mockToken = localStorage.getItem("mock_token");
        if (mockToken) {
          token.value = mockToken;
          localStorage.setItem("admin_token", mockToken);
        }
        console.log("✅ [AUTH] Sessão Mock restaurada");
      } else {
        user.value = null;
        admin.value = null;
        token.value = null;
        localStorage.removeItem("admin_token");
        console.log("❌ [AUTH] Nenhuma sessão ativa");
      }

      authStateReady.value = true;
    });
  }

  async function checkAuth() {
    console.log("🔍 [AUTH] Iniciando checkAuth()");
    if (!authInitialized.value) {
      console.log("⏳ [AUTH] Aguardando inicialização...");
      await new Promise<void>((resolve) => {
        const checkInterval = setInterval(() => {
          if (authInitialized.value) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 50);
        setTimeout(() => {
          clearInterval(checkInterval);
          console.log("⚠️ [AUTH] Timeout ao aguardar inicialização");
          resolve();
        }, 3000);
      });
    }
    if (!authStateReady.value) {
      console.log("⏳ [AUTH] Aguardando estado de autenticação...");
      await new Promise<void>((resolve) => {
        const checkInterval = setInterval(() => {
          if (authStateReady.value || !localStorage.getItem("admin_token")) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 50);
        setTimeout(() => {
          clearInterval(checkInterval);
          console.log("⚠️ [AUTH] Timeout ao aguardar estado");
          resolve();
        }, 2000);
      });
    }

    const storedToken = localStorage.getItem("admin_token");
    console.log("🔍 [AUTH] Token armazenado:", storedToken ? "SIM" : "NÃO");

    if (!storedToken) {
      console.log("❌ [AUTH] Sem token, limpando dados");
      user.value = null;
      admin.value = null;
      token.value = null;
      return false;
    }

    try {
      console.log("🔍 [AUTH] Verificando Firebase...");
      const currentUser = firebaseService.getCurrentUser();
      if (currentUser) {
        console.log(
          "✅ [AUTH] Usuário Firebase encontrado:",
          currentUser.email
        );
        useFirebase.value = true;
        user.value = currentUser;
        admin.value = {
          id: currentUser.uid,
          name: currentUser.displayName || currentUser.email || "Admin",
          email: currentUser.email || "",
          role: "admin",
        };

        const freshToken = await firebaseService.getCurrentUserToken();
        if (freshToken) {
          token.value = freshToken;
          localStorage.setItem("admin_token", freshToken);
          console.log("✅ [AUTH] Token atualizado");
        } else {
          token.value = storedToken;
          console.log("✅ [AUTH] Usando token armazenado");
        }
        console.log("✅ [AUTH] Autenticação Firebase confirmada");
        return true;
      }

      console.log(
        "🔍 [AUTH] Firebase não disponível, verificando Mock Auth..."
      );
      const mockUser = mockAuthService.getCurrentUser();
      if (mockUser) {
        console.log("✅ [AUTH] Usuário Mock encontrado:", mockUser.email);
        useFirebase.value = false;
        user.value = mockUser;
        admin.value = {
          id: mockUser.uid,
          name: mockUser.displayName || mockUser.email || "Admin",
          email: mockUser.email || "",
          role: "admin",
        };
        token.value = storedToken;
        console.log("✅ [AUTH] Autenticação Mock confirmada");
        return true;
      }

      console.log("❌ [AUTH] Nenhum usuário encontrado, fazendo logout");
      await logout();
      return false;
    } catch (error) {
      console.error("❌ [AUTH] Erro ao verificar autenticação:", error);
      await logout();
      return false;
    }
  }

  function getCurrentFirebaseUser() {
    if (useFirebase.value && user.value) {
      return user.value;
    }
    return null;
  }

  return {
    admin,
    user,
    token,
    loading,
    useFirebase,
    isAuthenticated,
    authInitialized,
    authStateReady,
    login,
    loginWithGoogle,
    logout,
    initializeAuth,
    checkAuth,
    getCurrentFirebaseUser,
  };
});
