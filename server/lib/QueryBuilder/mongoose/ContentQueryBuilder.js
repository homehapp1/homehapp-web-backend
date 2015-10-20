import BaseQueryBuilder from './BaseQueryBuilder';
import {NotFound} from '../../Errors';
let debug = require('debug')('ContentQueryBuilder');

export default class ContentQueryBuilder extends BaseQueryBuilder {
  constructor(app) {
    super(app, 'Content');
  }

  findBySlug(slug) {
    this._queries.push((callback) => {
      let cursor = this.Model.findOne({
        slug: slug,
        deletedAt: null
      });
      this._configurePopulationForCursor(cursor);
      cursor.exec((err, content) => {
        debug('findBySlug', content.title);
        if (err) {
          debug('Got error', err);
          return callback(err);
        }
        if (!content) {
          debug('No content found');
          return callback(new NotFound('Content not found'));
        }

        this._loadedModel = content;
        this.result.model = content;
        this.result.models = [content];
        this.result.content = content;
        callback();
      });
    });

    return this;
  }

  initialize() {
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
          return callback(new NotFound('Content page not found'));
        }
        this.result.model = model;
        this.result.models = [model];
        this.result.content = model;
        this.result.contentJson = model.toJSON();
        this._loadedModel = model;
        callback();
      });
    });

    return this;
  }
}
