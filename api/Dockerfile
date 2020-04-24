FROM node:12

WORKDIR /usr/src/app

COPY ./api/package*.json ./
RUN npm install

COPY ./api .
COPY ./shared/* .
EXPOSE 3000
CMD [ "node", "index.js" ]

