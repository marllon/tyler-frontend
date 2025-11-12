# Configuração de Variáveis de Ambiente no Firebase

## 📋 Visão Geral

Este documento explica como configurar emails autorizados e outras variáveis no Firebase para o projeto Tyler.

## 🔧 Opção 1: Firebase Remote Config (Recomendado)

O Firebase Remote Config permite gerenciar configurações em tempo real sem necessidade de rebuild.

### **1. Configurar no Firebase Console**

1. Acesse o [Firebase Console](https://console.firebase.google.com)
2. Selecione seu projeto Tyler
3. Vá em **Remote Config** no menu lateral
4. Clique em **Criar configuração**

### **2. Criar Parâmetros**

**Emails Autorizados:**

- **Nome do parâmetro:** `authorized_admins`
- **Valor padrão:** `admin@tyler.com,manager@tyler.com`
- **Descrição:** Lista de emails autorizados para acessar o painel admin

**Domínios Autorizados:**

- **Nome do parâmetro:** `authorized_domains`
- **Valor padrão:** `gmail.com,hotmail.com`
- **Descrição:** Domínios de email permitidos

**Configurações PIX:**

- **Nome do parâmetro:** `pix_settings`
- **Valor padrão:** `{"environment":"sandbox","minAmount":1.00,"maxAmount":10000.00}`
- **Descrição:** Configurações do sistema PIX

### **3. Implementação no Frontend**

```typescript
// src/utils/remoteConfig.ts
import {
  getRemoteConfig,
  fetchAndActivate,
  getValue,
} from "firebase/remote-config";
import { app } from "./firebase";

const remoteConfig = getRemoteConfig(app);

// Configurações padrão
remoteConfig.defaultConfig = {
  authorized_admins: "admin@tyler.com",
  authorized_domains: "gmail.com,hotmail.com",
  pix_settings:
    '{"environment":"sandbox","minAmount":1.00,"maxAmount":10000.00}',
};

export async function initRemoteConfig() {
  try {
    await fetchAndActivate(remoteConfig);
    console.log("🔧 Remote Config ativado com sucesso");
  } catch (error) {
    console.warn(
      "⚠️ Erro ao carregar Remote Config, usando valores padrão:",
      error
    );
  }
}

export function getAuthorizedAdmins(): string[] {
  const value = getValue(remoteConfig, "authorized_admins").asString();
  return value
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

export function getAuthorizedDomains(): string[] {
  const value = getValue(remoteConfig, "authorized_domains").asString();
  return value
    .split(",")
    .map((domain) => domain.trim())
    .filter(Boolean);
}

export function getPixSettings() {
  const value = getValue(remoteConfig, "pix_settings").asString();
  try {
    return JSON.parse(value);
  } catch {
    return {
      environment: "sandbox",
      minAmount: 1.0,
      maxAmount: 10000.0,
    };
  }
}
```

## 🔧 Opção 2: Firebase Functions Environment Variables

Para configurações mais sensíveis, use Firebase Functions com variáveis de ambiente.

### **1. Instalar Firebase CLI**

```bash
npm install -g firebase-tools
firebase login
```

### **2. Configurar Variáveis**

```bash
# No diretório do seu projeto
firebase functions:config:set tyler.authorized_admins="admin@tyler.com,manager@tyler.com"
firebase functions:config:set tyler.authorized_domains="gmail.com,hotmail.com"
firebase functions:config:set tyler.pix_environment="sandbox"
firebase functions:config:set tyler.pix_key="sua_chave_pix_aqui"
```

### **3. Criar Function para Validação**

```javascript
// functions/src/index.js
const { onCall } = require("firebase-functions/v2/https");
const { defineString } = require("firebase-functions/params");

// Parâmetros de ambiente
const authorizedAdmins = defineString("AUTHORIZED_ADMINS", {
  default: "admin@tyler.com",
});
const authorizedDomains = defineString("AUTHORIZED_DOMAINS", {
  default: "gmail.com",
});

exports.checkAuthorization = onCall((request) => {
  const { email } = request.data;

  if (!email) {
    throw new Error("Email é obrigatório");
  }

  const admins = authorizedAdmins
    .value()
    .split(",")
    .map((e) => e.trim());
  const domains = authorizedDomains
    .value()
    .split(",")
    .map((d) => d.trim());
  const emailDomain = email.split("@")[1];

  const isAuthorizedAdmin = admins.includes(email);
  const isAuthorizedDomain = domains.includes(emailDomain);

  return {
    authorized: isAuthorizedAdmin || isAuthorizedDomain,
    role: isAuthorizedAdmin ? "admin" : "user",
    reason:
      !isAuthorizedAdmin && !isAuthorizedDomain
        ? "Email ou domínio não autorizado"
        : null,
  };
});
```

### **4. Chamar do Frontend**

```typescript
// src/utils/firebaseAuth.ts
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "./firebase";

const functions = getFunctions(app);
const checkAuthorization = httpsCallable(functions, "checkAuthorization");

export async function validateEmailAuthorization(email: string) {
  try {
    const result = await checkAuthorization({ email });
    return result.data;
  } catch (error) {
    console.error("Erro ao validar autorização:", error);
    return {
      authorized: false,
      reason: "Erro ao verificar autorização",
    };
  }
}
```

## 🔧 Opção 3: Firestore Database (Mais Flexível)

Use o Firestore para gerenciar autorizações de forma dinâmica.

### **1. Estrutura de Dados**

```javascript
// Coleção: settings
// Documento: authorization
{
  "authorizedEmails": [
    {
      "email": "admin@tyler.com",
      "role": "super-admin",
      "addedAt": "2024-11-11T22:00:00Z",
      "addedBy": "system"
    },
    {
      "email": "manager@tyler.com",
      "role": "admin",
      "addedAt": "2024-11-11T22:00:00Z",
      "addedBy": "admin@tyler.com"
    }
  ],
  "authorizedDomains": ["gmail.com", "hotmail.com"],
  "updatedAt": "2024-11-11T22:00:00Z"
}
```

### **2. Implementação**

```typescript
// src/utils/firestoreAuth.ts
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "./firebase";

const SETTINGS_DOC = "settings/authorization";

export async function getAuthorizedEmails() {
  try {
    const docRef = doc(db, SETTINGS_DOC);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().authorizedEmails || [];
    }

    return [];
  } catch (error) {
    console.error("Erro ao buscar emails autorizados:", error);
    return [];
  }
}

export async function addAuthorizedEmail(
  email: string,
  role: string = "admin"
) {
  try {
    const docRef = doc(db, SETTINGS_DOC);

    await updateDoc(docRef, {
      authorizedEmails: arrayUnion({
        email,
        role,
        addedAt: new Date().toISOString(),
        addedBy: "admin", // pegar do contexto atual
      }),
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao adicionar email:", error);
    return { success: false, error: error.message };
  }
}

export async function removeAuthorizedEmail(email: string) {
  try {
    const emails = await getAuthorizedEmails();
    const emailToRemove = emails.find((e) => e.email === email);

    if (emailToRemove) {
      const docRef = doc(db, SETTINGS_DOC);
      await updateDoc(docRef, {
        authorizedEmails: arrayRemove(emailToRemove),
        updatedAt: new Date().toISOString(),
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Erro ao remover email:", error);
    return { success: false, error: error.message };
  }
}
```

## ⚙️ Configuração Híbrida (Recomendação Final)

Para máxima flexibilidade, use uma abordagem híbrida:

1. **Environment Variables (.env)** - Configurações básicas de desenvolvimento
2. **Firebase Remote Config** - Configurações que podem mudar sem rebuild
3. **Firestore** - Dados dinâmicos como lista de administradores

### **Ordem de Prioridade:**

1. Firestore (tempo real, mais flexível)
2. Remote Config (mudanças sem rebuild)
3. Environment Variables (fallback)
4. Hardcoded defaults (último recurso)

```typescript
// src/utils/configManager.ts
export async function getAuthorizedEmails(): Promise<string[]> {
  try {
    // 1. Tentar Firestore primeiro
    const firestoreEmails = await getFirestoreAuthorizedEmails();
    if (firestoreEmails.length > 0) return firestoreEmails;

    // 2. Remote Config como backup
    const remoteEmails = getRemoteConfigAuthorizedEmails();
    if (remoteEmails.length > 0) return remoteEmails;

    // 3. Environment variables
    const envEmails = import.meta.env.VITE_AUTHORIZED_ADMINS?.split(",") || [];
    if (envEmails.length > 0) return envEmails;

    // 4. Default fallback
    return ["admin@tyler.com"];
  } catch (error) {
    console.error("Erro ao buscar emails autorizados:", error);
    return ["admin@tyler.com"];
  }
}
```

## 🔐 Segurança

- **Nunca** exponha chaves sensíveis no frontend
- Use Firebase Security Rules para proteger dados no Firestore
- Valide sempre no backend (Firebase Functions)
- Implemente logs de auditoria para mudanças de autorização

## 📱 Interface de Gerenciamento

O componente `AdminAuthorizationManager.vue` já criado pode ser estendido para usar qualquer uma dessas abordagens, oferecendo uma interface visual para gerenciar autorizações em tempo real.
