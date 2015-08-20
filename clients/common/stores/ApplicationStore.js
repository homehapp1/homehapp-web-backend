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
      revisionedStaticPath: '//res.cloudinary.com/homehapp/raw/upload/site/',
      cloudinary: {
        baseUrl: '//res.cloudinary.com/homehapp/image/upload/',
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
          small: 'c_fill,q_60,h_600'
        }
      }
    };
  }
}

module.exports = alt.createStore(ApplicationStore);
