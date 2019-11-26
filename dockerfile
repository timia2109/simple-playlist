FROM node:13.2.0-stretch-slim AS build-env

WORKDIR /app
COPY ./ ./

# Build Frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Build Server
WORKDIR /app/backend
RUN npm install
RUN npm run build

# Serve container
FROM node:13.2.0-stretch-slim
WORKDIR /app
ENV FILES /app/public
ENV NODE_ENV PRODUCTION

# Copy Files from build container
COPY --from=build-env /app/backend/dist ./
COPY --from=build-env /app/backend/package*.json ./
COPY --from=build-env /app/frontend/build ./public

# Server dependencys
RUN npm install --only=prod

# Start
ENTRYPOINT ["node", "server.js"]