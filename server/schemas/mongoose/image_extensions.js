'use strict';

exports.extendSchema = function (schema) {
  // Generate slug
  schema.pre('validate', function (next) {
    next();
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
