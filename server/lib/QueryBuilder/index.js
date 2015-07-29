"use strict";

import {toTitleCase} from "../Helpers";

class QueryBuilder {
  constructor(app) {
    this.app = app;
  }
  query(modelName) {
    let className = `${toTitleCase(modelName)}QueryBuilder`;
    let Klass = null;
    try {
      Klass = require(`./${this.app.config.database.adapter}/${className}`);
    } catch (err) {
      console.log(err);
      throw new Error(`No Query builder found for model ${modelName}!`);
    }
    return new Klass(this.app);
  }
}

module.exports = QueryBuilder;
