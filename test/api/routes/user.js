'use strict';

import should from 'should';
import expect from 'expect.js';

import testUtils from '../utils';
import MockupData from '../../MockupData';

let app = null;
let debug = require('debug')('User/Authentication API paths');

describe('User/Authentication API paths', () => {
  before((done) => {
    testUtils.createApp((err, appInstance) => {
      app = appInstance;
      app.mockup.removeAll('Home', {
        '_service.facebook.id': 'vapaaradikaali'
      })
      .then(() => {
        done(err);
      })
      .catch((err) => {
        console.error('Failed to delete homes');
        done(err);
      });
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

  it('Should create a new user', (done) => {
    app.mobileRequest('post', '/api/auth/login')
    .send({
      service: 'facebook',
      user: {
        id: 'vapaaradikaali',
        email: 'alerts@kaktus.cc',
        token: 'test-token',
        displayName: 'Test Tester'
      }
    })
    .expect(200)
    .end((err, res) => {
      should.not.exist(err);
      should(res.body).have.property('session');
      should(res.body.session).have.property('user');
      let user = res.body.session.user;
      should(user).have.property('id');
      should(user).have.property('home');

      let home = user.home;
      expect(home.createdBy).to.be(user.id);
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
