'use strict';

import moment from 'moment';
import bcrypt from 'bcrypt';
import { loadCommonPlugins, commonJsonTransform, populateMetadata } from './common';

let getSalt = function () {
  let salt = bcrypt.genSaltSync(10);
  return salt;
};

let calculateHash = function (password, salt) {
  let hash = bcrypt.hashSync(password, salt);
  return hash;
};

exports.loadSchemas = function (mongoose, next) {
  let Schema = mongoose.Schema;
  //let ObjectId = Schema.Types.ObjectId;

  let schemas = {};

  schemas.User = new Schema(populateMetadata({
    uuid: {
      type: String,
      index: true,
      unique: true
    },
    firstname: {
      type: String
    },
    lastname: {
      type: String
    },
    _email: {
      type: String
    },
    // Authentication related
    username: {
      type: String,
      index: true,
      unique: true
    },
    _salt: {
      type: String
    },
    _saltAlg: {
      type: String,
      default: 'default'
    },
    _password: {
      type: String
    },
    _passwordSetAt: {
      type: Date
    },
    _lastLogin: {
      type: Date
    },
    _accessLevel: {
      type: String,
      default: 'user'
    },
    active: {
      type: Boolean,
      index: true,
      default: true
    }
  }));

  schemas.User.virtual('displayName').get(function () {
    if (!this.firstname || !this.lastname) {
      return this.username;
    }
    return [this.firstname, this.lastname].join(' ');
  });
  schemas.User.virtual('name').get(function () {
    if (!this.firstname || !this.lastname) {
      return this.username;
    }
    return [this.firstname, this.lastname].join(' ');
  });
  schemas.User.virtual('rname').get(function () {
    if (!this.firstname || !this.lastname) {
      return this.username;
    }
    return [this.lastname, this.firstname].join(', ');
  });
  schemas.User.virtual('password').set(function (password) {
    this._salt = getSalt();
    this._password = calculateHash(password, this._salt);
    this._passwordSetAt = moment().utc().toDate();
  });
  schemas.User.virtual('email').get(function() {
    return this._email;
  });
  schemas.User.virtual('email').set(function (email) {
    email = email.toLowerCase();
    if (!schemas.User.methods.isValidEmail(email)) {
      throw new Exception('Invalid email given');
    }
    this._email = email;
    this.username = email;
  });
  schemas.User.methods.isValidPassword = function (password) {
    if (!this._password) {
      return false;
    }
    if (this._password === calculateHash(password, this._salt)) {
      return true;
    }
    return false;
  };
  schemas.User.methods.isValidEmail = function (email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
  };

  schemas.User.statics.editableFields = function () {
    return [
      'firstname', 'lastname', 'email'
    ];
  };

  Object.keys(schemas).forEach((name) => {
    loadCommonPlugins(schemas[name], name, mongoose);
    schemas[name].options.toJSON.transform = (doc, ret) => {
      return commonJsonTransform(ret);
    };
  });

  next(schemas);
};
