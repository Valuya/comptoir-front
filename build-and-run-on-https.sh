#!/usr/bin/env bash

ng build -c sw || exit 1
docker build -t comptoir-front .

docker-compose up -d --force-recreate front
