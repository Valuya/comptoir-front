FROM httpd:2.4.39-alpine

RUN apk update && apk upgrade && apk add bash curl openssl apache2-ssl

COPY docker/*.sh     /
COPY docker/conf/httpd.conf /usr/local/apache2/conf/httpd.conf
COPY docker/conf/ssl.conf /usr/local/apache2/conf/extra/httpd-ssl.conf
RUN chmod +x /*.sh

COPY dist/comptoir-front/ /var/www/

ENTRYPOINT ["/entrypoint.sh"]
CMD ["httpd-foreground"]
