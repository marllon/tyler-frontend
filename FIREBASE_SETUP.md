# 🔥 Configuração Firebase - Projeto Tyler

## Passo a Passo para Configurar Firebase

### 1. Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Nome do projeto: `tyler-project` (ou outro nome)
4. Ative Google Analytics (opcional)

### 2. Configurar Authentication

1. No painel lateral: **Authentication** > **Método de login**
2. Ativar **Google**:
   - Clicar em "Google"
   - Ativar o provedor
   - Configurar email de suporte: `admin@tylerlimaeler.org`
   - Salvar
3. **Opcional:** Também ativar **Email/senha** como fallback
4. Em **Usuários**, os admins aparecerão automaticamente após primeiro login Google

### 3. Obter Configurações

1. No painel: **Configurações do projeto** (ícone engrenagem)
2. Na aba **Geral**, descer até **Seus aplicativos**
3. Clicar no ícone **</>** (Web)
4. Nome do app: `tyler-frontend`
5. Copiar as configurações geradas

### 4. Configurar Variáveis de Ambiente

Substituir no arquivo `.env`:

```bash
# Firebase Configuration (SUBSTITUA pelos valores reais)
VITE_FIREBASE_API_KEY=AIzaSyC7K8...
VITE_FIREBASE_AUTH_DOMAIN=tyler-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tyler-project
VITE_FIREBASE_STORAGE_BUCKET=tyler-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

### 5. Regras de Segurança (Opcional)

No **Firestore** (se usar futuramente):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Apenas usuários autenticados podem ler/escrever
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 6. Testar Integração

1. **Iniciar aplicação:**

   ```bash
   npm run dev
   ```

2. **Acessar login admin:**

   ```
   http://localhost:5173/admin/login
   ```

3. **Fazer login:**

   - Clicar em **"Continuar com Google"**
   - Selecionar conta Google do administrador
   - **Ou** usar email/senha se configurado

4. **Verificar console do navegador:**
   - Deve mostrar logs do Firebase
   - Token JWT deve aparecer nas requisições

## 🔐 Funcionamento da Autenticação

### Fluxo de Login

```
1. Usuário insere email/senha
2. Firebase autentica credenciais
3. Firebase retorna JWT token
4. Token armazenado no localStorage
5. Token incluído nas requisições para backend
6. Backend valida token Firebase
```

### Estrutura do Token JWT

```json
{
  "iss": "https://securetoken.google.com/tyler-project",
  "aud": "tyler-project",
  "auth_time": 1636728394,
  "user_id": "abc123...",
  "sub": "abc123...",
  "email": "admin@tylerlimaeler.org",
  "email_verified": true,
  "exp": 1636731994
}
```

### Backend Integration

O backend deve verificar tokens Firebase:

```java
// Spring Boot example
@Component
public class FirebaseAuthService {

    public DecodedIdToken verifyToken(String idToken) {
        return FirebaseAuth.getInstance().verifyIdToken(idToken);
    }
}
```

## 🚨 Segurança

### Boas Práticas Implementadas

- ✅ Token expira automaticamente (1 hora)
- ✅ Refresh automático de token
- ✅ Logout limpa todos os dados
- ✅ Interceptors verificam token em todas requisições
- ✅ Redirecionamento automático se não autenticado

### Configurações de Segurança

```javascript
// Em firebase.ts - já implementado
const firebaseConfig = {
  // Configurações públicas - OK expor
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  // etc...
};
```

## 📱 Funcionalidades Implementadas

### Componentes

- ✅ `Login.vue` - Interface de login
- ✅ `AdminHeader.vue` - Menu com logout
- ✅ `AdminLayout.vue` - Layout protegido

### Services

- ✅ `firebase.ts` - Serviços Firebase
- ✅ `useFirebaseAuth.ts` - Composable de autenticação
- ✅ `auth.ts` - Store Pinia integrada

### Features

- ✅ Login/logout
- ✅ Proteção de rotas
- ✅ Token refresh automático
- ✅ Estado persistente
- ✅ Tratamento de erros

## 🔧 Troubleshooting

### Erro: "Firebase configuration invalid"

**Solução:** Verificar se todas as variáveis VITE*FIREBASE*\* estão definidas no .env

### Erro: "User not found"

**Solução:** Adicionar usuário manualmente no Firebase Console > Authentication > Users

### Erro: "Invalid token"

**Solução:** Verificar se projeto Firebase está ativo e configurações estão corretas

### Token não incluído nas requisições

**Solução:** Verificar se usuário está logado e localStorage tem 'admin_token'

---

**🎉 Com essas configurações, a autenticação Firebase estará 100% funcional!**
