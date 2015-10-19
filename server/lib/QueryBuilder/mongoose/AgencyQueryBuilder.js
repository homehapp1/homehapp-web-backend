

import BaseQueryBuilder from './BaseQueryBuilder';
import {NotFound} from '../../Errors';
let debug = require('debug')('AgencyQueryBuilder');

export default class AgencyQueryBuilder extends BaseQueryBuilder {
  constructor(app) {
    super(app, 'Agency');
  }

  findBySlug(slug) {
    this._queries.push((callback) => {
      let cursor = this.Model.findOne({
        slug: slug,
        deletedAt: null
      });
      this._configurePopulationForCursor(cursor);
      cursor.exec((err, agency) => {
        debug('findBySlug', agency.title);
        if (err) {
          debug('Got error', err);
          return callback(err);
        }
        if (!agency) {
          debug('No agency found');
          return callback(new NotFound('Agency not found'));
        }

        this._loadedModel = agency;
        this.result.model = agency;
        this.result.models = [agency];
        this.result.agency = agency;
        callback();
      });
    });

    return this;
  }

  initialize() {
  }
}
