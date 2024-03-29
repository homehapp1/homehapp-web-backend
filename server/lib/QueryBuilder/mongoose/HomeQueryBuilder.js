import BaseQueryBuilder from './BaseQueryBuilder';
import {NotFound} from '../../Errors';
import {merge} from '../../Helpers';

let debug = require('debug')('HomeQueryBuilder');

export default class HomeQueryBuilder extends BaseQueryBuilder {
  constructor(app) {
    super(app, 'Home');
  }

  initialize() {
  }

  findBySlug(slug) {
    this._queries.push((callback) => {
      let cursor = this.Model.findOne({
        slug: slug,
        deletedAt: null
      });

      this._configurePopulationForCursor(cursor);
      cursor.exec((err, model) => {
        if (err) {
          return callback(err);
        }
        if (!model) {
          debug(`No homes found with slug '${slug}'`);
          return callback(new NotFound('home not found'));
        }
        this.result.model = model;
        this.result.models = [model];
        this.result.home = model;
        this.result.homeJson = model.toJSON();
        this._loadedModel = model;
        callback();
      });
    });

    return this;
  }

  findByNeighborhood(neighborhood) {
    let query = {
      deletedAt: null,
      'location.neighborhood': neighborhood
    };

    this._queries.push((callback) => {
      let cursor = this.Model.find(query);
      this._configurePopulationForCursor(cursor);
      cursor.exec((err, homes) => {
        if (err) {
          debug('Got error', err);
          return callback(err);
        }
        if (!homes) {
          homes = [];
        }

        this.result.models = homes;
        this.result.homes = homes;
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
          return callback(new NotFound('home not found'));
        }
        this.result.model = model;
        this.result.models = [model];
        this.result.home = model;
        this.result.homeJson = model.toJSON();
        this._loadedModel = model;
        callback();
      });
    });

    return this;
  }
}
