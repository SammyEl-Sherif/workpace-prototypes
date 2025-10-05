# Base Node.js image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files for workspace setup
COPY package.json package-lock.json* ./
COPY src/package.json ./src/

# Install dependencies using npm
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/src/node_modules ./src/node_modules

# Copy source code
COPY . .

# Set environment for production build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application directly (bypass by-node-env wrapper)
RUN npm run build:production --workspace src

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy dependencies and source code
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/src/node_modules ./src/node_modules
COPY --from=builder /app/src/.next ./src/.next
COPY --from=builder /app/src/public ./src/public
COPY . .

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["npm", "run", "start"]