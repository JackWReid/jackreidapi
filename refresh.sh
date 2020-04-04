#!/usr/bin/env bash

/usr/local/bin/docker kill $(/usr/local/bin/docker ps -qa);
/usr/local/bin/docker-compose up -d --build
