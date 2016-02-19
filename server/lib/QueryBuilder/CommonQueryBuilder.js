import async from 'async';

/**
 * Common QueryBuilder which different Database implementations
 * base classes extend from.
 */
export default class CommonQueryBuilder {
  constructor(app, modelName) {
    this._app = app;
    this._queries = [];
    this._opts = {};
    this._loadedModel = null;

    this.Model = app.db.getModel(modelName);
    this.result = {
      queryBuilder: this
    };
  }

  /**
   * Limit query results by number
   * @param  {number} limit Limit results to number of items
   */
  limit(limit) {
    this._opts.limit = parseInt(limit);
    return this;
  }

  /**
   * Sort query result
   * @param  {{"sortBy": "order"}} sort Sort by rules
   */
  sort(sort) {
    this._opts.sort = sort;
    return this;
  }

  /**
   * Skip query results items by number
   * @param  {number} skipCount How many items to skip
   */
  skip(skipCount) {
    this._opts.skip = parseInt(skipCount);
    return this;
  }

  /**
   * Execute fetch
   */
  fetch() {
    return this._executeTasks();
  }

  /**
   * Execute count
   */
  count() {
    this._opts.count = true;
    return this._executeTasks();
  }

  /**
   * Parse common request query arguments and translate them to
   * search query arguments.
   * req.query.sort       String 'asc|desc' (defaults to desc)
   * req.query.sortBy     String (defaults to updatedAt)
   * req.query.limit      Number
   * req.query.skip       Number
   * @param {object} req  Express.js Request object
   */
  parseRequestArguments(req) {
    // Here we allow this convenience handling to sort ascendingly by the updatedAt value
    if (req.query.sort || req.query.sortBy) {
      let sortBy = req.query.sortBy || 'updatedAt';
      let order = 'desc';
      if (req.query.sort === 'asc') {
        order = 'asc';
      }
      let sort = {};
      sort[sortBy] = order;
      this.sort(sort);
    }

    if (req.query.limit) {
      this.limit(req.query.limit);
    }

    if (req.query.skip) {
      this.skip(req.query.skip);
    }

    return this;
  }

  /**
   * This is called after model is created and updated, right after saving model.
   * override this to do extras after shaving the model.
   * @param data that was used when creating/updating model
   * @param callback
   */
  afterSave(data, callback){
    callback();
    return this;
  }

  /**
   * This is called before model is removed,
   * override this to do extras before removing model.
   * @param callback
   */
  beforeRemove(callback){
    callback();
    return this;
  }

  /**
   * @param data Object
   */
  create() {
    throw new Error('not implemented');
  }

  /**
   * @param data Object
   */
  update() {
    throw new Error('not implemented');
  }

  remove() {
    throw new Error('not implemented');
  }

  _executeTasks() {
    return new Promise((resolve, reject) => {
      async.series(this._queries, (err) => {
        this._queries = [];
        if (err) {
          return reject(err);
        } else {
          resolve(this._opts.count ? this.result.count : this.result);
        }
      });
    });
  }

  _save() {
    return new Promise((resolve, reject) => {
      async.series(this._queries, (err) => {
        this._queries = [];
        if (err) {
          return reject(err);
        } else {
          resolve(this._loadedModel);
        }
      });
    });
  }
}
