'use strict';

import Fixtures from './fixtures';

let debug = require('debug')('MongooseMigrator.Action.Init');

let initCollections = function initCollections(migrator, args) {
  debug('initCollections');
  let applyFixtures = false;
  if (args.indexOf('applyFixtures') !== -1) {
    applyFixtures = true;
  }

  if (!applyFixtures) {
    return Promise.resolve();
  }

  return Fixtures.populate(migrator);
};

module.exports = function(migrator, args) {
  debug('init action promise', args);
  return initCollections(migrator, args);
};
