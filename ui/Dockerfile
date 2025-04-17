# Multi-stage Dockerfile for UI
FROM node:18-slim AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-slim AS server
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js
COPY package.json ./package.json
RUN npm install --production
EXPOSE 3000
CMD ["npm", "run", "serve"]
