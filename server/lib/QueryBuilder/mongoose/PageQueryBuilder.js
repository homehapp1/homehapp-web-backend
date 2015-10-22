import BaseQueryBuilder from './BaseQueryBuilder';
import {NotFound} from '../../Errors';
let debug = require('debug')('PageQueryBuilder');

export default class PageQueryBuilder extends BaseQueryBuilder {
  constructor(app) {
    super(app, 'Page');
  }

  findBySlug(slug) {
    this._queries.push((callback) => {
      let cursor = this.Model.findOne({
        slug: slug,
        deletedAt: null
      });
      this._configurePopulationForCursor(cursor);
      cursor.exec((err, content) => {
        if (err) {
          debug('Got error', err);
          return callback(err);
        }
        if (!content) {
          debug('No content found');
          return callback(new NotFound('Page not found'));
        }
        debug('findBySlug', content.title);

        this._loadedModel = content;
        this.result.model = content;
        this.result.models = [content];
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
          return callback(new NotFound('Page page not found'));
        }
        this.result.model = model;
        this.result.models = [model];
        this._loadedModel = model;
        callback();
      });
    });

    return this;
  }
}
