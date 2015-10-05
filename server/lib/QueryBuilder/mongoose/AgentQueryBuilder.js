'use strict';

import BaseQueryBuilder from './BaseQueryBuilder';
import {NotFound} from '../../Errors';
let debug = require('debug')('AgentQueryBuilder');

export default class AgentQueryBuilder extends BaseQueryBuilder {
  constructor(app) {
    super(app, 'Agent');
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
          debug(`No agents found with slug '${slug}'`);
          return callback(new NotFound('agent not found'));
        }
        this.result.agent = model;
        this.result.agentJson = model.toJSON();
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
      this.Model.find(query, (err, agents) => {
        if (err) {
          debug('Got error', err);
          return callback(err);
        }
        if (!agents) {
          agents = [];
        }

        this.result.models = agents;
        this.result.agents = agents;
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
          return callback(new NotFound('agent not found'));
        }
        this.result.agent = model;
        this.result.agentJson = model.toJSON();
        this._loadedModel = model;
        callback();
      });
    });

    return this;
  }
}
