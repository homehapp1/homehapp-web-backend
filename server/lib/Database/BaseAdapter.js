"use strict";

import {merge} from "../Helpers";

class BaseAdapter {
  constructor(config, defaults = {}) {
    this._schemas = {};
    this.config = merge(defaults, config);
    this.migrationSupport = false;
  }
}

module.exports = BaseAdapter;
