"use strict";

import alt from "../alt";

class ApplicationStore {
  constructor() {
    this.csrf = null;
  }
}

module.exports = alt.createStore(ApplicationStore);
