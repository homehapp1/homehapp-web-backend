

import moment from 'moment';
import Errors from '../../lib/Errors';
import {generateUUID} from '../../lib/Helpers';

// Update models createdAt value on save
// if model has the field and it is not set yet
exports.createdAt = (schema, options) => {
  if (!schema.path('createdAt')) {
    return;
  }
  schema.pre('save', function (next) {
    if (!this.createdAt) {
      this.createdAt = moment().millisecond(0).utc().toDate();
    }
    next();
  });
  if (options && options.index) {
    schema.path('createdAt').index(options.index);
  }
};

// Update models updatedAt value on save if model has the field
exports.lastModified = (schema, options) => {
  if (!schema.path('updatedAt')) {
    return;
  }
  schema.pre('save', function (next) {
    this.updatedAt = moment().millisecond(0).utc().toDate();
    next();
  });
  if (options && options.index) {
    schema.path('updatedAt').index(options.index);
  }
};

// Generate and set UUID for model has the field and it is not set yet
exports.uuid = (schema, options) => {
  if (!schema.path('uuid')) {
    return;
  }

  schema.pre('save', function (next) {
    if (!this.uuid) {
      this.uuid = generateUUID();
    }
    next();
  });
  if (options && options.index) {
    schema.path('uuid').index(options.index);
  }
};

exports.multiSet = schema => {
  schema.methods.multiSet = function (obj, allowedFields, ignoreMissing = true) {
    if (!allowedFields) {
      return;
    }
    if (!Array.isArray(allowedFields)) {
      return;
    }
    let i = allowedFields.indexOf('id');
    if (i !== -1) {
      allowedFields.splice(i, 1);
    }
    i = allowedFields.indexOf('_id');
    if (i !== -1) {
      allowedFields.splice(i, 1);
    }
    allowedFields.forEach(field => {
      if ((typeof obj[field] !== 'undefined' && ignoreMissing) || !ignoreMissing) {
        this.set(field, obj[field]);
      }
    });
  };
};

exports.aclEnableIS = (schema, options) => {
  if (!options) {
    return;
  }
  if (!options.requestModelName) {
    return;
  }

  schema.statics.reqUserIs = function(requirements) {
    return function(req, res, next) {
      if (!req.user) {
        return next(new Errors.Forbidden('not enough permissions'));
      }
      if (!requirements) {
        return next();
      }
      if (!Array.isArray(requirements)) {
        requirements = [requirements];
      }

      let reqModel = req[options.requestModelName];
      if (!reqModel) {
        console.warn(`no request model ${options.requestModelName} found`);
        return next();
      }
      if (typeof reqModel.is !== 'function') {
        console.warn(`ACL: No is(user, requirements, done) -method defined for request model ${options.requestModelName}`);
        return next();
      }
      reqModel.is(req.user, requirements, (err, status) => {
        if (err) {
          return next(err);
        }
        if (!status) {
          return next(new Errors.Forbidden('not enough permissions'));
        }
        next();
      });
    };
  };
};

exports.aclEnableCAN = (schema, options) => {
  if (!options) {
    return;
  }
  if (!options.requestModelName) {
    return;
  }

  schema.statics.reqUserCan = function(requirement, withRequest = false) {
    return function(req, res, next) {
      if (!req.user) {
        return next(new Errors.Forbidden('not enough permissions'));
      }
      if (!requirement) {
        return next();
      }
      let reqModel = req[options.requestModelName];
      if (!reqModel) {
        console.warn(`no request model ${options.requestModelName} found`);
        return next();
      }

      let method = 'can';
      if (withRequest) {
        method = 'canRequest';
      }

      if (typeof reqModel[method] !== 'function') {
        console.warn(`ACL: No ${method}(user, requirement, done) -method defined for request model ${options.requestModelName}`);
        return next();
      }

      let args = [req.user, requirement];
      if (withRequest) {
        args = [req, req.user, requirement];
      }

      args.push((err, status) => {
        if (err) {
          return next(err);
        }
        if (!status) {
          return next(new Errors.Forbidden('not enough permissions'));
        }
        next();
      });

      reqModel[method].apply(reqModel, args);
    };
  };
};

exports.enableACL = (schema, options) => {
  if (!options) {
    return;
  }
  if (!options.requestModelName) {
    return;
  }
  exports.aclEnableIS(schema, options);
  exports.aclEnableCAN(schema, options);
};
