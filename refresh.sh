#!/usr/bin/env bash

date +"%Y-%m-%dT%T"
git checkout -f
git pull origin HEAD
/usr/local/bin/docker-compose up -d --build books_update films_update articles_update pocket_update
date +"%Y-%m-%dT%T"
