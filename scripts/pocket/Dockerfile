FROM python:3.7-buster

WORKDIR /usr/src/app

RUN curl -sL https://deb.nodesource.com/setup_13.x | bash -
RUN apt install -y nodejs

RUN git clone https://github.com/karlicoss/pockexport.git
RUN cd pockexport && pip3 install --user -r requirements.txt

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "node", "update.js" ]

