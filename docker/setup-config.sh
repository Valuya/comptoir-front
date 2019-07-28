#!/usr/bin/env bash

[ "$SKIP_SETUP_CONFIG" = "true" ] && exit 0
[[ -n "$DEBUG" ]] && set -x

COMPTOIR_WS_URL="${COMPTOIR_WS_URL:-https://dev.comptoir.valuya.be/comptoir-ws}"
COMPTOIR_SW_PUSH_PUBLIC_KEY="${COMPTOIR_SW_PUSH_PUBLIC_KEY:-}"
if [ -f "$COMPTOIR_SW_PUSH_PUBLIC_KEY_FILE" ] ; then
    COMPTOIR_SW_PUSH_PUBLIC_KEY="$(head -n1 $COMPTOIR_SW_PUSH_PUBLIC_KEY_FILE)"
fi
APPLICATION_CONTEXT_PATH="${APPLICATION_CONTEXT_PATH:-/}"

cat << EOF > /var/www/${APPLICATION_CONTEXT_PATH}/comptoir-runtime-config.json
{
    "backend": {
        "url": "${COMPTOIR_WS_URL}",
        "swPushKey": "${COMPTOIR_SW_PUSH_PUBLIC_KEY}"
    }
}
EOF


