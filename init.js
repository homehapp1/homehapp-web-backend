'use strict';

require('babel/register')({
  optional: ['es7.classProperties', 'es7.decorators']
});

var projectName = 'site';
if (process.env.PROJECT_NAME && process.env.PROJECT_NAME !== 'undefined') {
  projectName = process.env.PROJECT_NAME;
}

if (process.argv.length > 2 && process.argv[2] == 'migrate') {
  var migrator = require('./server/migrator');
  module.exports = migrator;
  var args = [projectName].concat(process.argv.slice(3));
  migrator.run.apply(null, args);
} else {
  var app = require('./server/app');
  module.exports = app;
  app.run(projectName);
}
