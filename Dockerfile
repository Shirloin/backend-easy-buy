FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

COPY package*.json ./
COPY --from=build /app/dist ./dist
COPY start.prod.sh ./

RUN npm install --only=production

CMD ["./start.prod.sh"]
