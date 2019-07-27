#!/usr/bin/env bash

if [[ "$ENABLE_SSL" != "true" ]] ; then
    exit 0
fi

COMPTOIR_SSL_CERT_FILE="${COMPTOIR_SSL_CERT_FILE:-/usr/local/apache2/conf/server.crt}"
COMPTOIR_SSL_KEY_FILE="${COMPTOIR_SSL_KEY_FILE:-/usr/local/apache2/conf/server.key}"

echo "Enabling ssl"
pushd /usr/local/apache2/

[[ -n "$DEBUG" ]] && set -x

sed -i \
    -e 's/^#\(Listen 443\)/\1/' \
    -e 's/^#\(Include .*httpd-ssl.conf\)/\1/' \
    -e 's/^#\(LoadModule .*mod_ssl.so\)/\1/' \
    -e 's/^#\(LoadModule .*mod_socache_shmcb.so\)/\1/' \
    conf/httpd.conf

sed -i \
    -e "s#^SSLCertificateFile.*#SSLCertificateFile \"${COMPTOIR_SSL_CERT_FILE}\"#" \
    -e "s#^SSLCertificateKeyFile.*#SSLCertificateKeyFile \"${COMPTOIR_SSL_KEY_FILE}\"#" \
    conf/extra/httpd-ssl.conf

popd
