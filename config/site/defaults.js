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
        baseUrl: '//res.cloudinary.com/kaktus/image/upload/',
        transformations: {
          // Pinterest styled card
          card: 'c_fill,q_60,w_300',

          // Property list
          propList: 'c_fill,q_60,w_300,h_300',

          thumbNail: 'c_thumb,q_60,w_100,h_100',
          pinkyNail: 'c_thumb,q_60,w_50,h_50',

          // Full-sized preview
          preview: 'c_fill,f_auto,h_960',

          // Big image view
          large: 'c_scale,q_60,w_1920',
          medium: 'c_scale,q_60,w_1000',
          small: 'c_scale,q_60,w_600'
        }
      }
    }
  };

  return config;
};
