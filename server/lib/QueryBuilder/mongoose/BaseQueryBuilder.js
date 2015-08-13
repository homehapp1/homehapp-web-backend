'use strict';

import async from 'async';
import moment from 'moment';
import {NotFound} from '../../Errors';

class BaseQueryBuilder {
  constructor(app, modelName) {
    this.Model = app.db.getModel(modelName);
    this.app = app;
    this.queries = [];
    this.result = {
      queryBuilder: this
    };
    this._opts = {};
    this._loadedModel = null;

    this.initialize();
  }

  initialize() {}

  limit(limit) {
    this._opts.limit = parseInt(limit);
    return this;
  }

  sort(sort) {
    this._opts.sort = sort;
    return this;
  }

  skip(skipCount) {
    this._opts.skip = parseInt(skipCount);
    return this;
  }

  fetch() {
    return this._executeTasks();
  }

  count() {
    this._opts = {count: true};
    return this._executeTasks();
  }

  // Parse common request query arguments and translate them to
  // search query arguments.
  // req.query.sort       String 'asc|desc' (defaults to desc)
  // req.query.sortBy     String (defaults to updatedAt)
  // req.query.limit      Number
  // req.query.skip       Number
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

  create(data) {
    this._loadedModel = new this.Model();
    //should we have own createFields for multiSet for model creation?
    return this.update(data);
  }

  update(data) {
    this.queries.push((callback) => {
      this._loadedModel.multiSet(data, this.Model.editableFields());
      this._loadedModel.save((err, model) => {
        this._loadedModel = model;
        callback(err);
      });
    });
    this.queries.push((callback) => {
      this.afterSave(data, callback);
    });
    return this._save();
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

  remove() {
    this.queries.push(this.beforeRemove.bind(this));
    this.queries.push((callback) => {
      this._loadedModel.deletedAt = moment().utc().toDate();
      this._loadedModel.save((err, model) => {
        this._loadedModel = model;
        callback(err);
      });
    });
    return this._executeTasks();
  }

  findAll() {
    this.queries.push((callback) => {
      let cursor = this.Model.find({
        deletedAt: null
      });

      if (this._opts.limit) {
        cursor.limit(this._opts.limit);
      }
      if (this._opts.sort) {
        cursor.sort(this._opts.sort);
      }
      if (this._opts.skip) {
        cursor.skip(this._opts.skip);
      }

      cursor.exec((err, models) => {
        if (err) {
          return callback(err);
        }
        this.result.models = models;
        this.result.modelsJson = models.map(model => {
          return model.toJSON();
        });
        callback();
      });
    });

    return this;
  }

  findById(id) {
    this.queries.push((callback) => {
      this.Model.findById(id, (err, model) => {
        if (err) {
          return callback(err);
        }
        if (!model) {
          return callback(new NotFound('model not found'));
        }
        this.result.model = model;
        this.result.modelJson = model.toJSON();
        this._loadedModel = model;
        callback();
      });
    });

    return this;
  }

  findByUuid(uuid) {
    this.queries.push((callback) => {
      this.Model.findOne({
        uuid: uuid,
        deletedAt: null
      }, (err, model) => {
        if (err) {
          return callback(err);
        }
        if (!model) {
          return callback(new NotFound('model not found'));
        }
        this.result.model = model;
        this.result.modelJson = model.toJSON();
        this._loadedModel = model;
        callback();
      });
    });

    return this;
  }

  _executeTasks() {
    return new Promise((resolve, reject) => {
      async.series(this.queries, (err) => {
        this.queries = [];
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
      async.series(this.queries, (err) => {
        this.queries = [];
        if (err) {
          return reject(err);
        } else {
          resolve(this._loadedModel);
        }
      });
    });
  }
}

module.exports = BaseQueryBuilder;
