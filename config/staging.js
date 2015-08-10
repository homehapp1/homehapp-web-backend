"use strict";

module.exports = function (projectRoot) {
  var config = {
    logging: {
      Console: {
        enabled: true,
        level: "debug"
      }
    },
    database: {
      adapter: "mongoose",
      adapterConfig: {
        uri: [
          "mongodb://homehapp:hSXDuC2VX850FjfQEV+5HFYYrPfw55F0@hhmongo-db-9kx9/homehapp-staging",
          "mongodb://homehapp:hSXDuC2VX850FjfQEV+5HFYYrPfw55F0@hhmongo-db-9n7m"
        ],
        options: {
          replset: {
            rs_name: "rs0"
          }
        }
      }
    },
    google: {
      enabled: true
    },
    authentication: {
      adapters: ['basic']
    }
  };
  return config;
};
