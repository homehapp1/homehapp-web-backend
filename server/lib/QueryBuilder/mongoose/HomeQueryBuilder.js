'use strict';

import BaseQueryBuilder from './BaseQueryBuilder';
import {NotFound} from '../../Errors';
import async from 'async';
let debug = require('debug')('app');

class HomeQueryBuilder extends BaseQueryBuilder {
  constructor(app) {
    super(app, 'Home');
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
          return callback(new NotFound('home not found'));
        }
        this.result.home = model;
        this.result.homeJson = model.toJSON();
        this._loadedModel = model;
        callback();
      });
    });

    return this;
  }

  findByNeighborhood(neighborhood) {
    if (typeof neighborhood.id !== 'undefined') {
      return this.findByNeighborhood(neighborhood.id);
    }

    this._queries.push((callback) => {
      this.Model.find({
        'location.neighborhood': neighborhood,
        deletedAt: null
      }, (err, homes) => {
        debug('findByNeighborhood', homes);
        if (err) {
          debug('Got error', err);
          return callback(err);
        }
        if (!homes) {
          debug('No homes found');
          return callback(new NotFound('Homes not found'));
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
      this.Model.findOne({
        uuid: uuid,
        deletedAt: null
      }, (err, model) => {
        if (err) {
          return callback(err);
        }
        if (!model) {
          return callback(new NotFound('home not found'));
        }
        this.result.home = model;
        this.result.homeJson = model.toJSON();
        this._loadedModel = model;
        callback();
      });
    });

    return this;
  }
}

export default HomeQueryBuilder;
