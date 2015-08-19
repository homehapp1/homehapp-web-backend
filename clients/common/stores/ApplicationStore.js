'use strict';

import alt from '../alt';

let debug = require('../debugger')('ApplicationStore');

class ApplicationStore {
  constructor() {
    this.on('bootstrap', () => {
      debug('bootstrapping', this.csrf, this.config);
    });
    this.csrf = null;
    this.config = null;
  }
}

module.exports = alt.createStore(ApplicationStore);
