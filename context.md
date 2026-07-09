# Context.md - Plataforma de Controle de Grãos (TraderAgri MVP)

## 1. Contexto de Negócio

### 1.1 A Empresa
**Soyama Control** (nome fictício para o projeto) é uma empresa trader de agronegócio que atua na compra, venda, armazenagem e logística de grãos (soja, milho, trigo, arroz). A empresa opera com fornecedores rurais, cooperativas, indústrias de processamento e exportadores.

### 1.2 Problema Identificado
A empresa enfrenta dificuldades em:
- **Controle de estoque manual** em planilhas e sistemas legados
- **Falta de visibilidade** em tempo real das quantidades de grãos armazenados
- **Processos manuais** de registro de entradas e saídas susceptíveis a erros
- **Ausência de rastreabilidade** da origem e qualidade dos lotes
- **Dificuldade na tomada de decisão** por falta de dashboards e relatórios consolidados

### 1.3 Solução Proposta
Plataforma digital PWA para controle completo de grãos, desde a captura na fazenda até a entrega ao destino final.

---

## 2. MVP (Minimum Viable Product)

### 2.1 Escopo do MVP
O MVP resolverá o problema principal: **controle de estoque de grãos em tempo real com registro de entradas e saídas**.

#### Funcionalidades MVP:
1. **Cadastro de Grãos**
   - Tipos de grãos (soja, milho, trigo, arroz, cevada, sorgo, etc.)
   - Unidade de medida (kg, sc, tonnes, bushels)

2. **Cadastro de Unidades de Armazenagem**
   - Armazéns, silos, secadores, pátios
   - Capacidade máxima de cada unidade

3. **Controle de Estoque**
   - Registro de entradas (comprado de fornecedores)
   - Registro de saídas (vendido para clientes)
   - Transferências entre unidades de armazenagem
   - Saldo em tempo real por unidade e total

4. **Dashboard Principal**
   - Total de estoque por tipo de grão
   - Últimas movimentações
   - Indicadores básicos (valor total estimado)

5. **Cadastro Básico**
   - Fornecedores (origem dos grãos)
   - Clientes (destino dos grãos)

### 2.2 Arquitetura Técnica do MVP

```
┌─────────────────────────────────────────────────────────────┐
│                        PWA (Frontend)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │   Login     │  │  Dashboard  │  │  Movimentações      │   │
│  │   Page      │  │  Page       │  │  Page               │   │
│  └─────────────┘  └─────────────┘  └─────────────────────┘   │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │   Cadastro  │  │   Estoque   │  │  Configurações      │   │
│  │   Grãos     │  │  Page       │  │  Page               │   │
│  └─────────────┘  └─────────────┘  └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Firebase Backend                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │ Auth        │  │ Firestore   │  │ Storage             │   │
│  │ (Firebase   │  │ (Database)  │  │ (Files/Images)      │   │
│  │ Auth)       │  │             │  │                     │   │
│  └─────────────┘  └─────────────┘  └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Stack Tecnológica MVP

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | React + TypeScript + Vite |
| **PWA** | Workbox + Service Worker |
| **UI Framework** | TailwindCSS + shadcn/ui |
| **Estado** | Zustand |
| **Backend** | Firebase (Auth + Firestore) |
| **Hospedagem** | Firebase Hosting |

### 2.4 Modelo de Dados MVP

```
Collections Firestore:

├── users/
│   └── {userId}
│       ├── email: string
│       ├── name: string
│       └── role: "admin" | "operator"
│
├── grains/
│   └── {grainId}
│       ├── name: string (ex: "Soja", "Milho")
│       ├── unit: string (ex: "kg", "sc", "tonnes")
│       └── createdAt: timestamp
│
├── warehouses/
│   └── {warehouseId}
│       ├── name: string
│       ├── location: string
│       ├── capacity: number
│       └── createdAt: timestamp
│
├── movements/
│   └── {movementId}
│       ├── type: "entry" | "exit" | "transfer"
│       ├── grainId: ref
│       ├── warehouseId: ref
│       ├── quantity: number
│       ├── supplierId?: ref (para entries)
│       ├── clientId?: ref (para exits)
│       ├── notes: string
│       ├── createdAt: timestamp
│       └── createdBy: userId
│
├── suppliers/
│   └── {supplierId}
│       ├── name: string
│       ├── document: string (CPF/CNPJ)
│       └── contact: string
│
├── clients/
│   └── {clientId}
│       ├── name: string
│       ├── document: string (CPF/CNPJ)
│       └── contact: string
│
└── stock/
    └── {stockId}
        ├── grainId: ref
        ├── warehouseId: ref
        ├── quantity: number
        └── lastUpdated: timestamp
```

---

## 3. Produto Final (Versão Completa)

### 3.1 Escopo Expandido

O produto final adiciona módulos completos para operações de trading:

#### Módulos do Produto Final:

1. **Módulo de Contratos**
   - Cadastro de contratos de compra/venda
   - Acompanhamento de entregas
   - Preços fechados e a fixar
   - Hedging e proteção de preços

2. **Módulo de Qualidade**
   - Registro de análise de qualidade (umidade, impurezas, avarias)
   - Laudos técnicos
   - Padrões de classificação

3. **Módulo de Logística**
   - Planejamento de fretes
   - Rastreamento de veículos
   - Controle de romaneios

4. **Módulo Financeiro**
   - Contas a pagar/receber
   - Fluxo de caixa
   - Conciliação bancária

5. **Módulo de Comercialização**
   - Integração com preços de mercado (B3/CBOT)
   - Calcúlo de Mark-to-Market
   - P&L por posição

6. **Módulo de Relatórios**
   - Relatórios customizáveis
   - Exportação em PDF/Excel
   - Business Intelligence

7. **Módulo de Integrações**
   - Integração com sistemas ERP
   - API REST para terceiros
   - Webhooks para notificações

8. **Módulo de Commodities Trading**
   - Posições de compra e venda
   - Contrapartidas (contratos)
   - Liquidação física e financeira

### 3.2 Arquitetura do Produto Final

```
┌──────────────────────────────────────────────────────────────────────────┐
│                              PWA / App Mobile                              │
├──────────────────────────────────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │Dashboard│ │ Estoque │ │Contratos│ │Qualidade│ │Logística│ │Financeiro│ │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │Comerc.  │ │Relatórios│ │Usuários │ │Config  │ │Integrações│             │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                           API Gateway / BFF                                │
│                         (Node.js + Express)                               │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│  PostgreSQL   │         │    Redis      │         │    RabbitMQ   │
│  (Primary DB)  │         │   (Cache)     │         │   (Message    │
│               │         │               │         │    Queue)     │
└───────────────┘         └───────────────┘         └───────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                           Serviços Microserviços                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│  │ User    │  │ Stock   │  │Contract │  │ Quality │  │ Finance │       │
│  │ Service │  │ Service │  │ Service │  │ Service │  │ Service │       │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘       │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐                     │
│  │ Logistics│ │Trading  │  │ Report  │  │ Notif.  │                     │
│  │ Service │  │ Service │  │ Service │  │ Service │                     │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘                     │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                        External Integrations                               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐                      │
│  │B3/CBOT  │  │Sisbol   │  │ERP      │  │Banks    │                      │
│  │(Prices) │  │(Bacen)  │  │SAP/TSi │  │(PIX/TEF)│                      │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘                      │
└──────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Stack Tecnológica Produto Final

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | React + TypeScript + Vite (PWA) |
| **Mobile** | React Native (futuro) |
| **PWA** | Workbox + Service Worker |
| **UI Framework** | TailwindCSS + shadcn/ui |
| **Estado Global** | Zustand + TanStack Query |
| **API Gateway** | Node.js + Express + TypeScript |
| **Backend** | Node.js Microservices ou NestJS |
| **API REST** | Prisma ORM |
| **Primary DB** | PostgreSQL |
| **Cache** | Redis |
| **Message Queue** | RabbitMQ |
| **Hospedagem** | AWS / Vercel / Azure |
| **CI/CD** | GitHub Actions |
| **Monitoramento** | Datadog / Grafana |

### 3.4 Modelo de Dados Produto Final

```
PostgreSQL Schema:

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    users        │     │    suppliers    │     │    clients      │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │     │ id (PK)         │
│ email           │     │ name            │     │ name            │
│ password_hash   │     │ document        │     │ document        │
│ name            │     │ type (PF/PJ)   │     │ type (PF/PJ)    │
│ role            │     │ address         │     │ address         │
│ created_at      │     │ contact         │     │ contact         │
│ updated_at      │     │ created_at      │     │ created_at      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                      │                       │
         │                      │                       │
         ▼                      ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   warehouses    │     │     grains      │     │   contracts     │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │     │ id (PK)         │
│ name            │     │ name            │     │ contract_number │
│ location        │     │ symbol           │     │ type            │
│ type            │     │ unit            │     │ (purchase/sale) │
│ capacity        │     │ created_at      │     │ supplier_id(FK) │
│ is_active       │     └─────────────────┘     │ client_id(FK)   │
│ created_at      │                             │ grain_id(FK)    │
└─────────────────┘                             │ quantity        │
                                                 │ price           │
┌─────────────────┐                             │ delivery_date   │
│    movements    │                             │ status          │
├─────────────────┤                             │ created_at      │
│ id (PK)         │                             └─────────────────┘
│ type            │                                   │
│ (entry/exit/    │                                   │
│  transfer)      │                                   ▼
│ grain_id (FK)   │                             ┌─────────────────┐
│ warehouse_id(FK)│                             │  quality_tests  │
│ quantity        │                             ├─────────────────┤
│ contract_id(FK) │                             │ id (PK)         │
│ notes           │                             │ movement_id(FK) │
│ created_by (FK) │                             │ humidity        │
│ created_at      │                             │ impurity        │
└─────────────────┘                             │ damage          │
                                                 │ weight          │
┌─────────────────┐                             │ inspector       │
│     stock       │                             │ result_date     │
├─────────────────┤                             └─────────────────┘
│ id (PK)         │
│ grain_id (FK)   │
│ warehouse_id(FK)│
│ quantity        │
│ updated_at      │
└─────────────────┘
```

---

## 4. Comparativo: MVP vs Produto Final

| Aspecto | MVP | Produto Final |
|--------|-----|--------------|
| **Foco** | Controle de estoque | Trading completo |
| **Usuários** | 5-10 operadores | Ilimitado |
| **Backend** | Firebase (BaaS) | Microserviços |
| **Database** | Firestore | PostgreSQL + Redis |
| **Tempo de dev** | 4-6 semanas | 6-12 meses |
| **Custo inicial** | Baixo (Firebase) | Alto (infraestrutura) |
| **Escalabilidade** | Limitada | Alta |
| **Complexidade** | Simples | Enterprise |
| **Módulos** | 4 principais | 8+ módulos |
| **Integrações** | Nenhuma | Múltiplas |
| **Mobile** | PWA responsivo | PWA + App Native |

---

## 5. ROI Esperado

### Economia com MVP:
- Redução de 70% em erros de estoque
- Tempo economizado: 4h/dia em processos manuais
- Retorno em 3 meses

### Economia Produto Final:
- Automação completa de trading
- Redução de 90% em erros
- Integração em tempo real com mercados
- Decisões baseadas em dados em tempo real
