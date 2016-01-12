import async from 'async';
import moment from 'moment';
import {NotFound} from '../../Errors';
import {merge, enumerate} from '../../Helpers';
import CommonQueryBuilder from '../CommonQueryBuilder';

/**
 * Base QueryBuilder for Mongoose
 */
export default class BaseQueryBuilder extends CommonQueryBuilder {
  /**
   * Initializes new QB for given Model
   * @param  {object} app       Application instance
   * @param  {string} modelName Name of the Model to use
   */
  constructor(app, modelName) {
    super(app, modelName);

    this.Schema = this._app.db.getSchema(modelName);
    this._extraDatas = null;
    this._populateOptions = {};

    this.initialize();
  }

  /**
   * Overridable initialization method
   */
  initialize() {}

  hasSchemaField(name) {
    return !!this.Schema.pathType(name);
  }

  select(fields) {
    this._opts.fields = fields;
    return this;
  }

  populate(options) {
    this._populateOptions = options;
    return this;
  }

  count() {
    this._opts = {count: true};
    return this._executeTasks();
  }

  distinct(field) {
    this._queries.push((callback) => {
      let findQuery = {
        deletedAt: null
      };
      if (this._opts.query) {
        findQuery = merge(findQuery, this._opts.query);
      }

      let cursor = this.Model.distinct(field, findQuery);
      this._configurePopulationForCursor(cursor);
      cursor.exec((err, models) => {
        if (err) {
          return callback(err);
        }
        this.result.models = models;
        this.result.modelsJson = JSON.stringify(models.map((id) => {
          return String(id);
        }));
        callback();
      });
    });

    return this;
  }

  query(query) {
    if (!this._opts.query) {
      this._opts.query = {};
    }
    this._opts.query = merge({}, this._opts.query, query);
    return this;
  }

  setExtraData(data) {
    if (!this._extraDatas) {
      this._extraDatas = {};
    }
    this._extraDatas = merge({}, this._extraDatas, data);
    return this;
  }

  create(data) {
    this._loadedModel = new this.Model();
    return this.update(data);
  }

  createNoMultiset(data) {
    this._loadedModel = new this.Model(data);

    this._queries.push((callback) => {
      this._loadedModel.save((err, model) => {
        this._loadedModel = model;
        callback(err);
      });
    });
    this._queries.push((callback) => {
      this.afterSave(data, callback);
    });
    return this._save();
  }

  update(data) {
    this._queries.push((callback) => {
      this._loadedModel.multiSet(data, this.Model.editableFields());

      if (this._extraDatas) {
        for (let [key, value] of enumerate(this._extraDatas)) {
          this._loadedModel.set(key, value);
        }
      }

      this._loadedModel.save((err, model) => {
        this._loadedModel = model;
        callback(err);
      });
    });
    this._queries.push((callback) => {
      this.afterSave(data, callback);
    });
    return this._save();
  }

  updateNoMultiset(data) {
    this._queries.push((callback) => {
      for (let [key, value] of enumerate(data)) {
        this._loadedModel.set(key, value);
      }

      if (this._extraDatas) {
        for (let [key, value] of enumerate(this._extraDatas)) {
          this._loadedModel.set(key, value);
        }
      }

      this._loadedModel.save((err, model) => {
        this._loadedModel = model;
        callback(err);
      });
    });
    this._queries.push((callback) => {
      this.afterSave(data, callback);
    });
    return this._save();
  }

  remove() {
    this._queries.push(this.beforeRemove.bind(this));
    this._queries.push((callback) => {
      this._loadedModel.deletedAt = moment().utc().toDate();
      this._loadedModel.save((err, model) => {
        this._loadedModel = model;
        this.result.model = model;
        callback(err);
      });
    });
    return this._executeTasks();
  }

  removeAll() {
    this.result.deletedCount = 0;
    this._queries.push(this.beforeRemove.bind(this));
    this._queries.push((callback) => {
      let subQueries = [];
      if (this.result.models && this.result.models.length) {
        this.result.models.forEach((model) => {
          subQueries.push((scb) => {
            model.deletedAt = moment().utc().toDate();
            model.save((err) => {
              if (err) {
                return scb(err);
              }
              this.result.deletedCount += 1;
              scb();
            });
          });
        });
      }
      async.series(subQueries, callback);
    });
    return this._executeTasks();
  }

  findAll() {
    this._queries.push((callback) => {
      let findQuery = {
        deletedAt: null
      };
      if (this._opts.query) {
        findQuery = merge(findQuery, this._opts.query);
      }

      let cursor = this.Model.find(findQuery);
      if (this._opts.count) {
        cursor = this.Model.count(findQuery);
      }

      if (this._opts.limit) {
        cursor.limit(this._opts.limit);
      }
      if (this._opts.sort) {
        cursor.sort(this._opts.sort);
      }
      if (this._opts.skip) {
        cursor.skip(this._opts.skip);
      }
      if (this._opts.fields) {
        cursor.select(this._opts.fields);
      }

      this._configurePopulationForCursor(cursor);

      cursor.exec((err, models) => {
        if (err) {
          return callback(err);
        }

        if (this._opts.count) {
          this.result.count = models;
          return callback();
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

  findOne() {
    this._queries.push((callback) => {
      let findQuery = {
        deletedAt: null
      };
      if (this._opts.query) {
        findQuery = merge(findQuery, this._opts.query);
      }

      let cursor = this.Model.findOne(findQuery);

      if (this._opts.fields) {
        cursor.select(this._opts.fields);
      }

      this._configurePopulationForCursor(cursor);

      cursor.exec((err, model) => {
        if (err) {
          return callback(err);
        }

        this.result.model = model;
        this.result.modelJson = model.toJSON();
        this._loadedModel = model;
        callback();
      });
    });

    return this;
  }

  findById(id) {
    this._queries.push((callback) => {
      let cursor = this.Model.findById(id);

      this._configurePopulationForCursor(cursor);

      cursor.exec((err, model) => {
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
    this._queries.push((callback) => {
      let findQuery = {
        uuid: uuid,
        deletedAt: null
      };
      if (this._opts.query) {
        findQuery = merge(findQuery, this._opts.query);
      }

      let cursor = this.Model.findOne(findQuery);

      this._configurePopulationForCursor(cursor);

      cursor.exec((err, model) => {
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

  _save() {
    return new Promise((resolve, reject) => {
      async.series(this._queries, (err) => {
        this._queries = [];
        if (err) {
          return reject(err);
        } else {
          if (!Object.keys(this._populateOptions).length) {
            return resolve(this._loadedModel);
          }
          this.findById(this._loadedModel._id)
          .fetch()
          .then((result) => {
            resolve(result.model);
          });
        }
      });
    });
  }

  _configurePopulationForCursor(cursor) {
    for (let [field, options] of enumerate(this._populateOptions)) {
      if (options) {
        if (typeof options === 'string') {
          cursor.populate(field, options);
        } else {
          options.path = field;
          cursor.populate(options);
        }
      } else {
        cursor.populate(field, options);
      }
    }
  }
}
