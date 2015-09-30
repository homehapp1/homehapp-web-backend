'use strict';

import BaseQueryBuilder from './BaseQueryBuilder';
import CityQueryBuilder from './CityQueryBuilder';
import {NotFound} from '../../Errors';
import async from 'async';
let debug = require('debug')('app');

class NeighborhoodQueryBuilder extends BaseQueryBuilder {
  constructor(app) {
    super(app, 'Neighborhood');
  }

  initialize() {
  }

  findByCity(city) {
    if (typeof city.id !== 'undefined') {
      return this.findByCity(city.id);
    }
    this._queries.push((callback) => {
      this.Model.find({
        'location.city': city,
        deletedAt: null
      }, (err, neighborhoods) => {
        debug('findByCity', neighborhoods);
        if (err) {
          debug('Got error', err);
          return callback(err);
        }
        if (!neighborhoods) {
          debug('No neighborhoods were found');
          return callback(new NotFound('Neighborhoods not found'));
        }

        this._loadedModel = neighborhoods;
        this.result.models = neighborhoods;
        this.result.neighborhoods = neighborhoods;
        callback();
      });
    });

    return this;
  }

  findBySlug(slug) {
    this._queries.push((callback) => {
      this.Model.findOne({
        slug: slug,
        deletedAt: null
      }, (err, neighborhood) => {
        debug('findBySlug', neighborhood);
        if (err) {
          debug('Got error', err);
          return callback(err);
        }
        if (!neighborhood) {
          debug('No neighborhood found');
          return callback(new NotFound('Neighborhood not found'));
        }

        this._loadedModel = neighborhood;
        this.result.models = [neighborhood];
        this.result.neighborhood = neighborhood;
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
