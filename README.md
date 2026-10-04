# Taskfy API

API REST completa para gerenciamento de tarefas. Este sistema permite o cadastro e controle de tarefas, organizando-as por categorias, níveis de prioridade e status de conclusão.

Este repositório foi construído para consolidar as entregas de duas disciplinas, separando a lógica de negócio (**Web**) da infraestrutura e qualidade (**Integração Contínua**).

---

## 🎓 Contexto de Avaliação

Este projeto atende integralmente aos requisitos das seguintes disciplinas:

### 🌐 1. LDW (Laboratório de Desenvolvimento Web) - AT1

**Foco:** construção da API e arquitetura de software.

* **Arquitetura MVC:** estruturação limpa com `controllers`, `models`, `routes` e `config`.
* **Persistência de Dados:** uso do ORM **Sequelize** com **PostgreSQL**, incluindo sincronização automática das tabelas (`sequelize.sync()`) e suporte a SSL condicional.
* **Documentação Interativa:** interface **Swagger UI** implementada e acessível via navegador para testar todos os endpoints de Categorias e Tarefas.
* **Operações RESTful:** implementação completa de CRUD (`GET`, `POST`, `PUT/PATCH`, `DELETE`) com tratamento de erros centralizado e retornos HTTP semânticos.

### 🐳 2. IEC (Integração e Entrega Contínua) - AT1 (Opção B)

**Foco:** infraestrutura, qualidade de código e automação.

* **Containerização:** criação de `Dockerfile` otimizado e `.dockerignore` para a API.
* **Orquestração:** uso do `docker-compose.yml` para subir a aplicação e o banco de dados PostgreSQL simultaneamente, com volumes para persistência.
* **Qualidade e Git Hooks:** configuração rigorosa de **Husky** (`.husky/pre-commit`) que bloqueia commits caso o **ESLint** (linting), **Prettier** (formatação) ou **TypeScript** (type-check) detectem erros.
* **CI/CD:** pipeline automatizada no **GitHub Actions** (`.github/workflows/ci.yml`) configurada para rodar validações e build a cada `push`.

---

## 🛠️ Tecnologias Utilizadas

| Categoria                  | Tecnologia                              |
| -------------------------- | --------------------------------------- |
| **Backend**                | Node.js v24, Express, TypeScript        |
| **Banco de Dados**         | PostgreSQL                              |
| **ORM**                    | Sequelize                               |
| **Documentação**           | Swagger / OpenAPI                       |
| **Gerenciador de Pacotes** | pnpm v11                                |
| **Infraestrutura**         | Docker, Docker Compose                  |
| **Qualidade e CI**         | ESLint, Prettier, Husky, GitHub Actions |

---

## 📁 Estrutura do Projeto

```text
.
├── .github/
│   └── workflows/
│       └── ci.yml               # Esteira de Integração Contínua
├── .husky/
│   └── pre-commit                # Git Hook de validação local
├── docker-compose.yml            # Orquestração de contêineres
├── package.json                  # Gerenciamento do Husky na raiz
└── backend/                      # Código-fonte da aplicação
    ├── Dockerfile                # Receita de containerização da API
    ├── .env.example              # Template de variáveis de ambiente
    ├── eslint.config.mjs         # Regras do linter
    ├── .prettierrc               # Regras de formatação
    ├── tsconfig.json             # Configurações do TypeScript
    └── src/
        ├── config/               # Configuração do banco
        │   └── database.ts
        ├── models/               # Entidades do banco
        │   ├── Category.ts
        │   └── Task.ts
        ├── controllers/          # Lógica de negócio e validações
        ├── routes/               # Definição dos endpoints REST
        ├── docs/                 # Especificação Swagger
        │   └── swagger.json
        └── server.ts             # Ponto de inicialização do Express
```

---

## ⚙️ Variáveis de Ambiente

Antes de executar o projeto localmente, crie um arquivo `.env` dentro da pasta `backend/`, utilizando o `.env.example` como referência.

| Variável      | Descrição                                                | Exemplo    |
| ------------- | -------------------------------------------------------- | ---------- |
| `PORT`        | Porta onde a API será executada                          | `3000`     |
| `DB_HOST`     | Host do PostgreSQL (`db` no Docker ou `localhost` local) | `db`       |
| `DB_PORT`     | Porta de conexão do PostgreSQL                           | `5432`     |
| `DB_NAME`     | Nome do banco de dados                                   | `taskfy`   |
| `DB_USER`     | Usuário de acesso ao banco                               | `postgres` |
| `DB_PASSWORD` | Senha de acesso ao banco                                 | `postgres` |
| `DB_SSL`      | Habilita SSL (`true` para Supabase/Nuvem, `false` local) | `false`    |

---

## 🚀 Como Executar o Projeto

O projeto pode ser executado de duas maneiras, dependendo do escopo que deseja avaliar.

antes de tudo, na raiz do projeto execute: 
```bash
pnpm install
```
e dentro da pasta backend também execute 
```bash
pnpm install
```

### Método 1: Execução Completa via Docker

**Foco: IEC**

Este método é o recomendado, pois orquestra a aplicação e o banco de dados em contêineres isolados utilizando um único comando.

As tabelas são criadas automaticamente ao iniciar a aplicação.

#### 1. Pré-requisitos

Certifique-se de possuir:

* Docker instalado;
* Docker Compose instalado.

#### 2. Iniciar a aplicação

Na raiz do repositório, execute:

```bash
docker compose up -d
```
#### 3. Parar a aplicação

Para parar a aplicação e remover os contêineres:

```bash
docker compose down
```

---

### Método 2: Ambiente de Desenvolvimento Local

**Foco: LDW**

Ideal para inspecionar o código, executar os hooks locais e realizar alterações em tempo real.

#### Pré-requisitos

* Node.js 24+
* pnpm 11+
* Docker
* Docker Compose


Acesse a pasta `backend`:

```bash
cd backend
```

Instale as dependências, se não não foi ainda:

```bash
pnpm install
```

Crie o arquivo `.env`:

```bash
cp .env.example .env
```

> **Importante:** no ambiente local, defina `DB_HOST=localhost` no arquivo `.env`.

#### 4. Iniciar a API

```bash
pnpm run dev
```

---

## 🌐 Endpoints e Documentação

Com a aplicação em execução, os seguintes recursos estarão disponíveis:

### Health Check

```text
http://localhost:3000/api/health
```

### Swagger UI

Documentação interativa da API:

```text
http://localhost:3000/api-docs
```

---

## 📌 Resumo das Rotas

Todas as rotas possuem o prefixo `/api`.

### Tasks

| Método      | Rota             | Descrição                                 |
| ----------- | ---------------- | ----------------------------------------- |
| `GET`       | `/api/tasks`     | Lista tarefas e permite filtros via query |
| `GET`       | `/api/tasks/:id` | Busca uma tarefa específica por ID        |
| `POST`      | `/api/tasks`     | Cria uma nova tarefa                      |
| `PUT/PATCH` | `/api/tasks/:id` | Atualiza uma tarefa existente             |
| `DELETE`    | `/api/tasks/:id` | Remove uma tarefa                         |

### Categories

| Método      | Rota                  | Descrição                             |
| ----------- | --------------------- | ------------------------------------- |
| `GET`       | `/api/categories`     | Lista todas as categorias             |
| `GET`       | `/api/categories/:id` | Busca uma categoria específica por ID |
| `POST`      | `/api/categories`     | Cria uma nova categoria               |
| `PUT/PATCH` | `/api/categories/:id` | Atualiza uma categoria existente      |
| `DELETE`    | `/api/categories/:id` | Remove uma categoria                  |

### Status HTTP

As operações seguem códigos HTTP semânticos, incluindo:

* `200 OK` — operação realizada com sucesso;
* `201 Created` — recurso criado com sucesso;
* `204 No Content` — recurso removido com sucesso;
* `400 Bad Request` — requisição inválida;
* `404 Not Found` — recurso não encontrado;
* `500 Internal Server Error` — erro interno do servidor.

---

## 🛡️ Scripts de Qualidade de Código

A qualidade do código é garantida por **Git Hooks** utilizando o **Husky**.

Sempre que um `git commit` é executado, o hook `.husky/pre-commit` roda automaticamente os seguintes comandos.

Caso qualquer uma das validações falhe, o commit é bloqueado.

```bash
pnpm lint
pnpm format:check
pnpm type-check
```

### 🔎 ESLint

Analisa o código em busca de:

* erros de sintaxe;
* violações das regras configuradas;
* problemas de qualidade do código.

```bash
pnpm lint
```

### ✨ Prettier

Verifica se os arquivos seguem o padrão de formatação definido no projeto.

```bash
pnpm format:check
```

Para formatar os arquivos automaticamente:

```bash
cd backend
pnpm format
```

---

## 🔄 CI/CD — GitHub Actions

O projeto possui uma pipeline automatizada através do **GitHub Actions**.

Arquivo responsável:

```text
.github/workflows/ci.yml
```

A pipeline é executada a cada `push` e realiza as principais validações do projeto, garantindo que alterações enviadas ao repositório atendam aos requisitos de qualidade e compilação.

Fluxo simplificado:

```text
Push
  │
  ▼
GitHub Actions
  │
  ├── Instala dependências
  ├── Executa ESLint
  ├── Verifica Prettier
  ├── Executa TypeScript
  └── Realiza build
```

---

## 🐳 Docker

A aplicação possui suporte à execução totalmente containerizada.

A arquitetura utiliza dois principais serviços:

```text
┌─────────────────────────┐
│        API Node.js      │
│    Express + TypeScript │
│        Porta 3000       │
└────────────┬────────────┘
             │
             │
┌────────────▼────────────┐
│      PostgreSQL         │
│        Porta 5432       │
│                         │
│      Volume persistente │
└─────────────────────────┘
```

O `docker-compose.yml` é responsável por orquestrar os serviços e configurar a comunicação entre a API e o banco de dados.

---


## 👨‍💻 Projeto Acadêmico

Projeto desenvolvido para fins acadêmicos como parte das atividades das disciplinas:

* **LDW — Laboratório de Desenvolvimento Web**
* **IEC — Integração e Entrega Contínua**

O projeto tem como foco unir **desenvolvimento backend**, **persistência de dados**, **containerização**, **qualidade de código** e **automação de processos de integração contínua**.
