FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
COPY .env.example .env
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "./index.js"]