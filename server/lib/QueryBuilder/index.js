import {toTitleCase} from '../Helpers';

let resolvedClasses = {};

class QueryBuilder {
  constructor(app) {
    this.app = app;
  }
  forModel(modelName) {
    let span = this.app.traceAgent.startSpan(
      'qb:construct', {
        modelName: modelName
      }
    );

    let Klass = null;

    if (resolvedClasses[modelName]) {
      Klass = resolvedClasses[modelName];
    } else {
      let className = `${toTitleCase(modelName)}QueryBuilder`;
      try {
        Klass = require(`./${this.app.config.database.adapter}/${className}`);
        resolvedClasses[modelName] = Klass;
      } catch (err) {
        console.log(err);
        this.app.traceAgent.endSpan(span);
        throw new Error(`No Query builder found for model ${modelName}!`);
      }
    }

    this.app.traceAgent.endSpan(span);
    return new Klass(this.app);
  }
  query(modelName) {
    console.warn(`QueryBuilder.query(${modelName}) has been depracated. Use .forModel(${modelName})`);
    return this.forModel(modelName);
  }
}

module.exports = QueryBuilder;
