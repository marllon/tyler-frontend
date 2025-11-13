import {
  getRemoteConfig,
  fetchAndActivate,
  getValue,
} from "firebase/remote-config";
import { app } from "./firebase";
let db: any = null;

export interface RemoteConfigManager {
  getAuthorizedAdmins(): Promise<string[]>;
  getAuthorizedDomains(): Promise<string[]>;
  getPixSettings(): Promise<any>;
  initializeRemoteConfig(): Promise<void>;
}

class FirebaseRemoteConfigManager implements RemoteConfigManager {
  private remoteConfig: any = null;
  private initialized = false;

  constructor() {
    if (app) {
      try {
        this.remoteConfig = getRemoteConfig(app);
        this.remoteConfig.defaultConfig = {
          authorized_admins:
            import.meta.env.VITE_AUTHORIZED_ADMINS || "admin@tyler.com",
          authorized_domains:
            import.meta.env.VITE_AUTHORIZED_DOMAINS || "gmail.com,hotmail.com",
          pix_settings: JSON.stringify({
            environment: "sandbox",
            minAmount: 1.0,
            maxAmount: 10000.0,
          }),
        };
        this.remoteConfig.settings.minimumFetchIntervalMillis = import.meta.env
          .DEV
          ? 0
          : 3600000; // 1 hora em produção
      } catch (error) {
        console.warn("Erro ao inicializar Remote Config:", error);
        this.remoteConfig = null;
      }
    }
  }

  async initializeRemoteConfig(): Promise<void> {
    if (this.initialized || !this.remoteConfig) return;

    try {
      await fetchAndActivate(this.remoteConfig);
      console.log("🔧 Firebase Remote Config ativado com sucesso");
      this.initialized = true;
    } catch (error) {
      console.warn(
        "⚠️ Erro ao carregar Remote Config, usando valores padrão:",
        error
      );
      this.initialized = false;
    }
  }

  async getAuthorizedAdmins(): Promise<string[]> {
    try {
      const firestoreEmails = await this.getFirestoreAuthorizedEmails();
      if (firestoreEmails.length > 0) {
        return firestoreEmails;
      }
      if (this.initialized && this.remoteConfig) {
        const value = getValue(
          this.remoteConfig,
          "authorized_admins"
        ).asString();
        const emails = value
          .split(",")
          .map((email) => email.trim())
          .filter(Boolean);
        if (emails.length > 0) {
          return emails;
        }
      }
      const envEmails =
        import.meta.env.VITE_AUTHORIZED_ADMINS?.split(",").map((e) =>
          e.trim()
        ) || [];
      if (envEmails.length > 0) {
        return envEmails;
      }
      return ["admin@tyler.com"];
    } catch (error) {
      console.error("Erro ao buscar emails autorizados:", error);
      return ["admin@tyler.com"];
    }
  }

  async getAuthorizedDomains(): Promise<string[]> {
    try {
      if (this.initialized && this.remoteConfig) {
        const value = getValue(
          this.remoteConfig,
          "authorized_domains"
        ).asString();
        const domains = value
          .split(",")
          .map((domain) => domain.trim())
          .filter(Boolean);
        if (domains.length > 0) {
          return domains;
        }
      }
      const envDomains =
        import.meta.env.VITE_AUTHORIZED_DOMAINS?.split(",").map((d) =>
          d.trim()
        ) || [];
      if (envDomains.length > 0) {
        return envDomains;
      }

      return ["gmail.com", "hotmail.com"];
    } catch (error) {
      console.error("Erro ao buscar domínios autorizados:", error);
      return ["gmail.com", "hotmail.com"];
    }
  }

  async getPixSettings(): Promise<any> {
    try {
      if (this.initialized && this.remoteConfig) {
        const value = getValue(this.remoteConfig, "pix_settings").asString();
        return JSON.parse(value);
      }
      return {
        environment: "sandbox",
        minAmount: 1.0,
        maxAmount: 10000.0,
      };
    } catch (error) {
      console.error("Erro ao buscar configurações PIX:", error);
      return {
        environment: "sandbox",
        minAmount: 1.0,
        maxAmount: 10000.0,
      };
    }
  }

  private async getFirestoreAuthorizedEmails(): Promise<string[]> {
    try {
      if (!db && app) {
        try {
          const { getFirestore } = await import("firebase/firestore");
          db = getFirestore(app);
        } catch (error) {
          console.warn("Firestore não disponível:", error);
          return [];
        }
      }

      if (!db) return [];

      const { doc, getDoc } = await import("firebase/firestore");
      const docRef = doc(db, "settings/authorization");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const authorizedEmails = data.authorizedEmails || [];

        return authorizedEmails
          .filter((item: any) => item && item.email)
          .map((item: any) => item.email);
      }

      return [];
    } catch (error) {
      console.error("Erro ao buscar emails do Firestore:", error);
      return [];
    }
  }
}
class MockRemoteConfigManager implements RemoteConfigManager {
  async initializeRemoteConfig(): Promise<void> {
    console.log("🔧 Mock Remote Config Manager inicializado");
  }

  async getAuthorizedAdmins(): Promise<string[]> {
    const envEmails =
      import.meta.env.VITE_AUTHORIZED_ADMINS?.split(",").map((e) => e.trim()) ||
      [];
    return envEmails.length > 0
      ? envEmails
      : ["admin@tyler.com", "admin@gmail.com"];
  }

  async getAuthorizedDomains(): Promise<string[]> {
    const envDomains =
      import.meta.env.VITE_AUTHORIZED_DOMAINS?.split(",").map((d) =>
        d.trim()
      ) || [];
    return envDomains.length > 0 ? envDomains : ["gmail.com", "hotmail.com"];
  }

  async getPixSettings(): Promise<any> {
    return {
      environment: "sandbox",
      minAmount: 1.0,
      maxAmount: 10000.0,
    };
  }
}
function createRemoteConfigManager(): RemoteConfigManager {
  try {
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

    if (
      app &&
      projectId &&
      apiKey &&
      projectId !== "tyler-project" &&
      apiKey !== "your_api_key_here" &&
      apiKey.length > 30
    ) {
      console.log("📡 Usando Firebase Remote Config Manager");
      return new FirebaseRemoteConfigManager();
    } else {
      console.log(
        "🔧 Firebase não configurado, usando Mock Remote Config Manager"
      );
    }
  } catch (error) {
    console.warn("Firebase não disponível, usando mock manager:", error);
  }

  return new MockRemoteConfigManager();
}
export const remoteConfigManager = createRemoteConfigManager();
export async function getAuthorizedAdmins(): Promise<string[]> {
  return remoteConfigManager.getAuthorizedAdmins();
}

export async function getAuthorizedDomains(): Promise<string[]> {
  return remoteConfigManager.getAuthorizedDomains();
}

export async function getPixSettings(): Promise<any> {
  return remoteConfigManager.getPixSettings();
}

export async function initRemoteConfig(): Promise<void> {
  return remoteConfigManager.initializeRemoteConfig();
}
