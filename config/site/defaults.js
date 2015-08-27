"use strict";

import {getEnvironmentValue} from "../../server/lib/Helpers";

module.exports = (projectRoot) => {
  let env = getEnvironmentValue("NODE_ENV", "development");
  let port = getEnvironmentValue("NODE_PORT", 3001);
  let hostname = getEnvironmentValue("HOSTNAME", "localhost");
  let host = `http://${hostname}:${port}`;

  let config = {
    clientConfig: {
      cloudinary: {
        baseUrl: 'https://res.cloudinary.com/homehapp/image/upload/',
        transformations: {
          // Pinterest styled card
          card: {
            mode: 'fill',
            width: 300
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

          // Hexagon mask
          masked: {
            mode: 'fill',
            width: 271,
            height: 320,
            mask: 'hexagon-white'
          }
        }
      }
    }
  };

  return config;
};
