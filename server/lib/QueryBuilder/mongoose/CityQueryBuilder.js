import BaseQueryBuilder from './BaseQueryBuilder';
import {NotFound} from '../../Errors';
let debug = require('debug')('CityQueryBuilder');

export default class CityQueryBuilder extends BaseQueryBuilder {
  constructor(app) {
    super(app, 'City');
  }

  findBySlug(slug) {
    this._queries.push((callback) => {
      let cursor = this.Model.findOne({
        slug: slug,
        deletedAt: null
      });
      this._configurePopulationForCursor(cursor);
      cursor.exec((err, city) => {
        if (err) {
          debug('Got error', err);
          return callback(err);
        }
        if (!city) {
          debug('No city found');
          return callback(new NotFound('City not found'));
        }

        this._loadedModel = city;
        this.result.model = city;
        this.result.models = [city];
        this.result.city = city;
        callback();
      });
    });

    return this;
  }

  initialize() {
  }
}
