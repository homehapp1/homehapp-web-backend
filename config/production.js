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
          'mongodb://homehapp:NPUPZZD6Qocrh2o8diDhkXO4KtkXRRmp@10.240.199.54/homehapp',
          'mongodb://homehapp:NPUPZZD6Qocrh2o8diDhkXO4KtkXRRmp@10.240.220.185'
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
