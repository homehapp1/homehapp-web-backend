#!/bin/bash

# Env says we're using SSL
if [ -n "${ENABLE_SSL+1}" ] && [ "${ENABLE_SSL,,}" = "true" ]; then
  echo "Enabling SSL..."
  cp /usr/src/proxy_ssl.conf /etc/nginx/conf.d/proxy.conf
else
  # No SSL
  cp /usr/src/proxy_nossl.conf /etc/nginx/conf.d/proxy.conf
fi

# If the SERVICE_HOST_ENV_NAME and SERVICE_PORT_ENV_NAME vars are provided,
# they point to the env vars set by Kubernetes that contain the actual
# target address and port. Override the default with them.

if [ -n "${SERVICE_HOST_ENV_NAME+1}" ]; then
  TARGET_SERVICE=${!SERVICE_HOST_ENV_NAME}
fi
if [ -n "${SERVICE_PORT_ENV_NAME+1}" ]; then
  TARGET_SERVICE="$TARGET_SERVICE:${!SERVICE_PORT_ENV_NAME}"
fi

echo "Using target service ${TARGET_SERVICE}"

# Tell nginx the address and port of the service to proxy to
sed -i "s/{{TARGET_SERVICE}}/${TARGET_SERVICE}/g;" /etc/nginx/conf.d/proxy.conf

echo "Starting nginx..."
nginx -g 'daemon off;'
