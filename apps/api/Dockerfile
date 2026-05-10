FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma/ ./prisma/
RUN npm ci
COPY tsconfig.json ./
COPY src/ ./src/
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser
COPY package*.json ./
COPY prisma/ ./prisma/
RUN npm ci --omit=dev && npx prisma generate
COPY --from=builder /app/dist/ ./dist/
COPY tsconfig.json ./
USER appuser
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "-r", "tsconfig-paths/register", "dist/server.js"]
