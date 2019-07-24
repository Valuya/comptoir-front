#!/bin/bash

/enable-ssl.sh || exit 1

/setup-config.sh || exit 1
/setup-apache-config.sh || exit 1

exec "$@"
