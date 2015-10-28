'use strict';

module.exports = function (projectRoot) {
  var config = {
    logging: {
      Console: {
        enabled: true,
        level: 'debug'
      },
      File: {
        level: 'debug'
      }
    },
    database: {
      adapter: 'mongoose',
      adapterConfig: {
        uri: [
          'mongodb://homehapp:hSXDuC2VX850FjfQEV+5HFYYrPfw55F0@mongodb2-hhmdb-1/homehapp-staging',
          'mongodb://homehapp:hSXDuC2VX850FjfQEV+5HFYYrPfw55F0@mongodb2-hhmdb-2'
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
      siteHost: 'http://homehapp:londonhomestory2015@130.211.77.56:8080'
    }
  };
  return config;
};
