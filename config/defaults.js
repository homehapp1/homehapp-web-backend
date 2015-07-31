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
      adapters: [],
      adapterConfigs: {
        basic: {
          username: "homehapp",
          password: "homehapplondon2015"
        },
        local: {
          cookie: {
            maxAge: 86000
          },
          session: {
            name: "qvik:common",
            secret: "really-secret-string-here"
          },
          routes: {
            login: "/auth/login",
            logout: "/auth/logout"
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
    },
    isomorphic: {
      enabled: true
    }
  };

  return config;
};
