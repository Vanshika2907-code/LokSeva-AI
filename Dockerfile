FROM node:22-slim

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./
RUN rm -f package-lock.json && npm install

COPY . .
RUN npm run build

EXPOSE 5000
CMD ["npx", "tsx", "server.ts"]
