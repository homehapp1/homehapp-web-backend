'use strict';

import winston from 'winston';
import {merge} from './Helpers';

class Logger {
  constructor(config) {
    this.config = merge({
      Console: {
        enabled: true
      }
    }, config);
    this.transports = winston.transports;
  }

  addTransport(name, implementation) {
    if (this.transports[name]) {
      return false;
    }
    if (!implementation) {
      return false;
    }
    this.transports[name] = implementation;
  }

  configure(app) {
    winston.exitOnError = false;
    this.logger = new (winston.Logger)({
      exitOnError: false
    });
    this.logger.handleExceptions(
      new winston.transports.Console({prettyPrint: true})
    );

    Object.keys(this.config).forEach((loggerName) => {
      let loggerConfig = this.config[loggerName];
      loggerConfig.exitOnError = false;
      loggerConfig.timestamp = true;

      if (!loggerConfig.enabled) {
        return;
      }

      if (!this.transports[loggerName]) {
        console.warn(`Unable to load logger for transport ${loggerName}.`);
        return;
      }

      this.logger.add(this.transports[loggerName], loggerConfig);
    });

    app.log = this.logger;

    return Promise.resolve();
  }
}

export default Logger;
