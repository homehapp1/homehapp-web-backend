# nginx-ssl-proxy
#
# VERSION   0.0.1

FROM nginx

MAINTAINER Jerry Jalava <jerry.jalava@qvik.fi>

RUN rm /etc/nginx/conf.d/*.conf

WORKDIR /usr/src

ADD start.sh /usr/src/
ADD nginx/nginx.conf /etc/nginx/
ADD nginx/proxy*.conf /usr/src/

ENTRYPOINT ./start.sh
