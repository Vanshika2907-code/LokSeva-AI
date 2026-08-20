FROM node:22-slim

WORKDIR /app

COPY package.json ./
RUN rm -f package-lock.json && npm install

COPY . .
RUN npm run build

EXPOSE 5000
CMD ["npx", "tsx", "server.ts"]
