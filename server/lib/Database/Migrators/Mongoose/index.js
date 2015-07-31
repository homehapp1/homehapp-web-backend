"use strict";

let debug = require("debug")("MongooseMigrator");

class MongooseMigrator {
  constructor(app) {
    this.app = app;
    this.version = 0;
  }

  getSchemas() {
    let schemas = this.app.db.getSchemas();
    return schemas;
  }

  getModels() {
    let schemas = this.app.db.getModels();
    return schemas;
  }

  getFixtureData() {
    return this.app.db.getFixturesData();
  }

  execute(action, args) {
    debug("execute", action, args);
    let actionMethod = require(`./action.${action}`);
    return actionMethod(this, args);
  }
}

module.exports = MongooseMigrator;
