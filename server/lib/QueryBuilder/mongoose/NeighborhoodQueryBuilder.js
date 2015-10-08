'use strict';

import BaseQueryBuilder from './BaseQueryBuilder';
import {NotFound} from '../../Errors';
let debug = require('debug')('NeighborhoodQueryBuilder');

export default class NeighborhoodQueryBuilder extends BaseQueryBuilder {
  constructor(app) {
    super(app, 'Neighborhood');
  }

  initialize() {
  }

  findByCity(city) {
    this._queries.push((callback) => {
      let query = {
        'location.city': city,
        deletedAt: null
      };

      if (typeof city === 'string') {
        query = {
          'location.city.slug': city,
          deletedAt: null
        };
      }
      let cursor = this.Model.find(query);
      this._configurePopulationForCursor(cursor);
      cursor.exec((err, neighborhoods) => {
        debug(`findByCity found ${neighborhoods.length} neighborhoods`);
        if (err) {
          debug('Got error', err);
          return callback(err);
        }
        if (!neighborhoods) {
          debug('No neighborhoods were found');
          neighborhoods = [];
        }

        this._loadedModel = neighborhoods;
        this.result.models = neighborhoods;
        this.result.modelsJson = JSON.stringify(neighborhoods.map((neighborhood) => {
          return neighborhood.toJson();
        }));
        this.result.neighborhoods = neighborhoods;
        callback();
      });
    });

    return this;
  }

  findBySlug(slug) {
    this._queries.push((callback) => {
      let cursor = this.Model.findOne({
        slug: slug,
        deletedAt: null
      });
      this._configurePopulationForCursor(cursor);
      cursor.exec((err, neighborhood) => {
        debug('findBySlug');
        if (err) {
          debug('Got error', err);
          return callback(err);
        }
        if (!neighborhood) {
          debug(`No neighborhood found with slug '${slug}'`);
          return callback(new NotFound('Neighborhood not found'));
        }
        debug(`Found Neighborhood ${neighborhood.title} (${neighborhood._id})`);

        this._loadedModel = neighborhood;
        this.result.model = neighborhood;
        this.result.models = [neighborhood];
        this.result.neighborhood = neighborhood;
        callback();
      });
    });

    return this;
  }

  findByUuid(uuid) {
    this._queries.push((callback) => {
      let cursor = this.Model.findOne({
        uuid: uuid,
        deletedAt: null
      });
      this._configurePopulationForCursor(cursor);
      cursor.exec((err, model) => {
        if (err) {
          return callback(err);
        }
        if (!model) {
          return callback(new NotFound('neighborhood not found'));
        }
        this.result.model = model;
        this.result.models = [model];
        this.result.neighborhood = model;
        this.result.neighborhoodJson = model.toJSON();
        this._loadedModel = model;
        callback();
      });
    });

    return this;
  }
}
