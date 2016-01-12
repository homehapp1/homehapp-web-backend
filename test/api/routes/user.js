'use strict';

import should from 'should';
import expect from 'expect.js';

import testUtils from '../utils';
import MockupData from '../../MockupData';

let app = null;
let debug = require('debug')('Home API paths');

describe('Home API paths', () => {
  before((done) => {
    testUtils.createApp((err, appInstance) => {
      app = appInstance;
      done(err);
    });
  });

  let body = null;
  let home = null;

  it('Should deny basic HTTP request without added headers', (done) => {
    app.basicRequest('get', '/api/auth/check')
    .expect(403)
    .end((err, res) => {
      should.not.exist(err);
      done();
    });
  });

  it('Should accept the unauthenticated request', (done) => {
    app.mobileRequest('get', '/api/auth/check')
    .expect(403)
    .end((err, res) => {
      should.not.exist(err);
      done();
    });
  });

  it('Should accept the authenticated request', (done) => {
    app.authRequest('get', '/api/auth/check')
    .expect(200)
    .end((err, res) => {
      should.not.exist(err);
      done();
    });
  });

  // it('Should be possible to update the user', (done) => {
  //   app.authRequest('put', '/api/auth/user')
  //   .expect(200)
  //   .end((err, res) => {
  //     done();
  //   });
  // });
});
