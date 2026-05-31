# Multi-stage Dockerfile: build frontend, build backend, produce production image

FROM node:18-alpine AS build-frontend
WORKDIR /app/frontend
COPY luzmoda/package*.json ./
RUN npm install --silent
COPY luzmoda/ ./
RUN npm run build

FROM node:18-alpine AS build-backend
WORKDIR /app/backend
COPY luzmoda-backend/package*.json ./
RUN npm install --silent --production
COPY luzmoda-backend/ ./
# copy frontend build into backend public folder expected by server
COPY --from=build-frontend /app/frontend/dist ./luzmoda/dist

FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build-backend /app/backend ./
EXPOSE 3001
CMD ["node", "src/server.js"]
