'use strict';

import alt from '../alt';

class ApplicationStore {
  constructor() {
    this.csrf = null;
    this.config = {
      cloudinary: {
        baseUrl: '//res.cloudinary.com/homehapp/image/upload/'
      }
    };
  }
}

module.exports = alt.createStore(ApplicationStore);
