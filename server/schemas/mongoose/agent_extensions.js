'use strict';
import { urlName } from '../../lib/UrlName';

var generateUniqueSlug = function (agent, cb, iteration) {
  if (iteration > 10) {
    return cb(new Error('iteration overflow'));
  }
  agent.slug = urlName(agent.title);

  if (iteration) {
    agent.slug += `-${iteration}`;
  }

  agent.constructor.count({slug: agent.slug, deletedAt: null}, function (err, count) {
    if (err) {
      return cb(err);
    }
    // slug is unique
    if (count === 0) {
      return cb();
    }
    // slug is not unique
    generateUniqueSlug(agent, cb, (iteration || 0) + 1);
  });
};

exports.extendSchema = function (schema) {
  // Generate slug
  schema.pre('validate', function (next) {
    if (!this.slug && this.isNew) {
      generateUniqueSlug(this, next, 0);
    } else {
      next();
    }
  });

  require('util')._extend((schema.methods || {}), {
    /**
    * Request ACL implementations
    **/
    is(user, requirements, done) {
      var status = false;
      done(null, status);
    },
    can(user, requirement, done) {
      done(null, false);
    }
  });
};
