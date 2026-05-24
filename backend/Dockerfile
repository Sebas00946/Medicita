FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app .

ENV NODE_ENV=production

EXPOSE 4000

CMD ["node", "src/server.js"]
