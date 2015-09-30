'use strict';

import BaseQueryBuilder from './BaseQueryBuilder';
import CityQueryBuilder from './CityQueryBuilder';
import {NotFound} from '../../Errors';
import async from 'async';

class NeighborhoodQueryBuilder extends BaseQueryBuilder {
  constructor(app) {
    super(app, 'Neighborhood');
  }

  initialize() {
  }

  findBySlug(slug) {
    this._queries.push((callback) => {
      this.Model.findOne({
        slug: slug,
        deletedAt: null
      }, (err, model) => {
        if (err) {
          return callback(err);
        }
        if (!model) {
          return callback(new NotFound('neighborhood not found'));
        }
        this.result.neighborhood = model;
        this.result.neighborhoodJson = model.toJSON();
        this._loadedModel = model;
        callback();
      });
    });

    return this;
  }

  findByUuid(uuid) {
    this._queries.push((callback) => {
      this.Model.findOne({
        uuid: uuid,
        deletedAt: null
      }, (err, model) => {
        if (err) {
          return callback(err);
        }
        if (!model) {
          return callback(new NotFound('neighborhood not found'));
        }
        this.result.neighborhood = model;
        this.result.neighborhoodJson = model.toJSON();
        this._loadedModel = model;
        callback();
      });
    });

    return this;
  }
}

export default NeighborhoodQueryBuilder;
