import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Verificar se as configurações são válidas
function isValidFirebaseConfig(config: any): boolean {
  const requiredFields = ["apiKey", "authDomain", "projectId"];

  for (const field of requiredFields) {
    const value = config[field];
    if (!value || value === "undefined" || value.length < 10) {
      return false;
    }
  }

  // Verificar se não são valores de exemplo/placeholder
  if (
    config.projectId === "tyler-project" ||
    config.apiKey === "your_api_key_here"
  ) {
    return false;
  }

  // Verificar se não é chave do Google Console (erro comum)
  if (config.apiKey && config.apiKey.startsWith("GOCSPX-")) {
    console.error(
      "❌ Erro: Você está usando uma chave do Google Console, não do Firebase!"
    );
    console.error(
      "🔧 Solução: Vá para console.firebase.google.com e obtenha a chave correta"
    );
    console.error('💡 A chave do Firebase deve começar com "AIzaSy..."');
    return false;
  }

  return true;
}

const isFirebaseConfigValid = isValidFirebaseConfig(firebaseConfig);

if (!isFirebaseConfigValid) {
  console.warn(
    "⚠️ Firebase não configurado corretamente. Usando modo de desenvolvimento."
  );
  console.info("📝 Para usar Firebase, configure as variáveis no .env:");
  console.info("   VITE_FIREBASE_API_KEY=sua_chave_aqui");
  console.info("   VITE_FIREBASE_PROJECT_ID=seu_projeto_aqui");
  console.info("   VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com");
}

// Inicializar Firebase apenas se as configurações estiverem válidas
let app;
let auth;
let googleProvider;

if (isFirebaseConfigValid) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();

    // Configurar o provider do Google
    googleProvider.addScope("email");
    googleProvider.addScope("profile");

    console.log("🔥 Firebase inicializado com sucesso");
  } catch (error) {
    console.warn("⚠️ Erro ao inicializar Firebase:", error);
    app = undefined;
    auth = undefined;
    googleProvider = undefined;
  }
} else {
  console.log("🔧 Executando em modo de desenvolvimento (sem Firebase)");
}

export {
  app,
  auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
};
export type { User };

// Exportar db como null por enquanto (para compatibilidade)
export const db = null;

// Funções de autenticação
export const firebaseService = {
  /**
   * Login com Google
   */
  async signInWithGoogle() {
    console.log("🔑 Iniciando login com Google...");

    if (!auth || !googleProvider) {
      console.error("❌ Firebase não configurado:", {
        auth: !!auth,
        provider: !!googleProvider,
      });
      return {
        success: false,
        error:
          "Firebase não está configurado. Verifique as variáveis de ambiente.",
      };
    }

    try {
      console.log("📱 Abrindo popup do Google...");
      const result = await signInWithPopup(auth, googleProvider);

      console.log("✅ Login bem sucedido:", result.user.email);
      const token = await result.user.getIdToken();

      return {
        success: true,
        user: result.user,
        token,
      };
    } catch (error: any) {
      console.error("❌ Erro no login Google:", error);
      console.error("Código do erro:", error.code);
      console.error("Mensagem:", error.message);

      return {
        success: false,
        error: this.getErrorMessage(error.code),
      };
    }
  },

  /**
   * Login com email e senha (mantido como fallback)
   */
  async signIn(email: string, password: string) {
    if (!auth) {
      return {
        success: false,
        error:
          "Firebase não está configurado. Verifique as variáveis de ambiente.",
      };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      return {
        success: true,
        user: userCredential.user,
        token,
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.getErrorMessage(error.code),
      };
    }
  },

  /**
   * Logout
   */
  async signOut() {
    if (!auth) {
      return { success: true }; // Se não tem auth, considera logout bem-sucedido
    }

    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: "Erro ao fazer logout",
      };
    }
  },

  /**
   * Obter token do usuário atual
   */
  async getCurrentUserToken(): Promise<string | null> {
    if (!auth) return null;

    try {
      if (auth.currentUser) {
        return await auth.currentUser.getIdToken();
      }
      return null;
    } catch (error) {
      console.error("Erro ao obter token:", error);
      return null;
    }
  },

  /**
   * Verificar se usuário está logado
   */
  getCurrentUser(): User | null {
    return auth?.currentUser || null;
  },

  /**
   * Escutar mudanças de estado de autenticação
   */
  onAuthStateChanged(callback: (user: User | null) => void) {
    if (!auth) {
      // Se Firebase não está configurado, chama callback com null
      callback(null);
      return () => {}; // Retorna função vazia para unsubscribe
    }
    return onAuthStateChanged(auth, callback);
  },

  /**
   * Traduzir códigos de erro do Firebase
   */
  getErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      "auth/user-not-found": "Usuário não encontrado",
      "auth/wrong-password": "Senha incorreta",
      "auth/invalid-email": "Email inválido",
      "auth/user-disabled": "Usuário desabilitado",
      "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde",
      "auth/network-request-failed": "Erro de conexão. Verifique sua internet",
      "auth/invalid-credential": "Credenciais inválidas",
      "auth/popup-closed-by-user": "Login cancelado pelo usuário",
      "auth/popup-blocked": "Pop-up bloqueado pelo navegador",
      "auth/cancelled-popup-request": "Login cancelado",
      "auth/unauthorized-domain": "Domínio não autorizado para autenticação",
    };

    return errorMessages[errorCode] || "Erro de autenticação";
  },
};
