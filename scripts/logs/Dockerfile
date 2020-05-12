FROM node:12

WORKDIR /usr/src/app

COPY ./api/package*.json ./
RUN npm install

CMD [ "node", "index.js" ]

