'use strict';

import alt from '../alt';

class ApplicationStore {
  constructor() {
    this.on('bootstrap', () => {
      console.log('bootstrapping', this.csrf, this.config);
    });
    this.csrf = null;
    this.config = {
      cloudinary: {
        baseUrl: '//res.cloudinary.com/homehapp/image/upload/'
      }
    };
  }
}

module.exports = alt.createStore(ApplicationStore);
