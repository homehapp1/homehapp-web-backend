'use strict';

import BaseQueryBuilder from './BaseQueryBuilder';
import {NotFound} from '../../Errors';
import async from 'async';

class UserQueryBuilder extends BaseQueryBuilder {
  constructor(app) {
    super(app, 'User');
  }

  initialize() {
  }

  findAll() {
    this._queries.push((callback) => {
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

      cursor.exec((err, users) => {
        if (err) {
          return callback(err);
        }
        this.result.users = users;
        this.result.usersJson = users.map(user => {
          return user.toJSON();
        });
        callback();
      });
    });

    return this;
  }

  findById(id) {
    this._queries.push((callback) => {
      this.Model.findById(id, (err, user) => {
        if (err) {
          return callback(err);
        }
        if (!user) {
          return callback(new NotFound('user not found'));
        }
        this.result.user = user;
        this.result.userJson = user.toJSON();
        this._loadedModel = user;
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
      }, (err, user) => {
        if (err) {
          return callback(err);
        }
        if (!user) {
          return callback(new NotFound('user not found'));
        }
        this.result.user = user;
        this.result.userJson = user.toJSON();
        this._loadedModel = user;
        callback();
      });
    });

    return this;
  }

  findByUsername(username) {
    this._queries.push((callback) => {
      this.Model.findOne({
        username: username,
        deletedAt: null
      }).exec((err, user) => {
        if (err) {
          return callback(err);
        }

        if (!user) {
          return callback(new NotFound('user not found'));
        }

        this.result.user = user;
        this.result.userJson = user.toJSON();
        this._loadedModel = user;

        callback();
      });
    });

    return this;
  }

  findByIdOrUsername(idOrUsername) {
    this._queries.push((callback) => {
      async.seq(
        (cb) => {
          this.Model.findOne({
            uuid: idOrUsername,
            deletedAt: null
          }).exec((err, user) => {
            cb(err, user);
          });
        },

        (user, cb) => {
          if (user) {
            return cb(null, user);
          }
          this.Model.findOne({
            username: idOrUsername,
            deletedAt: null
          }).exec((err, user2) => {
            cb(err, user2);
          });
        }
      )((err, user) => {
        if (err) {
          return callback(err);
        }

        if (!user) {
          return callback(new NotFound('user not found'));
        }

        this.result.user = user;
        this.result.userJson = user.toJSON();
        this._loadedModel = user;

        callback();
      });
    });

    return this;
  }
}

module.exports = UserQueryBuilder;
