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
          debug(`No agents found with slug '${slug}'`);
          return callback(new NotFound('agent not found'));
        }
        this.result.agent = model;
        this.result.agentJson = model.toJSON();
        this.result.model = model;
        this.result.models = [model];
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
      cursor.exec((err, agents) => {
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
          return callback(new NotFound('agent not found'));
        }
        this.result.model = model;
        this.result.models = [model];
        this.result.agent = model;
        this.result.agents = [model];
        this.result.agentJson = model.toJSON();
        this._loadedModel = model;
        callback();
      });
    });

    return this;
  }
}
