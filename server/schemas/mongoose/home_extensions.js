import {randomString} from '../../lib/Helpers';

var generateUniqueSlug = function (home, cb, iteration) {
  if (iteration > 10) {
    return cb(new Error('iteration overflow'));
  }

  home.slug = randomString(8);

  home.constructor.count({slug: home.slug, deletedAt: null}, function (err, count) {
    if (err) {
      return cb(err);
    }
    // slug is unique
    if (count === 0) {
      return cb();
    }
    // slug is not unique
    generateUniqueSlug(home, cb, (iteration || 0) + 1);
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
    },

    updateActionState(type, user) {
      return new Promise((resolve, reject) => {
        let HomeAction = this.db.model('HomeAction');

        switch (type) {
          case 'like':
            if (this.likes.users.indexOf(user.uuid) !== -1) {
              // User has already liked this home
              HomeAction.remove({
                type: type,
                home: this.id,
                user: user.id
              }).exec((err) => {
                if (err) {
                  return reject(err);
                }
                this.likes.users = this.likes.users.filter((uuid) => {
                  return uuid !== user.uuid;
                });
                this.likes.total = this.likes.total - 1;
                this.saveAsync().then(() => {
                  resolve({
                    status: false,
                    data: {
                      likes: this.likes
                    }
                  });
                }).catch(reject);
              });
            } else {
              // New like from User
              let action = new HomeAction({
                type: type,
                home: this.id,
                user: user.id
              });
              action.save((err) => {
                if (err) {
                  return reject(err);
                }
                this.likes.users.push(user.uuid);
                this.likes.total = this.likes.total + 1;
                this.saveAsync().then(() => {
                  resolve({
                    status: true,
                    data: {
                      likes: this.likes
                    }
                  });
                }).catch(reject);
              });
            }
            break;
          default:
            return reject(new Error(`unknown action type '${type}'`));
        }
      });
    }

  });
};
