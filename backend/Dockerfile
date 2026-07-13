# FieldOps backend — imagen de producción (Node 20 + Prisma)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY src ./src
RUN npx prisma generate
EXPOSE 3000
CMD ["node", "src/api/app.js"]
