"use strict";

import {getEnvironmentValue} from "../server/lib/Helpers";

module.exports = (projectRoot) => {
  let env = getEnvironmentValue("NODE_ENV", "development");
  let port = getEnvironmentValue("NODE_PORT", 3001);
  let hostname = getEnvironmentValue("HOSTNAME", "localhost");
  let host = `http://${hostname}:${port}`;

  let config = {
    port: port,
    host: host,
    database: {
      adapter: getEnvironmentValue("DATABASE_ADAPTER", "mongoose"),
      adapterConfig: {
        uri: getEnvironmentValue("DATABASE_URI", `mongodb://localhost/homehapp-${env}`)
      }
    },
    authentication: {
      adapters: ["local"],
      adapterConfigs: {
        local: {
          cookie: {
            maxAge: 86000
          },
          session: {
            name: "qvik:common",
            secret: "really-secret-string-here"
          }
        },
        jwt: {
          secretOrKey: "really-secret-string-here-for-fwt",
          issuer: "qvik.fi",
          audience: "qvik.fi",
          lifetimeSeconds: 86000
        },
        facebook: {
          appId: null,
          secret: null,
          callbackUrl: null
        },
        google: {
          clientID: null,
          clientSecret: null,
          callbackUrl: null
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
