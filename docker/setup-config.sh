#!/usr/bin/env bash

[ "$SKIP_SETUP_CONFIG" = "true" ] && exit 0
[[ -n "$DEBUG" ]] && set -x

COMPTOIR_WS_URL="${COMPTOIR_WS_URL:-https://dev.comptoir.valuya.be/comptoir-ws}"
APPLICATION_CONTEXT_PATH="${APPLICATION_CONTEXT_PATH:-/}"

cat << EOF > /var/www/${APPLICATION_CONTEXT_PATH}/comptoir-runtime-config.json
{
    "backend": {
        "url": "${COMPTOIR_WS_URL}"
    }
}
EOF


