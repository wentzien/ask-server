FROM node:12

WORKDIR /app

ENV PORT 80

COPY package.json ./

RUN npm install

COPY . .

ENV PORT=80

CMD  ["node", "server.js"]