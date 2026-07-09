# Soyama Control - PWA de Controle de Grãos

## Requisitos

- Node.js 18+
- npm ou yarn
- Conta Firebase para autenticação e Firestore

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure o Firebase:
- Crie um projeto no [Firebase Console](https://console.firebase.google.com)
- Ative Authentication (Email/Password)
- Ative Firestore Database
- Copie as credenciais para `.env`:
```bash
cp .env.example .env
```

4. Preencha o arquivo `.env` com suas credenciais do Firebase

5. Configure o Firestore com as seguintes collections e campos:

### Collections Firestore

**users/{userId}**
- email: string
- name: string
- role: "admin" | "operator"

**grains/{grainId}**
- name: string
- unit: "kg" | "sc" | "tonnes" | "bushels"
- createdAt: timestamp

**warehouses/{warehouseId}**
- name: string
- location: string
- capacity: number
- createdAt: timestamp

**suppliers/{supplierId}**
- name: string
- document: string
- contact: string
- createdAt: timestamp

**clients/{clientId}**
- name: string
- document: string
- contact: string
- createdAt: timestamp

**movements/{movementId}**
- type: "entry" | "exit" | "transfer"
- grainId: string
- warehouseId: string
- toWarehouseId: string (para transfer)
- quantity: number
- supplierId: string (para entry)
- clientId: string (para exit)
- notes: string
- createdAt: timestamp
- createdBy: string

**stock/{stockId}**
- grainId: string
- warehouseId: string
- quantity: number
- lastUpdated: timestamp

6. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build para produção |
| `npm run preview` | Preview do build |
| `npm run lint` | Executa linter |

## Stack Tecnológica

- **Framework:** React 18 + TypeScript + Vite
- **PWA:** VitePWA (Workbox)
- **Estilização:** TailwindCSS
- **Estado:** Zustand
- **Backend:** Firebase (Auth + Firestore)
- **Roteamento:** React Router 6
- **Query:** TanStack Query

## Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── pages/          # Páginas da aplicação
├── store/          # Estado global (Zustand)
├── lib/            # Configurações (Firebase)
├── types/          # Tipos TypeScript
└── hooks/          # Custom hooks
```

## Funcionalidades MVP

- [x] Autenticação de usuários
- [x] Dashboard com KPIs
- [x] Cadastro de grãos
- [x] Cadastro de armazéns
- [x] Cadastro de fornecedores
- [x] Cadastro de clientes
- [x] Movimentações (entrada, saída, transferência)
- [x] Controle de estoque
- [x] PWA instalável
- [x] Funciona offline (cache)
