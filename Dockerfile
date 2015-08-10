FROM ubuntu:14.04
MAINTAINER Jerry Jalava <jerry@qvik.fi>

LABEL Description="Homehapp web proto container"

RUN apt-get update -y && apt-get install -y curl git make g++ python python-software-properties build-essential
RUN curl -sL https://deb.nodesource.com/setup | bash
RUN apt-get install -y nodejs

ADD package.json /app/package.json
RUN cd /app && npm install
ADD . /app

ENV NODE_ENV=development
ENV NODE_PORT=8080
ENV GOOGLE_PROJECT_ID=homehappweb
ENV LOG_PATH=/var/log/app_engine/custom_logs

EXPOSE 8080
ENTRYPOINT cd /app && npm run dev
