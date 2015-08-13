"use strict";

import {getEnvironmentValue} from "../../server/lib/Helpers";

module.exports = (projectRoot) => {
  let env = getEnvironmentValue("NODE_ENV", "development");
  let port = getEnvironmentValue("NODE_PORT", 3001);
  let hostname = getEnvironmentValue("HOSTNAME", "localhost");
  let host = `http://${hostname}:${port}`;

  let config = {
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
    clientConfig: {
    }
  };

  return config;
};
