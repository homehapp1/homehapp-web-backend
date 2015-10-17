

import BaseQueryBuilder from './BaseQueryBuilder';
import {NotFound} from '../../Errors';
// let debug = require('debug')('ContactQueryBuilder');

export default class ContactQueryBuilder extends BaseQueryBuilder {
  constructor(app) {
    super(app, 'Contact');
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
          return callback(new NotFound('Contact request not found'));
        }
        this.result.model = model;
        this.result.models = [model];
        this.result.contact = model;
        this.result.contactJson = model.toJSON();
        this._loadedModel = model;
        callback();
      });
    });

    return this;
  }
}
