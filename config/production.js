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
          'mongodb://homehapp:NPUPZZD6Qocrh2o8diDhkXO4KtkXRRmp@mongodb2-hhmdb-1/homehapp',
          'mongodb://homehapp:NPUPZZD6Qocrh2o8diDhkXO4KtkXRRmp@mongodb2-hhmdb-2'
        ],
        options: {
          db: {
            native_parser: true
          },
          server: {
            poolSize: 20,
            auto_reconnect: true
          },
          replset: {
            rs_name: 'rs0',
            poolSize: 20,
            socketOptions: {
              keepAlive: 120
            }
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
