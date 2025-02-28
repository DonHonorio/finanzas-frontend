# 1️⃣ Usar la imagen base de Node.js 22.13.1 para construir la app
FROM node:22.13.1-alpine AS builder
WORKDIR /app

# Copiar archivos de la aplicación
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copiar el resto del código fuente y construir la aplicación
COPY . .
RUN npm run build

# 2️⃣ Usar una imagen ligera de Node.js 22.13.1 para producción
FROM node:22.13.1-alpine AS runner
WORKDIR /app

# Copiar archivos desde la etapa de compilación
COPY --from=builder /app ./

# Configurar variable de entorno para el puerto en Render
ENV PORT=3000
ENV NEXT_PUBLIC_API_URL="https://finanzas-api.fly.dev"

# Exponer el puerto
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]
