'use strict';

import {toTitleCase} from '../Helpers';

class QueryBuilder {
  constructor(app) {
    this.app = app;
  }
  forModel(modelName) {
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
  query(modelName) {
    console.warn(`QueryBuilder.query(${modelName}) has been depracated. Use .forModel(${modelName})`);
    return this.forModel(modelName);
  }
}

module.exports = QueryBuilder;
