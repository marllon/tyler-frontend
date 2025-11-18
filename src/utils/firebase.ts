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
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

function isValidFirebaseConfig(config: any): boolean {
  const requiredFields = ["apiKey", "authDomain", "projectId"];

  for (const field of requiredFields) {
    const value = config[field];
    if (!value || value === "undefined" || value.length < 10) {
      return false;
    }
  }

  if (
    config.projectId === "tyler-project" ||
    config.apiKey === "your_api_key_here"
  ) {
    return false;
  }

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

let app;
let auth;
let googleProvider;
let db;

if (isFirebaseConfigValid) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();

    googleProvider.addScope("email");
    googleProvider.addScope("profile");

    console.log("🔥 Firebase inicializado com sucesso");
  } catch (error) {
    console.warn("⚠️ Erro ao inicializar Firebase:", error);
    app = undefined;
    auth = undefined;
    db = undefined;
    googleProvider = undefined;
  }
} else {
  console.log("🔧 Executando em modo de desenvolvimento (sem Firebase)");
}

export {
  app,
  auth,
  db,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
};
export type { User };

export const firebaseService = {
  async getAuthorizedEmails(): Promise<string[]> {
    if (!db) {
      console.warn(
        "⚠️ Firestore não inicializado. Configure o Firebase para usar autenticação."
      );
      return [];
    }

    try {
      const docRef = doc(db, "settings", "admins");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const emails = data.authorizedEmails || data.emails || [];
        console.log("✅ E-mails autorizados carregados do Firestore:", emails);
        return emails;
      } else {
        console.warn(
          "⚠️ Documento settings/admins não encontrado no Firestore. Crie o documento com a lista de e-mails autorizados."
        );
        return [];
      }
    } catch (error) {
      console.error("❌ Erro ao buscar e-mails autorizados:", error);
      return [];
    }
  },

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

  getCurrentUser(): User | null {
    return auth?.currentUser || null;
  },

  onAuthStateChanged(callback: (user: User | null) => void) {
    if (!auth) {
      callback(null);
      return () => {}; // Retorna função vazia para unsubscribe
    }
    return onAuthStateChanged(auth, callback);
  },

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
