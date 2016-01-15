'use strict';

import should from 'should';
import expect from 'expect.js';

import testUtils from '../utils';
import MockupData from '../../MockupData';

let app = null;
let debug = require('debug')('User/Authentication API paths');

describe('User/Authentication API paths', () => {
  let body = null;
  let home = null;
  let user = null;
  let userData = {
    service: 'facebook',
    user: {
      id: 'vapaaradikaali',
      email: 'alerts@kaktus.cc',
      token: 'test-token',
      displayName: 'Test Tester'
    }
  };

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

  it('Should create a new user', (done) => {
    app.mobileRequest('post', '/api/auth/login')
    .send(userData)
    .expect(200)
    .end((err, res) => {
      should.not.exist(err);
      should(res.body).have.property('session');
      should(res.body.session).have.property('user');
      user = res.body.session.user;
      should(user).have.property('id');
      should(res.body).have.property('home');

      home = res.body.home;
      expect(home.createdBy.id).to.be(user.id);
      done();
    });
  });

  it('Should not recreate the same user again', (done) => {
    app.mobileRequest('post', '/api/auth/login')
    .send(userData)
    .expect(200)
    .end((err, res) => {
      should.not.exist(err);
      should(res.body).have.property('session');
      should(res.body.session).have.property('user');
      expect(res.body.session.user.id).to.be(user.id);
      should(res.body.session.user).have.property('id');

      should(res.body).have.property('home');
      expect(res.body.home.createdBy.id).to.be(res.body.session.user.id);
      expect(res.body.home.id).to.be(home.id);
      done();
    });
  });

  // Breaking changes in 1.0.1
  it('Should return a string for 1.0.0', (done) => {
    app.mobileRequest('post', '/api/auth/login', '1.0.0')
    .send(userData)
    .expect(200)
    .end((err, res) => {
      should.not.exist(err);
      should(res.body).have.property('session');
      should(res.body.session).have.property('user');
      expect(res.body.session.user.id).to.be(user.id);
      should(res.body.session.user).have.property('id');

      should(res.body).have.property('home');
      expect(res.body.home.createdBy).to.be(res.body.session.user.id);
      expect(res.body.home.id).to.be(home.id);
      done();
    });
  });

  it('Should be possible to update the user', (done) => {
    let values = {
      user: {
        email: 'lorem@ipsum.net',
        firstname: 'Lorem',
        lastname: 'Ipsum',
        profileImage: {
          url: 'https://www.homehapp.com/',
          alt: 'Test image',
          width: 300,
          height: 300
        },
        contact: {
          address: {
            street: 'Lorem',
            city: 'London',
            zipcode: '01234',
            country: 'GB'
          },
          phone: '+1 23 456 7890'
        }
      }
    };

    app.authRequest('put', '/api/auth/user')
    .send(values)
    .expect(200)
    .end((err, res) => {
      should.not.exist(err);
      should(res.body).have.property('user');
      MockupData.compare(values.user, res.body.user);
      done();
    });
  });
});
