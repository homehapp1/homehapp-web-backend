"use strict";

import {getEnvironmentValue} from "../../server/lib/Helpers";

module.exports = (projectRoot) => {
  let env = getEnvironmentValue("NODE_ENV", "development");
  let port = getEnvironmentValue("NODE_PORT", 3001);
  let hostname = getEnvironmentValue("HOSTNAME", "localhost");
  let host = `http://${hostname}:${port}`;

  let config = {
    port: port,
    host: host,
    logging: {
      Console: {
        enabled: true,
        level: "warn"
      }
    },
    database: {
      adapter: getEnvironmentValue("DATABASE_ADAPTER", "mongoose"),
      adapterConfig: {
        uri: getEnvironmentValue("DATABASE_URI", `mongodb://localhost/homehapp-${env}`)
      }
    },
    security: {
      csrf: true,
      xframe: "DENY"
    },
    authentication: {
      adapters: ["local"],
      adapterConfigs: {
        local: {
          cookie: {
            maxAge: 86000
          },
          session: {
            name: "homehapp:login",
            secret: "really-secret-string-here"
          }
        }
      }
    },
    errors: {
      includeData: false
    },
    cdn: {
      adapter: "cloudinary",
      adapterConfig: {
        uri: getEnvironmentValue("CLOUDINARY_URI", "cloudinary://748155655238327:BxDt9A-ZMmmfVQyIXQQfSxqMS9Q@kaktus"),
        transformations: {
          default: null
        }
      }
    }
  };

  return config;
};
