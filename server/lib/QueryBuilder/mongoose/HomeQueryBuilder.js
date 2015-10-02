'use strict';

import BaseQueryBuilder from './BaseQueryBuilder';
import {NotFound} from '../../Errors';
let debug = require('debug')('HomeQueryBuilder');

export default class HomeQueryBuilder extends BaseQueryBuilder {
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
          debug(`No homes found with slug '${slug}'`);
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
    let query = {
      deletedAt: null,
      'location.neighborhood': neighborhood
    };

    this._queries.push((callback) => {
      this.Model.find(query, (err, homes) => {
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
