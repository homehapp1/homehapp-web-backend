'use strict';

import BaseQueryBuilder from './BaseQueryBuilder';
import {NotFound} from '../../Errors';
import async from 'async';

class CityQueryBuilder extends BaseQueryBuilder {
  constructor(app) {
    super(app, 'City');
  }

  initialize() {
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
        this.result.cities = models;
        this.result.citiesJson = models.map(city => {
          return city.toJSON();
        });
        callback();
      });
    });

    return this;
  }

  findBySlug(slug) {
    this.queries.push((callback) => {
      this.Model.findOne({
        slug: slug,
        deletedAt: null
      }, (err, model) => {
        if (err) {
          return callback(err);
        }
        if (!model) {
          return callback(new NotFound('city not found'));
        }
        this.result.city = model;
        this.result.cityJson = model.toJSON();
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
          return callback(new NotFound('city not found'));
        }
        this.result.city = model;
        this.result.cityJson = model.toJSON();
        this._loadedModel = model;
        callback();
      });
    });

    return this;
  }
}

export default CityQueryBuilder;
