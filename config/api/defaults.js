'use strict';

module.exports = (projectRoot) => {
  let config = {
    security: {
      csrf: false,
      xframe: false,
      requiredHeaders: {
        exists: [
          'X-Homehapp-Client'
        ],
        valueMatch: {
          'X-Homehapp-Api-Key': 'aa43ef70-85e6-4e98-b8fd-9494fd6c02a0'
        },
        allowRoutes: [
          /^health/,
          /^api\-docs/,
          /^_ah\/[health]/
        ]
      }
    },
    isomorphic: {
      enabled: false
    },
    authentication: {
      adapters: ['jwt']
    },
    docs: {
      expose: true,
      auth: {
        enabled: true,
        username: 'homehapp',
        password: 'qvik-homehapp-docs'
      }
    },
    versioning: {
      enabled: true,
      headerKey: 'X-Homehapp-Api-Version',
      pathRegexp: /^\/api\/v([0-9])/
    },
    extensions: {
      logDevices: {
        clientHeader: 'X-Homehapp-Client'
      }
    }
  };

  return config;
};
