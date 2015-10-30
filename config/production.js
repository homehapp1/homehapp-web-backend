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
      siteHost: 'https://homehapp:londonhomestory2015@homehapp.com'
    }
  };
  return config;
};
