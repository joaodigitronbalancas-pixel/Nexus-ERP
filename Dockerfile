# Stage 1: Build resources
FROM node:20-alpine AS builder

WORKDIR /app

# Copy lock files and packages configurations
COPY package*.json ./

# Install absolute dependencies, including dev dependencies for compilation
RUN npm ci

# Copy full application codes
COPY . .

# Run enterprise production compilation build (Vite client assets + esbuild server bundle)
RUN npm run build

# Stage 2: Super slim runner environment
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy built bundles and manifests from builder phase
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Install production-only dependencies to minimize image package size and attack surface
RUN npm ci --only=production

# Binds to Port 3000 as required by the reverse proxy ingress architectures
EXPOSE 3000

# Execute non-root user execution mode for container hardening
USER node

CMD ["npm", "start"]
