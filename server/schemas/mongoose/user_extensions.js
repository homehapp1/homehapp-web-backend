exports.extendSchema = function (schema) {
  require('util')._extend((schema.methods || {}), {
    /**
    * Request ACL implementations
    **/
    is(user, requirements, done) {
      var status = false;
      requirements.forEach((requirementKey) => {
        if (requirementKey === 'creator' || requirementKey === 'self') {
          requirementKey = '_id';
        }
        let compId = this[requirementKey];
        if (requirementKey !== '_id') {
          if (this[requirementKey]._id) {
            compId = this[requirementKey]._id;
          }
        }
        if (compId.toString() === user._id.toString()) {
          status = true;
        }
      });
      done(null, status);
    },
    can(user, requirement, done) {
      if (requirement === 'edit' || requirement === 'modify') {
        return this.is(user, ['self'], done);
      }
      done(null, false);
    }
  });
};
