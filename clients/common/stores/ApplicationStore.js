'use strict';

import alt from '../alt';

let debug = require('../debugger')('ApplicationStore');

class ApplicationStore {
  constructor() {
    this.on('bootstrap', () => {
      debug('bootstrapping', this.csrf, this.config);
    });
    this.csrf = null;
    this.config = {
      siteHost: 'http://localhost:3001',
      revisionedStaticPath: 'https://res.cloudinary.com/homehapp/raw/upload/site/',
      cloudinary: {
        baseUrl: 'https://res.cloudinary.com/homehapp/image/upload/',
        apiUrl: 'https://api.cloudinary.com/v1_1/homehapp',
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
    };
  }
}

module.exports = alt.createStore(ApplicationStore);
