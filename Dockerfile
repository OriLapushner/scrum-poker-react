FROM oven/bun:latest AS deps

WORKDIR /app

COPY package.json bun.lock* ./

RUN bun install --frozen-lockfile || bun install


FROM oven/bun:latest AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN bun run build


FROM oven/bun:latest AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE ${PORT}

CMD ["bun", "server.js"]
