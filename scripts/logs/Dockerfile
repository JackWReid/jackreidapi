FROM node:12

WORKDIR /usr/src/app

COPY ./scripts/logs/package*.json ./
RUN npm install

COPY ./scripts/logs .

CMD [ "node", "index.js" ]

