import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { PublicUser, ShippingAddress } from "@/types";
import { firebaseService } from "@/utils/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  type User,
} from "firebase/auth";

export const useUserStore = defineStore("user", () => {
  const user = ref<PublicUser | null>(null);
  const token = ref<string | null>(localStorage.getItem("user_token"));
  const loading = ref(false);
  const authInitialized = ref(false);

  const isAuthenticated = computed(() => !!user.value && !!token.value);
  const mapFirebaseUser = (firebaseUser: User): PublicUser => {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      displayName: firebaseUser.displayName || undefined,
      photoURL: firebaseUser.photoURL || undefined,
      phoneNumber: firebaseUser.phoneNumber || undefined,
      emailVerified: firebaseUser.emailVerified,
      savedAddresses: [],
      createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
    };
  };
  const loginWithEmail = async (email: string, password: string) => {
    loading.value = true;
    try {
      if (!firebaseService.auth) {
        throw new Error("Firebase não configurado");
      }

      const result = await signInWithEmailAndPassword(
        firebaseService.auth,
        email,
        password
      );

      const userToken = await result.user.getIdToken();
      user.value = mapFirebaseUser(result.user);
      token.value = userToken;

      localStorage.setItem("user_token", userToken);
      localStorage.setItem("user_data", JSON.stringify(user.value));

      return { success: true };
    } catch (error: any) {
      console.error("Erro no login:", error);
      return {
        success: false,
        error: getErrorMessage(error.code),
      };
    } finally {
      loading.value = false;
    }
  };
  const loginWithGoogle = async () => {
    loading.value = true;
    try {
      const result = await firebaseService.signInWithGoogle();

      if (result.success && result.user) {
        user.value = mapFirebaseUser(result.user as User);
        token.value = result.token || null;

        if (token.value) {
          localStorage.setItem("user_token", token.value);
          localStorage.setItem("user_data", JSON.stringify(user.value));
        }
      }

      return result;
    } catch (error: any) {
      console.error("Erro no login Google:", error);
      return {
        success: false,
        error: "Erro ao fazer login com Google",
      };
    } finally {
      loading.value = false;
    }
  };
  const register = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    loading.value = true;
    try {
      if (!firebaseService.auth) {
        throw new Error("Firebase não configurado");
      }

      const result = await createUserWithEmailAndPassword(
        firebaseService.auth,
        email,
        password
      );
      await updateProfile(result.user, { displayName });

      const userToken = await result.user.getIdToken();
      user.value = mapFirebaseUser(result.user);
      token.value = userToken;

      localStorage.setItem("user_token", userToken);
      localStorage.setItem("user_data", JSON.stringify(user.value));

      return { success: true };
    } catch (error: any) {
      console.error("Erro no registro:", error);
      return {
        success: false,
        error: getErrorMessage(error.code),
      };
    } finally {
      loading.value = false;
    }
  };
  const resetPassword = async (email: string) => {
    loading.value = true;
    try {
      if (!firebaseService.auth) {
        throw new Error("Firebase não configurado");
      }

      await sendPasswordResetEmail(firebaseService.auth, email);
      return { success: true };
    } catch (error: any) {
      console.error("Erro ao recuperar senha:", error);
      return {
        success: false,
        error: getErrorMessage(error.code),
      };
    } finally {
      loading.value = false;
    }
  };
  const logout = async () => {
    try {
      if (firebaseService.auth) {
        await firebaseSignOut(firebaseService.auth);
      }

      user.value = null;
      token.value = null;

      localStorage.removeItem("user_token");
      localStorage.removeItem("user_data");

      return { success: true };
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error);
      return { success: false, error: "Erro ao fazer logout" };
    }
  };
  const addAddress = (address: ShippingAddress) => {
    if (!user.value) return;

    if (!user.value.savedAddresses) {
      user.value.savedAddresses = [];
    }

    user.value.savedAddresses.push(address);
    localStorage.setItem("user_data", JSON.stringify(user.value));
  };
  const removeAddress = (index: number) => {
    if (!user.value || !user.value.savedAddresses) return;

    user.value.savedAddresses.splice(index, 1);
    localStorage.setItem("user_data", JSON.stringify(user.value));
  };
  const initAuth = () => {
    if (!firebaseService.auth) {
      console.warn("Firebase auth não disponível");
      authInitialized.value = true;
      return;
    }

    onAuthStateChanged(firebaseService.auth, async (firebaseUser) => {
      if (firebaseUser) {
        user.value = mapFirebaseUser(firebaseUser);
        token.value = await firebaseUser.getIdToken();

        localStorage.setItem("user_token", token.value);
        localStorage.setItem("user_data", JSON.stringify(user.value));
      } else {
        user.value = null;
        token.value = null;
      }

      authInitialized.value = true;
    });
  };
  const getErrorMessage = (code: string): string => {
    const messages: Record<string, string> = {
      "auth/invalid-email": "Email inválido",
      "auth/user-disabled": "Usuário desabilitado",
      "auth/user-not-found": "Usuário não encontrado",
      "auth/wrong-password": "Senha incorreta",
      "auth/email-already-in-use": "Email já está em uso",
      "auth/weak-password": "Senha muito fraca (mínimo 6 caracteres)",
      "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde",
      "auth/network-request-failed": "Erro de conexão",
    };

    return messages[code] || "Erro ao processar sua solicitação";
  };

  return {
    user,
    token,
    loading,
    isAuthenticated,
    authInitialized,
    loginWithEmail,
    loginWithGoogle,
    register,
    resetPassword,
    logout,
    addAddress,
    removeAddress,
    initAuth,
  };
});
