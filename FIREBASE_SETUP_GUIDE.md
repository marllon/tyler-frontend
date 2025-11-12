# 🔥 Configuração do Firebase - Instruções

## 📋 Passos para Configurar Firebase

### **1. Criar Projeto no Firebase**

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique em "Criar projeto"
3. Nome do projeto: `Tyler Lima Eler` (ou o nome que preferir)
4. Ative o Google Analytics (opcional)

### **2. Configurar Authentication**

1. No console do Firebase, vá para **Authentication**
2. Clique em **Começar**
3. Na aba **Sign-in method**, ative:
   - **Google** (necessário para OAuth)
   - **Email/senha** (opcional, para backup)

### **3. Configurar Domínios Autorizados**

Na seção **Authentication → Settings → Authorized domains**, adicione:

- `localhost` (para desenvolvimento)
- Seu domínio de produção (ex: `tylerlimaeler.org`)

### **4. Obter Credenciais**

1. Vá para **Configurações do projeto** (ícone de engrenagem)
2. Na aba **Geral**, role até **Seus aplicativos**
3. Clique em **Adicionar app** → **Web** (ícone `</>`)
4. Nome do app: `Tyler Frontend`
5. Copie as credenciais geradas

### **5. Configurar .env**

Descomente e configure as variáveis no arquivo `.env`:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyD...sua_chave_completa_aqui
VITE_FIREBASE_AUTH_DOMAIN=tyler-lima-eler.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tyler-lima-eler
VITE_FIREBASE_STORAGE_BUCKET=tyler-lima-eler.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456ghi789

# Emails autorizados para acessar admin
VITE_AUTHORIZED_ADMINS=seu-email@gmail.com,admin@tylerlimaeler.org
VITE_AUTHORIZED_DOMAINS=gmail.com,tylerlimaeler.org
```

### **6. Configurar Remote Config (Opcional)**

1. No Firebase Console, vá para **Remote Config**
2. Clique em **Criar configuração**
3. Adicione os parâmetros:

**Emails Autorizados:**

- Nome: `authorized_admins`
- Valor: `admin@tylerlimaeler.org,seu-email@gmail.com`

**Domínios Autorizados:**

- Nome: `authorized_domains`
- Valor: `gmail.com,tylerlimaeler.org`

### **7. Testar Configuração**

1. Restart o servidor de desenvolvimento: `npm run dev`
2. Acesse `http://localhost:5173/admin/login`
3. Clique em "Continuar com Google"
4. Faça login com um email autorizado

## 🔐 Segurança

### **Rules do Firestore (se usar)**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Apenas admins autenticados podem ler configurações
    match /settings/{document} {
      allow read: if request.auth != null &&
                     resource.data.authorizedEmails[request.auth.token.email] != null;
      allow write: if request.auth != null &&
                      resource.data.authorizedEmails[request.auth.token.email].role == 'super-admin';
    }
  }
}
```

## 🚀 Modo de Desenvolvimento

Se não configurar Firebase, o sistema funciona em **modo mock**:

- Login: `admin@tyler.com` / `admin123`
- Todos os recursos funcionam normalmente
- Dados são armazenados localmente

## ❗ Troubleshooting

**Erro "API key not valid":**

- Verifique se a chave está completa no .env
- Confirme se o projeto está ativo no Firebase
- Verifique se o domínio está autorizado

**Erro "unauthorized-domain":**

- Adicione `localhost` nos domínios autorizados
- Para produção, adicione seu domínio real

**Modal "não autorizado":**

- Adicione seu email em `VITE_AUTHORIZED_ADMINS`
- Ou configure via Remote Config no Firebase

## 📱 Interface Admin

Após configurado, acesse `/admin/security` para:

- Ver status da autenticação
- Gerenciar emails autorizados
- Verificar configurações do Firebase
