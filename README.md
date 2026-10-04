# Taskfy API

API RESTful de gerenciamento de tarefas (Task Tracker) com categorias, prioridade e status.
Stack: Node.js, Express, TypeScript, Sequelize, PostgreSQL, Swagger e pnpm.

Projeto entregue para as atividades **AT1** de:

- **LDW** – API RESTful com Node.js, Express, Sequelize e Swagger
- **IEC** – Containerização com Docker e esteira de CI com GitHub Actions (Opção B)

## Estrutura

```
.
├── .github/workflows/ci.yml   # CI (GitHub Actions)
├── .husky/pre-commit          # Hook: lint + format:check + type-check
├── docker-compose.yml         # API + PostgreSQL (com volume)
├── package.json               # Apenas o Husky (raiz)
└── backend/
    ├── Dockerfile
    ├── .dockerignore
    ├── .env.example
    ├── eslint.config.mjs
    ├── .prettierrc
    ├── tsconfig.json
    ├── package.json
    └── src/
        ├── config/            # database.ts (Sequelize + SSL condicional)
        ├── models/            # Category.ts, Task.ts
        ├── controllers/       # TaskController.ts, CategoryController.ts
        ├── routes/            # index.ts, taskRoutes.ts, categoryRoutes.ts
        ├── docs/swagger.json  # Especificação OpenAPI
        └── server.ts          # Ponto de entrada
```

## Executando com Docker (recomendado)

Requer Docker. Na raiz do repositório:

```bash
docker compose up -d --build
```

As tabelas são criadas automaticamente na inicialização da API (`sequelize.sync()`).

- API: http://localhost:3000
- Health check: http://localhost:3000/api/health
- Swagger UI: http://localhost:3000/api-docs

Comandos úteis:

```bash
docker compose ps            # contêineres ativos
docker compose logs -f api   # logs da API
docker compose down          # para tudo (adicione -v para apagar o volume do banco)
```

## Executando localmente (sem Docker para a API)

Requer Node.js 24 e pnpm 11.

```bash
# 1. Na raiz: instala o Husky (ativa os git hooks)
pnpm install

# 2. Backend
cd backend
pnpm install
cp .env.example .env          # ajuste se necessário

# 3. Banco de dados (apenas o PostgreSQL via Docker)
cd ..
docker compose up -d db

# 4. API em modo desenvolvimento
cd backend
pnpm dev
```

## Variáveis de ambiente (`backend/.env`)

| Variável      | Descrição                                       |
| ------------- | ----------------------------------------------- |
| `PORT`        | Porta da API (padrão `3000`)                    |
| `DB_HOST`     | Host do PostgreSQL                              |
| `DB_PORT`     | Porta do PostgreSQL                             |
| `DB_NAME`     | Nome do banco                                   |
| `DB_USER`     | Usuário do banco                                |
| `DB_PASSWORD` | Senha do banco                                  |
| `DB_SSL`      | `true` para banco em nuvem (Supabase), `false` local |

## Endpoints (prefixo `/api`)

| Método    | Rota              | Descrição                                          |
| --------- | ----------------- | -------------------------------------------------- |
| GET       | `/tasks`          | Lista tarefas (filtros: `status`, `priority`, `categoryId`) |
| GET       | `/tasks/:id`      | Busca tarefa por ID                                |
| POST      | `/tasks`          | Cria tarefa (201)                                  |
| PUT/PATCH | `/tasks/:id`      | Atualiza tarefa                                    |
| DELETE    | `/tasks/:id`      | Remove tarefa (204)                                |
| GET       | `/categories`     | Lista categorias                                   |
| GET       | `/categories/:id` | Busca categoria por ID                             |
| POST      | `/categories`     | Cria categoria (201)                               |
| PUT/PATCH | `/categories/:id` | Atualiza categoria                                 |
| DELETE    | `/categories/:id` | Remove categoria (204)                             |

## Qualidade de código (dentro de `backend/`)

```bash
pnpm lint            # ESLint
pnpm format:check    # Prettier (checagem)
pnpm format          # Prettier (corrige)
pnpm type-check      # tsc --noEmit
pnpm build           # compila para dist/
```

O **Husky** executa `lint`, `format:check` e `type-check` a cada `git commit` (`.husky/pre-commit`).
Se algum falhar, o commit é bloqueado.

## CI (GitHub Actions)

O workflow `.github/workflows/ci.yml` roda a cada `push`:
checkout → pnpm → Node.js → `pnpm install --frozen-lockfile` → lint → format:check → type-check → build.
