

import winston from 'winston';
import expressWinston from 'express-winston';
import {getEnvironmentValue} from '../../Helpers';
import path from 'path';

exports.configure = function(app/*, config = {}*/) {

  app.googleCallbacks = app.googleCallbacks || {
    onStop: null,
    onStart: null
  };

  let fileLogPath = getEnvironmentValue('LOG_PATH', null);
  if (fileLogPath) {
    app.use(expressWinston.logger({
      transports: [
        new winston.transports.Console({
          json: false
        }),
        new winston.transports.File({
          filename: path.join(fileLogPath, 'request.log')
        })
      ],
      expressFormat: true
    }));
  }

  // Respond to Google Health Checks
  app.get('/_ah/health', function(req, res) {
    res.status(200)
      .set('Content-Type', 'text/plain')
      .send('ok');
  });

  // app.get('/_ah/start', function(req, res) {
  //   if (app.googleCallbacks.onStart) {
  //     app.googleCallbacks.onStart(req);
  //   }
  //   res.status(200)
  //     .set('Content-Type', 'text/plain')
  //     .send('ok');
  // });
  //
  // app.get('/_ah/stop', function(req, res) {
  //   app.log.info('Stopping as per instruction from google')
  //   if (app.googleCallbacks.onStop) {
  //     app.googleCallbacks.onStop(req);
  //   }
  //   res.status(200)
  //     .set('Content-Type', 'text/plain')
  //     .send('ok');
  // });

  return Promise.resolve();
};
