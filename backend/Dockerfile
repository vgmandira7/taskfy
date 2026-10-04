# ---------- Base: Node + pnpm ----------
FROM node:24-alpine AS base
RUN npm install -g pnpm
WORKDIR /app

# ---------- Dependências (dev + prod) para compilar ----------
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm config set strict-dep-builds false \
  && pnpm install --frozen-lockfile

# ---------- Build: TypeScript -> JavaScript ----------
FROM deps AS build
COPY . .
RUN pnpm run build

# ---------- Dependências somente de produção ----------
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm config set strict-dep-builds false \
  && pnpm install --frozen-lockfile --prod

# ---------- Imagem final enxuta ----------
FROM node:24-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
RUN addgroup -S taskfy && adduser -S taskfy -G taskfy
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
USER taskfy
EXPOSE 3000
CMD ["node", "dist/server.js"]
