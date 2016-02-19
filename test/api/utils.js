'use strict';

import app from '../../server/app';
import QueryBuilder from '../../server/lib/QueryBuilder';
import MockupData from '../MockupData';

import request from 'supertest';
let config = require('../../config/api/defaults')();
let mockup = null;

const TEST_USER_DATA = exports.TEST_USER_DATA = {
  email: 'test@qvik.fi',
  username: 'test',
  password: 'test'
};

let createApp = exports.createApp = (done) => {
  app.run('api', (appInstance) => {
    appInstance.QB = new QueryBuilder(appInstance);
    let token = null;

    appInstance.userId = null;

    // Create a basic request that does not have the expected set of headers
    appInstance.basicRequest = function basicRequest(method, url, version = null) {
      if (typeof request(appInstance)[method] !== 'function') {
        throw new Error(`Invalid method '${method}'`);
      }

      let r = request(appInstance)[method](url);

      if (version) {
        r.set('X-Homehapp-Api-Version', version);
      }

      return r;
    };

    // Basic mobile request without authentication, but uses the other required headers
    appInstance.mobileRequest = function mobileRequest(method, url, version = null) {
      let r = appInstance.basicRequest(method, url, version)
      .set('X-Homehapp-Client', 'IOS/Apple;Tester;x86_64;8.4.0/C9853654-3EBF-4BB5-9039-23DD0404A968/en')
      .set('X-Homehapp-Api-Key', config.security.requiredHeaders.valueMatch['X-Homehapp-Api-Key']);
      return r;
    };

    // Authenticated request that uses all the correct headers
    appInstance.authRequest = function authRequest(method, url, version = null) {
      let r = appInstance.mobileRequest(method, url, version)
      .set('X-Homehapp-Auth-Token', token);
      return r;
    };

    // Create the mockup user
    appInstance.mockup = new MockupData(appInstance);
    appInstance.mockup.removeAll('User')
    .then(() => {
      return appInstance.mockup.createModel('User');
    })
    .then((user) => {
      let tokenData = appInstance.authentication.createTokenForUser(user);
      token = tokenData.token;

      appInstance.user = user;

      appInstance.QB
      .forModel('User')
      .findById(user.id)
      .setExtraData({
        _checkId: tokenData.checkId
      })
      .update({})
      .then(() => {
        done(null, appInstance);
      })
      .catch((err) => {
        console.error('Failed to update user token', err);
        done(err);
      });
    })
    .catch((err) => {
      console.error('Failed to delete users', err);
      done(err);
    });
  });
};
