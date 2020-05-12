#!/usr/bin/env bash

date +"%Y-%m-%dT%T"
/usr/local/bin/docker-compose up -d --build log_upload
date +"%Y-%m-%dT%T"
