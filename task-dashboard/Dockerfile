# ============================================
# Stage 1: Build Stage
# ============================================
FROM node:20-alpine AS builder

# Metadata
LABEL maintainer="your-email@example.com"
LABEL description="Task Dashboard - React + Vite + Firebase"
LABEL version="2.0.0"

# Configurar directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias primero (mejor cache de Docker layers)
COPY package*.json ./

# Instalar dependencias con cache limpio
RUN npm ci --only=production=false \
    && npm cache clean --force

# Copiar codigo fuente
COPY . .

# Build arguments para variables de entorno de Firebase
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_MEASUREMENT_ID

# Setear variables de entorno para el build
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY \
    VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN \
    VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID \
    VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET \
    VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID \
    VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID \
    VITE_FIREBASE_MEASUREMENT_ID=$VITE_FIREBASE_MEASUREMENT_ID

# Build de produccion (TypeScript check + Vite build)
RUN npm run build

# ============================================
# Stage 2: Production Stage
# ============================================
FROM nginx:1.25-alpine

# Metadata
LABEL maintainer="your-email@example.com"
LABEL description="Task Dashboard - Production Image"
LABEL version="2.0.0"

# Copiar configuracion personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos buildados desde builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer puerto HTTP
EXPOSE 80

# Health check para monitoreo automatico
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Comando de inicio (nginx en foreground)
CMD ["nginx", "-g", "daemon off;"]
