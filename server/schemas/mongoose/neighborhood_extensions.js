'use strict';

var generateUniqueSlug = function (neighorhood, cb, iteration) {
  if (iteration > 10) {
    return cb(new Error('iteration overflow'));
  }

  neighorhood.slug = neighborhood.title.toLowerCase();

  if (iteration) {
    neighborhood.slug += `-${iteration}`;
  }

  neighorhood.constructor.count({slug: neighorhood.slug, deletedAt: null}, function (err, count) {
    if (err) {
      return cb(err);
    }
    // slug is unique
    if (count === 0) {
      return cb();
    }
    // slug is not unique
    generateUniqueSlug(neighorhood, cb, (iteration || 0) + 1);
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
