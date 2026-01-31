# Etapa 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine
WORKDIR /app

# Copiar solo lo necesario
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --omit=dev

EXPOSE 4321

# Variable para escuchar en todas las interfaces
ENV HOST=0.0.0.0
ENV PORT=4321

# Comando de inicio
CMD ["node", "./dist/server/entry.mjs"]
