'use strict';

import alt from '../alt';

class ApplicationStore {
  constructor() {
    this.csrf = null;
    this.config = {};
  }
}

module.exports = alt.createStore(ApplicationStore);
