FROM python:3.7-buster

WORKDIR /usr/src/app

RUN curl -sL https://deb.nodesource.com/setup_13.x | bash -
RUN apt install -y nodejs

RUN pip install goodreads-to-sqlite

COPY ./scripts/books/package*.json ./
RUN npm install

COPY ./scripts/books .
COPY ./shared/* ./

CMD [ "node", "update.js" ]

