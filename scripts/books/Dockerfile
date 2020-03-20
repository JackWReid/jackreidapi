FROM python:3.7-buster

WORKDIR /usr/src/app

RUN curl -sL https://deb.nodesource.com/setup_13.x | bash -
RUN apt install -y nodejs

RUN pip install goodreads-to-sqlite

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "node", "update.js" ]

