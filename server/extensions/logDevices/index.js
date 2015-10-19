

let debug = require('debug')('Extension:logDevices');

/*
 * Collect client information from custom HTTP headers
 * Used for statistics
 */

export function register(app, config) {
  if (!config) {
    return Promise.resolve();
  }

  app.use((req, res, next) => {
    req.clientInfo = {
      platform: null
    };

    if (!config.clientHeader) {
      return next();
    }
    let headerValue = req.headers[config.clientHeader.toLowerCase()];
    if (!headerValue) {
      return next();
    }

    // Format: platform/manufacturer;deviceType;model;OS version/deviceID/deviceLanguageCode
    // Example: IOS/Apple;iPhone Simulator;x86_64;8.4.0/C9853654-3EBF-4BB5-9039-23DD0404A968/en
    let formatRegExp = new RegExp(
      /(\w+)\/(\w+)\;([^;]+)\;([^;]+)\;([^;]+)\/([\w]{8}(-[\w]{4}){3}-[\w]{12})\/(\w+)/i
    );
    let matches = formatRegExp.exec(headerValue);

    if (!matches) {
      return next();
    }

    req.clientInfo = {
      platform: matches[1],
      manufacturer: matches[2],
      deviceType: matches[3],
      model: matches[4],
      osVersion: matches[5],
      deviceID: matches[6],
      languageCode: matches[8]
    };

    next();
  });

  app.logDevices = function (req, res, next) {
    debug('device logging performed (not implemented)');
    next();
  };

  return Promise.resolve();
}
