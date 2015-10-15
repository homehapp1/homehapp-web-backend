'use strict';

import QueryBuilder from '../../../lib/QueryBuilder';

exports.registerRoutes = (app) => {
  const QB = new QueryBuilder(app);

  // app.get('/api/users', function(req, res, next) {
  //
  //   QB
  //   .forModel('User')
  //   .parseRequestArguments(req)
  //   .findAll()
  //   .fetch()
  //   .then((result) => {
  //     res.json({
  //       status: 'ok', users: result.users
  //     });
  //   })
  //   .catch(next);
  //
  // });
  //
  // app.get('/api/users/:idOrUsername', function(req, res, next) {
  //
  //   QB
  //   .forModel('User')
  //   .findByIdOrUsername(req.params.idOrUsername)
  //   .fetch()
  //   .then((result) => {
  //     res.json({
  //       status: 'ok', user: result.user
  //     });
  //   })
  //   .catch(next);
  //
  // });
  //
  // app.put('/api/users/:uuid', function(req, res, next) {
  //   let data = req.body.user;
  //
  //   QB
  //   .forModel('User')
  //   .findByUuid(req.params.uuid)
  //   .update(data)
  //   .then((user) => {
  //     res.json({
  //       status: 'ok', user: user
  //     });
  //   })
  //   .catch(next);
  //
  // });
  //
  // app.post('/api/users', function(req, res, next) {
  //   let data = req.body.user;
  //
  //   QB
  //   .forModel('User')
  //   .create(data, {context: {
  //     internal: true
  //   }})
  //   .then((result) => {
  //     res.json({
  //       status: 'ok', user: result
  //     });
  //   })
  //   .catch(next);
  //
  // });

};
