#!/usr/bin/env bash

date +"%Y-%m-%dT%T"
/usr/local/bin/docker-compose kill api
/usr/local/bin/docker-compose up -d --build api books_update films_update articles_update pocket_update
date +"%Y-%m-%dT%T"
