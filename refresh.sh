#!/usr/bin/env bash

date +"%Y-%m-%dT%T"
/usr/local/bin/docker kill $(/usr/local/bin/docker ps -qa);
/usr/local/bin/docker-compose up -d --build
date +"%Y-%m-%dT%T"
