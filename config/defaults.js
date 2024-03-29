'use strict';

import fs from 'fs';
import path from 'path';
import {getEnvironmentValue} from '../server/lib/Helpers';

module.exports = (projectRoot) => {
  let env = getEnvironmentValue('NODE_ENV', 'development');
  let port = getEnvironmentValue('NODE_PORT', 3001);
  let hostname = getEnvironmentValue('HOSTNAME', 'localhost');
  let host = `http://${hostname}:${port}`;

  let databaseOptions = {
    db: {
      native_parser: true
    },
    server: {
      poolSize: 10,
      auto_reconnect: true
    }
  };
  if (getEnvironmentValue('DATABASE_OPTIONS', null)) {
    try {
      databaseOptions = JSON.parse(getEnvironmentValue('DATABASE_OPTIONS', {}));
    } catch (err) {
      console.error(`Error while parsing database options: ${err.message}`);
    }
  }

  let fileLoggingOptions = {
    enabled: false,
    level: 'info'
  };
  let fileLogPath = getEnvironmentValue('LOG_PATH', null);
  if (fileLogPath) {
    fileLoggingOptions.enabled = true;
    fileLoggingOptions.filename = path.join(fileLogPath, 'general.log');
    if (!fs.existsSync(fileLogPath)) {
      try {
        fs.mkdirSync(fileLogPath);
      } catch (err) {
        console.error('Error creating log path', err);
        fileLoggingOptions.enabled = false;
      }
    }
  }

  let config = {
    port: port,
    host: host,
    logging: {
      Console: {
        enabled: true,
        json: false,
        level: 'warn'
      },
      File: fileLoggingOptions
    },
    database: {
      adapter: getEnvironmentValue('DATABASE_ADAPTER', 'mongoose'),
      adapterConfig: {
        uri: getEnvironmentValue('DATABASE_URI', `mongodb://localhost/homehapp-${env}`),
        options: databaseOptions
      }
    },
    security: {
      csrf: true,
      csrfSkipRoutes: [],
      xframe: 'DENY'
    },
    authentication: {
      adapters: [],
      adapterConfigs: {
        basic: {
          username: 'homehapp',
          password: 'londonhomestory2015'
        },
        local: {
          cookie: {
            maxAge: 86000
          },
          session: {
            name: 'qvik:common',
            secret: 'really-secret-string-here'
          },
          routes: {
            login: '/auth/login',
            logout: '/auth/logout'
          }
        },
        jwt: {
          tokenField: 'X-Homehapp-Auth-Token',
          secret: null,
          checkIdField: '_checkId',
          keys: {
            public: path.join(projectRoot, 'auth-public.pem'),
            private: path.join(projectRoot, 'auth-private.pem')
          },
          issuer: 'homehapp.com',
          audience: 'homehapp.com',
          lifetimeSeconds: 0 // 0 = Unexpiring
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
      adapter: 'cloudinary',
      adapterConfig: {
        projectName: 'homehapp',
        uri: getEnvironmentValue('CLOUDINARY_URI', 'cloudinary://674338823352987:urOckACznNPsN58_1zewwJmasnI@homehapp'),
        transformations: {}
      }
    },
    isomorphic: {
      enabled: true
    },
    google: {
      enabled: false,
      api: {
        key: 'AIzaSyDPzTlDi9dZ2otR47DLwUPHp4Y2Ge9VQ-U',
        audience: '897870831901-fq0r8oi489tbvces0a6c7c9lcd4s1uq4.apps.googleusercontent.com'
      }
    },
    versioning: {
      enabled: false
    },
    docs: {
      expose: false
    },
    extensions: {
      twilio: {
        sid: 'ACfe13687d3f1fc9f6217a3c5af02e1d76',
        token: '184d32f9b009255e676cc15b87636331',
        phoneNumbers: {
          country: 'FI',
          options: {
            VoiceEnabled: true
          }
        }
      }
    },
    mailchimp: {
      apikey: '9c1a33b75b3198da77528a1eaf139cd4-us12',
      newsletter: '914a5e94a5'
    },
    clientConfig: {
      siteHost: 'http://localhost:3001',
      google: {
        apiKey: "AIzaSyAKffMTuwbg4NSSil9qahcTyTd8FL9Q8zQ"
      },
      cloudinary: {
        projectId: 'homehapp',
        baseUrl: 'https://res.cloudinary.com/homehapp/image/upload/',
        apiUrl: '//api.cloudinary.com/v1_1/homehapp',
        transformations: {
          // Pinterest styled card
          card: {
            mode: 'fill',
            width: 280
          },

          // Property list
          propList: {
            mode: 'fill',
            width: 300,
            height: 300
          },
          thumbnail: {
            mode: 'thumb',
            width: 100,
            height: 100
          },
          pinkynail: {
            mode: 'thumb',
            width: 50,
            height: 50
          },

          // Full content
          full: {
            mode: 'fill',
            width: 1200,
            height: 800
          },
          half: {
            mode: 'fill',
            width: 800,
            height: 600
          },

          // Full-sized preview
          preview: {
            mode: 'fill',
            height: 960
          },

          // Big image variants
          large: {
            mode: 'scale',
            width: 1920
          },
          medium: {
            mode: 'scale',
            width: 1000
          },
          small: {
            mode: 'fill',
            height: 600
          },

          gallery: {
            mode: 'fit',
            width: 600,
            height: 600
          },
          fullscreen: {
            width: 1920,
            height: 1080,
            mode: 'fit'
          },

          // Hexagon mask
          masked: {
            mode: 'fill',
            width: 271,
            height: 320,
            mask: 'hexagon',
            gravity: 'faces',
            applyDimensions: true
          }
        }
      }
    }
  };

  return config;
};
