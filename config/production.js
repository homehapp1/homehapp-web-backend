'use strict';

module.exports = function (projectRoot) {
  var config = {
    logging: {
      Console: {
        enabled: false
      }
    },
    database: {
      adapter: 'mongoose',
      adapterConfig: {
        uri: [
          'mongodb://homehapp:NPUPZZD6Qocrh2o8diDhkXO4KtkXRRmp@hhmongo-db-9kx9/homehapp',
          'mongodb://homehapp:NPUPZZD6Qocrh2o8diDhkXO4KtkXRRmp@hhmongo-db-9n7m'
        ],
        options: {
          replset: {
            rs_name: 'rs0'
          }
        }
      }
    },
    google: {
      enabled: true
    },
    clientConfig: {
      siteHost: 'https://www.homehapp.com'
    }
  };
  return config;
};
