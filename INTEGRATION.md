# Tyler Frontend - Integração com Backend

Este documento descreve como a aplicação frontend Tyler foi integrada com a API backend.

## 🚀 Estado da Integração

### ✅ **Implementado e Testável**

1. **Configuração da API**
   - Cliente HTTP centralizado (`/src/utils/api.ts`)
   - Interceptors para autenticação e tratamento de erros
   - Configuração de ambiente para dev/prod

2. **Sistema de Pagamentos PIX**
   - Service para criar checkout PIX (`/src/utils/services.ts`)
   - Polling automático de status de pagamento
   - Componente modal completo (`/src/components/PixPaymentModal.vue`)

3. **Sistema de Doações**
   - Composable `useDonations` para lógica de negócio
   - Validação de formulários
   - Integração com metas de arrecadação

4. **Stores Atualizadas**
   - Goals store integrada com API
   - Suporte a dados dummy para desenvolvimento
   - Computed properties para goals ativas/completas

5. **Página de Teste**
   - Interface completa para testar doações (`/views/TestDonation.vue`)
   - Health check da API
   - Formulário com validação

## 🔧 **Configuração**

### Variáveis de Ambiente

```bash
# .env (desenvolvimento)
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Tyler Frontend
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=development
VITE_PIX_TIMEOUT=300000
VITE_PIX_POLL_INTERVAL=5000
```

```bash
# .env.production
VITE_API_BASE_URL=https://tyler-api.herokuapp.com/api
VITE_NODE_ENV=production
# ... outras variáveis
```

## 🧪 **Como Testar a Integração**

### 1. Verificar Conectividade
```bash
# Iniciar o frontend
npm run dev

# Acessar página de teste
http://localhost:5173/test-donation
```

### 2. Health Check
A página de teste inclui um botão "Verificar" que testa a conectividade com:
```
GET http://localhost:8080/api/health
```

### 3. Teste de Doação PIX
1. Preencher formulário de doação
2. Clicar em "Doar com PIX"
3. Modal abrirá com QR Code
4. Sistema fará polling automático do status

### 4. Estados de Dados

O sistema suporta dois modos:

**Modo Dummy (padrão para desenvolvimento):**
```typescript
const goalsStore = useGoalsStore();
goalsStore.useDummyData = true; // Usar dados locais
```

**Modo API (quando backend estiver ativo):**
```typescript
const goalsStore = useGoalsStore();
goalsStore.useDummyData = false; // Usar API real
```

## 📁 **Estrutura de Arquivos Criados/Modificados**

```
src/
├── components/
│   └── PixPaymentModal.vue          # Modal para pagamentos PIX
├── composables/
│   ├── useDonations.ts              # Lógica de doações
│   └── index.ts                     # Exports atualizados
├── stores/
│   └── goals.ts                     # Store integrada com API
├── types/
│   └── index.ts                     # Types da API backend
├── utils/
│   ├── api.ts                       # Cliente HTTP atualizado
│   └── services.ts                  # Services específicos
├── views/
│   └── TestDonation.vue             # Página de teste
└── router/
    └── index.ts                     # Rota de teste adicionada

# Arquivos de configuração
.env                                 # Variáveis de ambiente
.env.production                      # Variáveis de produção
```

## 🔗 **APIs Integradas**

### Health Check
```typescript
import { healthService } from '@/utils/services';

const health = await healthService.checkHealth();
// Retorna: { status, message, timestamp, version }
```

### PIX Payments
```typescript
import { paymentService } from '@/utils/services';

// Criar checkout
const pixData = await paymentService.createPixCheckout({
  amount: 1000, // R$ 10,00 em centavos
  description: "Doação para meta X",
  payer: {
    name: "João Silva",
    email: "joao@example.com",
    document: "11144477735"
  }
});

// Verificar status
const status = await paymentService.getPaymentStatus(pixData.id);
```

### Goals (Metas)
```typescript
import { useGoalsStore } from '@/stores/goals';

const goalsStore = useGoalsStore();

// Buscar metas ativas
await goalsStore.fetchGoals({ active: true });

// Acessar metas
console.log(goalsStore.activeGoals);
console.log(goalsStore.completedGoals);

// Atualizar progresso (quando pagamento confirmado)
goalsStore.updateGoalProgress(goalId, 1000); // +R$ 10,00
```

## 🎯 **Fluxo de Doação Completo**

```typescript
// 1. Usuário preenche formulário
const donationData = {
  amount: 1000, // R$ 10,00 em centavos
  goalId: "meta_123",
  anonymous: false,
  message: "Boa sorte!",
  donor: {
    name: "João Silva",
    email: "joao@example.com",
    document: "11144477735"
  }
};

// 2. Criar PIX via service
const pixResponse = await paymentService.createPixCheckout({
  amount: donationData.amount,
  description: `Doação: ${donationData.message}`,
  payer: donationData.donor
});

// 3. Exibir QR Code e polling automático
paymentService.pollPaymentStatus(
  pixResponse.id,
  (status) => console.log('Status:', status),
  60, // máximo 5 minutos
  5000 // verificar a cada 5s
).then((finalStatus) => {
  if (finalStatus.status === 'PAID') {
    // 4. Atualizar meta
    goalsStore.updateGoalProgress(donationData.goalId, donationData.amount);
    showToast('Doação confirmada!', 'success');
  }
});
```

## 🚧 **Próximos Passos**

### Quando Backend Estiver Totalmente Ativo:

1. **Alterar modo de dados:**
```typescript
// Em stores/goals.ts ou via configuração
goalsStore.useDummyData = false;
```

2. **Implementar outras APIs:**
- Products (`/api/products`)
- Orders (`/api/orders/checkout`)  
- Raffles (`/api/raffles`)
- Events (`/api/events`)
- Admin Dashboard (`/api/admin/*`)

3. **Adicionar autenticação Firebase:**
```typescript
// Interceptor já preparado em api.ts
const token = await firebase.auth().currentUser?.getIdToken();
// Token será incluído automaticamente nos headers
```

## 🛠️ **Utilitários Disponíveis**

### Composables
```typescript
import { 
  useDonations,     // Lógica de doações
  useCurrency,      // Formatação de moeda
  useToast,         // Notificações
  useLoading        // Estados de loading
} from '@/composables';
```

### Services
```typescript
import { 
  healthService,    // Health check
  paymentService    // PIX payments
} from '@/utils/services';
```

### Stores
```typescript
import { 
  useGoalsStore,    // Metas integradas
  useAuthStore,     // Autenticação
  useProductsStore, // Produtos (a integrar)
  useRafflesStore,  // Rifas (a integrar)
  useEventsStore    // Eventos (a integrar)
} from '@/stores';
```

## 🐛 **Debug e Logging**

Em modo desenvolvimento, todas as requisições são logadas no console:
```
🚀 GET /health
✅ GET /health { status: "healthy", ... }

🚀 POST /payments/checkout
✅ POST /payments/checkout { id: "ORDE_123", ... }

❌ GET /goals Error: API not ready
```

## 🔐 **Autenticação Firebase Implementada**

Sistema completo de autenticação integrado:

### ✅ **Implementado:**
- **🔥 Firebase Authentication** - Serviço completo configurado
- **🔒 Login/Logout** - Interface e lógica implementadas  
- **🛡️ Proteção de rotas** - Guard automático para `/admin/*`
- **🔄 Auto-refresh tokens** - Renovação automática de JWT
- **📱 Estado persistente** - Mantém login entre sessões
- **🚪 Interceptors** - Token incluído em todas as requisições

### 🔧 **Como configurar:**
1. **Criar projeto Firebase** (ver `FIREBASE_SETUP.md`)
2. **Configurar variáveis de ambiente:**
```bash
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
# etc...
```
3. **Adicionar usuários admin** no Firebase Console
4. **Acessar:** `http://localhost:5173/admin/login`

### 🎯 **Fluxo completo:**
```typescript
// Login automático
const { signIn } = useFirebaseAuth();
await signIn('admin@tyler.com', 'senha');

// Token incluído automaticamente
const response = await api.get('/admin/dashboard');
// Header: Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
```

---

**🎉 A integração está completa e pronta para uso!** 

Acesse `/test-donation` para testar o sistema completo de doações PIX.