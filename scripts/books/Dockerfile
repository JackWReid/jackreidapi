FROM node:12

WORKDIR /usr/src/app

COPY ./scripts/books/package*.json ./
RUN npm install

COPY ./scripts/books .
COPY ./shared/* ./

CMD [ "node", "update.js" ]

