# 🔥 Como Obter Credenciais Corretas do Firebase

## 🚨 Problema Atual
Você está usando uma chave do **Google Cloud Console** (`GOCSPX-...`) ao invés de uma chave do **Firebase**. Isso causa o popup que fecha imediatamente.

## 📝 Passos Para Corrigir

### **1. Acesse o Firebase Console Correto**
🔗 **[console.firebase.google.com](https://console.firebase.google.com)**

### **2. Selecione ou Crie o Projeto**
- Se já existe: clique no projeto `tyler-dev-c2420` 
- Se não existe: clique em "Adicionar projeto"

### **3. Obter as Credenciais Corretas**

#### 3.1. No Painel do Projeto:
1. Clique no **ícone de engrenagem** ⚙️ (Configurações do projeto)
2. Vá para a aba **"Geral"**
3. Role para baixo até **"Seus aplicativos"**

#### 3.2. Adicionar App Web:
1. Se não há nenhum app, clique no ícone **`</>`** (Web)
2. Nome do app: `Tyler Frontend`
3. **NÃO** marque "Configurar Firebase Hosting" (por enquanto)
4. Clique em **"Registrar app"**

#### 3.3. Copiar as Credenciais:
Você verá algo assim:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC_exemplo_da_chave_real_firebase",
  authDomain: "tyler-dev-c2420.firebaseapp.com",
  projectId: "tyler-dev-c2420",
  storageBucket: "tyler-dev-c2420.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

### **4. Configurar Authentication**

#### 4.1. Ativar Google Auth:
1. No menu lateral: **Authentication**
2. Clique em **"Começar"** (se primeira vez)
3. Aba **"Sign-in method"**
4. Clique em **"Google"**
5. **Ativar** o toggle
6. Email de suporte: `admin@tylerlimaeler.org`
7. **Salvar**

#### 4.2. Configurar Domínios Autorizados:
1. Ainda em **Authentication**
2. Aba **"Settings"** 
3. Seção **"Authorized domains"**
4. Adicionar:
   - `localhost` ✓
   - `tyler-lima-eler.firebaseapp.com` ✓
   - Seu domínio futuro (se houver)

### **5. Atualizar o .env**

Substitua no arquivo `.env`:

```bash
# Firebase Configuration - VALORES REAIS DO FIREBASE CONSOLE
VITE_FIREBASE_API_KEY=AIzaSy...sua_chave_firebase_real_aqui
VITE_FIREBASE_AUTH_DOMAIN=tyler-dev-c2420.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tyler-dev-c2420
VITE_FIREBASE_STORAGE_BUCKET=tyler-dev-c2420.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_numero_real_aqui
VITE_FIREBASE_APP_ID=1:numero:web:seu_id_real_aqui
```

## ✅ Como Saber Se Funcionou

### **Logs no Console:**
Após restart (`npm run dev`), deve aparecer:
```
🔥 Firebase inicializado com sucesso
📡 Usando Firebase Remote Config Manager
```

### **Teste do Login:**
1. Acesse `http://localhost:5173/admin/login`
2. Clique "Continuar com Google"
3. Popup deve permanecer aberto
4. Você consegue escolher conta Google
5. Após login, deve redirecionar para `/admin`

## 🔧 Troubleshooting

### **Popup ainda fecha rapidamente:**
- Verifique se `localhost` está nos domínios autorizados
- Confirme que está usando chave que começa com `AIzaSy...`
- Recarregue a página completamente (Ctrl+F5)

### **Erro "unauthorized-domain":**
- Adicione `localhost` nos domínios autorizados no Firebase
- Espere alguns minutos para propagar

### **Erro "API key not valid":**
- Verifique se copiou a chave completa (muito longa)
- Não deve ter espaços ou quebras de linha

### **Ainda não funciona:**
- Usar modo mock temporariamente:
  ```bash
  # Comente todas as linhas VITE_FIREBASE_*
  # Use login: admin@tyler.com / admin123
  ```

## 📱 Testando Autorização

Após o Google Auth funcionar, teste com:
- Email autorizado: `marllon.nasser@gmail.com` → deve funcionar
- Email não autorizado → deve mostrar modal explicativo

---

**🎯 O problema principal é que `GOCSPX-...` não é uma chave do Firebase!**