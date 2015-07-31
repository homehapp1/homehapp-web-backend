"use strict";

import {merge} from "../Helpers";

class BaseAdapter {
  constructor(app, config, defaults = {}) {
    this.app = app;
    this._schemas = {};
    this.config = merge(defaults, config);
    this.migrationSupport = false;
  }
}

module.exports = BaseAdapter;
