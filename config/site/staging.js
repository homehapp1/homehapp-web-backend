"use strict";

module.exports = function (projectRoot) {
  var config = {
    authentication: {
      adapters: ['local'],
      adapterConfigs: {
        local: {
          cookie: {
            maxAge: 86000
          },
          session: {
            name: 'homehapp:login',
            secret: 'really-secret-string-here'
          }
        }
      }
    }
  };
  return config;
};
