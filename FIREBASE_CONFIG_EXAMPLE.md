# 🔥 Firebase Remote Config - Exemplo de Configuração

## 📋 Parâmetros para Configurar no Firebase Console

Acesse [Firebase Console](https://console.firebase.google.com) → Seu Projeto → **Remote Config**

### **1. Emails Autorizados**

**Nome do parâmetro:** `authorized_admins`  
**Valor padrão:**

```
admin@tylerlimaeler.org,tyler@gmail.com,admin@gmail.com
```

**Descrição:** Lista de emails autorizados para acessar o painel administrativo (separados por vírgula)

### **2. Domínios Autorizados**

**Nome do parâmetro:** `authorized_domains`  
**Valor padrão:**

```
gmail.com,hotmail.com,outlook.com
```

**Descrição:** Domínios de email permitidos para acesso (separados por vírgula)

### **3. Configurações PIX**

**Nome do parâmetro:** `pix_settings`  
**Valor padrão:**

```json
{
  "environment": "sandbox",
  "minAmount": 1.0,
  "maxAmount": 10000.0,
  "pixKey": "sua_chave_pix_aqui"
}
```

**Descrição:** Configurações do sistema de pagamento PIX

## 🎯 Como Funciona

1. **Ordem de Prioridade:**

   - Firestore (mais dinâmico)
   - Firebase Remote Config
   - Variáveis de ambiente (.env)
   - Valores hardcoded (fallback)

2. **Cache Local:** 5 minutos para melhor performance

3. **Fallback Automático:** Se Firebase falhar, usa valores locais

## 🚀 Ativação

Após configurar no Firebase Console:

1. Clique em **"Publicar alterações"**
2. O frontend irá buscar as novas configurações automaticamente
3. Cache será atualizado em até 5 minutos

## 🔐 Segurança

- Emails são sempre normalizados (lowercase, trim)
- Validação de formato de email
- Super-admin pode gerenciar lista
- Logs de auditoria para mudanças

## 📱 Interface

Use o painel **Admin → Segurança** para:

- Visualizar emails autorizados
- Adicionar novos emails (super-admin)
- Remover emails existentes (super-admin)
- Ver status das configurações

## 🛠️ Desenvolvimento

Para desenvolvimento local, configure no `.env`:

```bash
VITE_AUTHORIZED_ADMINS=admin@gmail.com,teste@gmail.com
VITE_AUTHORIZED_DOMAINS=gmail.com,hotmail.com
```
