#!/usr/bin/env bash

[ "$SKIP_SETUP_APACHE_CONFIG" = "true" ] && exit 0
[[ -n "$DEBUG" ]] && set -x

APPLICATION_CONTEXT_PATH="${APPLICATION_CONTEXT_PATH:-/}"

cat << EOF >> /usr/local/apache2/conf/httpd.conf

<Directory "/var/www${APPLICATION_CONTEXT_PATH}">
    Options -Indexes +FollowSymLinks
    AllowOverride None
    Require all granted

    RewriteEngine on
    # If an existing asset or directory is requested go to it as it is
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
    RewriteRule ^ - [L]

    # If the requested resource doesn't exist, use index.html
    RewriteRule ^ ${APPLICATION_CONTEXT_PATH}index.html [L]

</Directory>

IncludeOptional /var/run/*.httpd.conf

EOF
if [[ -n ${APPLICATION_CONTEXT_PATH} && ${APPLICATION_CONTEXT_PATH} != "/" ]] ; then
    cat << EOF >> /usr/local/apache2/conf/httpd.conf
    RedirectMatch ^/?\$ ${APPLICATION_CONTEXT_PATH}
EOF
fi

if [ "$DEBUG" != "true" ] ; then

    sed -i -e 's|CustomLog /proc/self/fd/1|CustomLog /var/log/httpd_access.log|' \
		conf/httpd.conf
    sed -i -e 's|CustomLog /proc/self/fd/1|CustomLog /var/log/httpd_access.conf|' \
		conf/httpd.conf

    echo "Logging to /var/log/httpd_access.log"
fi
