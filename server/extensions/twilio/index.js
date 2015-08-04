'use strict';

import twilio from 'twilio';
import {merge} from '../../lib/Helpers';

let debug = require('debug')('Extension:twilio');

export function register(app, config) {
  if (!config.sig || !config.token) {
    return Promise.resolve();
  }

  let client = app.twilio = twilio(config.sid, config.token);

  return Promise.resolve();
}
