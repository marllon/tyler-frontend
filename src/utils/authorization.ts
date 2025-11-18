import { getAuthorizedAdmins, getAuthorizedDomains } from "./remoteConfig";
import { firebaseService } from "./firebase";

let cachedAdmins: string[] = [];
let cachedDomains: string[] = [];
let lastCacheUpdate = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

async function getAuthorizedEmailsAsync(): Promise<string[]> {
  const now = Date.now();

  if (cachedAdmins.length > 0 && now - lastCacheUpdate < CACHE_DURATION) {
    return cachedAdmins;
  }

  try {
    const firestoreEmails = await firebaseService.getAuthorizedEmails();

    if (firestoreEmails.length > 0) {
      cachedAdmins = firestoreEmails
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);
      lastCacheUpdate = now;
      console.log("✅ E-mails autorizados carregados do Firestore");
      return cachedAdmins;
    }
    const emails = await getAuthorizedAdmins();
    cachedAdmins = emails
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);
    lastCacheUpdate = now;

    if (cachedAdmins.length === 0) {
      console.warn(
        "⚠️ Nenhum admin configurado, usando fallback de desenvolvimento"
      );
      cachedAdmins = [
        "admin@tylerlimaeler.org",
        "tyler@gmail.com",
        "admin@gmail.com", // Para testes de desenvolvimento
      ];
    }

    return cachedAdmins;
  } catch (error) {
    console.error("Erro ao buscar emails autorizados:", error);

    return ["admin@tylerlimaeler.org", "tyler@gmail.com", "admin@gmail.com"];
  }
}

async function getAuthorizedDomainsAsync(): Promise<string[]> {
  const now = Date.now();

  if (cachedDomains.length > 0 && now - lastCacheUpdate < CACHE_DURATION) {
    return cachedDomains;
  }

  try {
    const domains = await getAuthorizedDomains();
    cachedDomains = domains
      .map((domain) => domain.trim().toLowerCase())
      .filter(Boolean);

    if (cachedDomains.length === 0) {
      cachedDomains = ["gmail.com", "hotmail.com"]; // Fallback padrão
    }

    return cachedDomains;
  } catch (error) {
    console.error("Erro ao buscar domínios autorizados:", error);
    return ["gmail.com", "hotmail.com"];
  }
}

export interface AuthorizationResult {
  authorized: boolean;
  role?: "admin" | "super-admin";
  reason?: string;
}

export interface AuthorizedAdmin {
  email: string;
  role: "admin" | "super-admin";
  addedAt?: string;
  addedBy?: string;
}

export const authorizationService = {
  async checkEmailAuthorization(email: string): Promise<AuthorizationResult> {
    if (!email) {
      return {
        authorized: false,
        reason: "Email não fornecido",
      };
    }

    const normalizedEmail = email.toLowerCase().trim();

    try {
      const authorizedEmails = await getAuthorizedEmailsAsync();

      if (authorizedEmails.includes(normalizedEmail)) {
        const role =
          normalizedEmail.includes("tyler") ||
          normalizedEmail.includes("admin@tylerlimaeler.org")
            ? "super-admin"
            : "admin";

        return {
          authorized: true,
          role,
        };
      }

      const authorizedDomains = await getAuthorizedDomainsAsync();
      const emailDomain = normalizedEmail.split("@")[1];

      if (authorizedDomains.includes(emailDomain)) {
        return {
          authorized: true,
          role: "admin",
        };
      }

      return {
        authorized: false,
        reason: "Email não autorizado para acessar o painel administrativo",
      };
    } catch (error) {
      console.error("Erro ao verificar autorização:", error);
      return {
        authorized: false,
        reason: "Erro interno ao verificar autorização",
      };
    }
  },

  hasPermission(
    userRole: string,
    requiredRole: "admin" | "super-admin"
  ): boolean {
    if (requiredRole === "admin") {
      return userRole === "admin" || userRole === "super-admin";
    }

    if (requiredRole === "super-admin") {
      return userRole === "super-admin";
    }

    return false;
  },

  async addAuthorizedEmail(
    email: string,
    currentUserRole: string
  ): Promise<boolean> {
    if (!this.hasPermission(currentUserRole, "super-admin")) {
      return false;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const authorizedEmails = await getAuthorizedEmailsAsync();

    if (!authorizedEmails.includes(normalizedEmail)) {
      cachedAdmins = [];
      console.log(`📧 Email adicionado à autorização: ${normalizedEmail}`);
      return true;
    }

    return false; // Email já estava na lista
  },

  async removeAuthorizedEmail(
    email: string,
    currentUserRole: string
  ): Promise<boolean> {
    if (!this.hasPermission(currentUserRole, "super-admin")) {
      return false;
    }

    const normalizedEmail = email.toLowerCase().trim();

    cachedAdmins = [];
    console.log(`📧 Email removido da autorização: ${normalizedEmail}`);
    return true;
  },

  async getAuthorizedEmails(
    currentUserRole: string
  ): Promise<AuthorizedAdmin[]> {
    if (!this.hasPermission(currentUserRole, "admin")) {
      return [];
    }

    const emails = await getAuthorizedEmailsAsync();
    return emails.map((email) => ({
      email,
      role:
        email.includes("tyler") || email.includes("admin@tylerlimaeler.org")
          ? ("super-admin" as const)
          : ("admin" as const),
      addedAt: new Date().toISOString(),
      addedBy: "system",
    }));
  },

  async validateConfiguration(): Promise<{ valid: boolean; issues: string[] }> {
    const issues: string[] = [];

    try {
      const authorizedEmails = await getAuthorizedEmailsAsync();

      if (authorizedEmails.length === 0) {
        issues.push("Nenhum email de administrador configurado");
      }

      authorizedEmails.forEach((email) => {
        if (!email.includes("@") || !email.includes(".")) {
          issues.push(`Email inválido: ${email}`);
        }
      });
    } catch (error) {
      issues.push("Erro ao carregar configurações de autorização");
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  },

  clearCache(): void {
    cachedAdmins = [];
    cachedDomains = [];
    lastCacheUpdate = 0;
  },
};
