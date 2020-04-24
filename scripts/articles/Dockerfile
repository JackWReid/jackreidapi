FROM node:12

WORKDIR /usr/src/app

COPY ./scripts/articles/package*.json .
RUN npm install

COPY ./scripts/articles .
COPY ./shared/* ./

CMD [ "node", "update.js" ]

