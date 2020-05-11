FROM ubuntu:latest
ENV DEBIAN_FRONTEND noninteractive

WORKDIR /usr/src/app

COPY . .

RUN set -e \
      && ln -sf bash /bin/sh

RUN set -e \
      && apt-get -y update \
      && apt-get -y dist-upgrade \
      && apt-get -y install --no-install-recommends --no-install-suggests \
        ca-certificates git golang \
      && apt-get -y autoremove \
      && apt-get clean \
      && rm -rf /var/lib/apt/lists/*

ENV PATH /opt/go/bin:${PATH}
ENV GOPATH /opt/go

RUN set -e \
      && mkdir /opt/go \
      && go get github.com/gohugoio/hugo

EXPOSE 1313

CMD [ "hugo", "server" ]
