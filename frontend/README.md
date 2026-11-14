# Taskfy — Frontend (LDW · AT2)

SPA em **React + TypeScript** com **shadcn/ui** e **Tailwind CSS**, consumindo a API REST do Taskfy (AT1) com CRUD completo de **tarefas** e **categorias**.

## 🛠️ Tecnologias

| Categoria        | Tecnologia                                              |
| ---------------- | ------------------------------------------------------- |
| Build / SPA      | Vite, React 19, React Router DOM                        |
| Linguagem        | TypeScript (modo `strict`)                              |
| UI               | shadcn/ui (Radix UI), Tailwind CSS v4, lucide-react     |
| Notificações     | Sonner (toasts)                                         |
| Cliente HTTP     | `fetch` nativo, encapsulado em `src/lib/api.ts`         |
| Gerenciador      | pnpm                                                    |

## 📁 Estrutura

```text
frontend/
├── .env.example              # Modelo das variáveis de ambiente (versionado)
├── components.json           # Configuração do shadcn/ui
├── vite.config.ts            # Plugins + alias "@" -> src/
├── tsconfig.json             # Referências + paths (@/*)
├── tsconfig.app.json         # Config estrita do app
└── src/
    ├── components/
    │   ├── ui/               # Componentes shadcn/ui (button, card, input, label,
    │   │                     #   badge, dialog, table, select, textarea, skeleton, sonner)
    │   ├── layout/           # AppLayout (barra superior + <Outlet />)
    │   ├── tasks/            # Formulário, tabela, badges e métricas de tarefas
    │   ├── categories/       # Formulário de categorias
    │   └── shared/           # EmptyState, ErrorState, PageHeader, ConfirmDeleteDialog
    ├── hooks/                # useTasks / useCategories (estado + CRUD + toasts)
    ├── services/             # Chamadas à API por recurso
    ├── lib/                  # api.ts (fetch), date.ts, utils.ts
    ├── pages/                # DashboardPage, CategoriesPage, NotFoundPage
    ├── types/                # Interfaces TypeScript (Task, Category, payloads)
    ├── App.tsx               # BrowserRouter + Routes + <Toaster />
    └── main.tsx
```

## ⚙️ Variáveis de ambiente

Copie o modelo e ajuste se necessário:

```bash
cp .env.example .env
```

| Variável       | Descrição                                   | Exemplo                 |
| -------------- | ------------------------------------------- | ----------------------- |
| `VITE_API_URL` | URL base da API (sem `/api` e sem `/` final) | `http://localhost:3000` |

## 🚀 Como executar

**1. Suba a API (backend da AT1)** — na raiz do repositório:

```bash
docker compose up -d
```

Isso inicia o PostgreSQL e a API em `http://localhost:3000`. (Alternativa sem Docker para a API: veja o README da raiz, "Método 2".)

**2. Suba o frontend:**

```bash
cd frontend
pnpm install
cp .env.example .env
pnpm dev
```

Acesse **http://localhost:5173**.

### Scripts

| Comando           | O que faz                                  |
| ----------------- | ------------------------------------------ |
| `pnpm dev`        | Servidor de desenvolvimento (Vite)         |
| `pnpm build`      | Checa os tipos (`tsc -b`) e gera o build   |
| `pnpm preview`    | Serve o build localmente                   |
| `pnpm type-check` | Apenas a checagem de tipos                 |

## 🔌 CRUD ↔ API ↔ Interface

| Operação  | Método HTTP | Endpoint                 | Onde na interface                                  |
| --------- | ----------- | ------------------------ | -------------------------------------------------- |
| Listar    | `GET`       | `/api/tasks`             | Dashboard: tabela + métricas (loading/empty/error) |
| Criar     | `POST`      | `/api/tasks`             | Botão **Nova tarefa** → modal                      |
| Atualizar | `PUT`       | `/api/tasks/:id`         | Ícone de lápis → modal de edição                   |
| Atualizar | `PATCH`     | `/api/tasks/:id`         | Seletor de status direto na linha da tabela        |
| Excluir   | `DELETE`    | `/api/tasks/:id`         | Ícone de lixeira → modal de confirmação            |
| CRUD      | GET/POST/PUT/DELETE | `/api/categories` | Página **Categorias**                             |

Toda operação exibe um **toast** de sucesso ou erro (Sonner). Erros de validação devolvidos pela API (`{ "erro": "..." }`) são mostrados na notificação.

## ✅ Requisitos da AT2

- **TypeScript estrito:** `strict` + `noImplicitAny`; eventos tipados (`React.FormEvent`, `React.ChangeEvent`); sem `any`.
- **Alias `@/*`:** configurado em `tsconfig.json`, `tsconfig.app.json` e `vite.config.ts`.
- **Variáveis de ambiente:** `VITE_API_URL` em `.env` + `.env.example` versionado.
- **shadcn/ui:** Card, Button (default/outline/destructive), Input, Label, Badge, Dialog, Table e Sonner, entre outros.
- **Rotas:** `/` (dashboard) e `/categorias`, dentro de um `AppLayout` compartilhado.
- **Estados visuais:** loading (skeletons), vazio (empty state) e erro (com botão de nova tentativa).
