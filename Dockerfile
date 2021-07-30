FROM node:12

WORKDIR /app

ENV PORT=80
ENV DB_HOST=""
ENV DB_PORT=3306
ENV DB_NAME=""
ENV DB_USER=""
ENV DB_PASSWORD=""

COPY package.json ./

RUN npm install

COPY . .

CMD  ["node", "server.js"]