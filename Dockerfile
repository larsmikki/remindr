# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
COPY client/package.json ./client/
COPY server/package.json ./server/
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copy built artefacts
COPY --from=builder /app/client/dist  /app/client/dist
COPY --from=builder /app/dist-server  /app/dist-server
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json

# Data directory (volume mount point)
RUN mkdir -p /app/data && chown -R nodejs:nodejs /app

USER nodejs

ENV NODE_ENV=production
EXPOSE 3080

HEALTHCHECK --interval=5m --timeout=3s --start-period=5s --retries=3 \
  CMD node --input-type=module -e "import http from 'http'; http.get('http://localhost:3081/api/birthdays',(r)=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "dist-server/index.js"]
