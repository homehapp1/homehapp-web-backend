'use strict';

import should from 'should';
import expect from 'expect.js';

import testUtils from '../utils';
import MockupData from '../../MockupData';

let app = null;
let debug = require('debug')('Home API paths');

import { merge } from '../../../clients/common/Helpers';

describe('Home API paths', () => {
  let body = null;
  let home = null;
  let id = null;

  before((done) => {
    testUtils.createApp((err, appInstance) => {
      app = appInstance;
      app.mockup.removeAll('Home')
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
    app.basicRequest('get', '/api/homes')
    .expect(403)
    .end((err, res) => {
      should.not.exist(err);
      done();
    });
  });

  it('Should accept the unauthenticated request', (done) => {
    app.mobileRequest('get', '/api/homes')
    .expect(200)
    .end((err, res) => {
      should.not.exist(err);
      done();
    });
  });

  it('Should accept the authenticated request', (done) => {
    app.authRequest('get', '/api/homes')
    .expect(200)
    .end((err, res) => {
      should.not.exist(err);
      done();
    });
  });

  it('Should not be possible to create a home without credentials', (done) => {
    home = merge({}, app.mockup.home);
    delete home.slug;

    app.mobileRequest('post', '/api/homes')
    .send(home)
    .expect(403)
    .end((err, res) => {
      should.not.exist(err);
      done();
    });
  });

  it('Should be possible to create a home with credentials', (done) => {
    home = merge({}, app.mockup.home);
    delete home.slug;

    app.authRequest('post', '/api/homes')
    .send(home)
    .expect(200)
    .end((err, res) => {
      home = res.body.home;
      should.not.exist(err);
      id = home.id;
      done();
    });
  });

  it('Should update the home instead of create a new for the authenticated users', (done) => {
    home = merge({}, app.mockup.home);
    delete home.slug;

    app.authRequest('post', '/api/homes')
    .send(home)
    .expect(200)
    .end((err, res) => {
      should.not.exist(err);
      expect(res.body.home.id).to.be(id);
      home = res.body.home;
      expect(res.body.home.createdBy.id).to.be(app.user.uuid);
      done();
    });
  });

  it('Should not have the newly created, but not enabled home in the home list', (done) => {
    app.mobileRequest('get', '/api/homes')
    .expect(200)
    .end((err, res) => {
      should.not.exist(err);
      should(res.body).have.property('homes');
      expect(res.body.homes.length).to.be(0);
      done();
    });
  });

  it('Should not be possible to update the home without authentication', (done) => {
    app.mobileRequest('put', `/api/homes/${home.id}`)
    .send({
      home: {
        enabled: true
      }
    })
    .expect(403)
    .end((err, res) => {
      should.not.exist(err);
      done();
    });
  });

  it('Should be possible to update the home with authentication', (done) => {
    app.authRequest('put', `/api/homes/${home.id}`)
    .send({
      home: {
        enabled: true
      }
    })
    .expect(200)
    .end((err, res) => {
      should.not.exist(err);
      expect(res.body.home.enabled).to.be(true);
      expect(res.body.home.createdBy.id).to.be(app.user.uuid);
      done();
    });
  });

  // Breaking changes in version 1.0.1
  it('Should find the home from explicit home URL', (done) => {
    app.mobileRequest('get', `/api/homes/${home.id}`)
    .expect(200)
    .end((err, res) => {
      should.not.exist(err);
      should(res.body).have.property('home');
      should(res.body.home.createdBy).have.property('id');
      expect(res.body.home.createdBy.id).to.be(app.user.uuid);
      done();
    });
  });

  // Pre-1.0.1 has a string for createdBy
  it('Should have a string for createdBy', (done) => {
    app.mobileRequest('get', `/api/homes/${home.id}`, '1.0.0')
    .expect(200)
    .end((err, res) => {
      should.not.exist(err);
      should(res.body).have.property('home');
      expect(res.body.home.createdBy).to.be(app.user.uuid);
      done();
    });
  });

  it('Should have the newly created, enabled home in the home list', (done) => {
    app.mobileRequest('get', '/api/homes')
    .expect(200)
    .end((err, res) => {
      should.not.exist(err);
      expect(res.body.homes.length).to.be(1);

      // Verify that the newly created home is found
      let found = false;
      res.body.homes.map((item) => {
        if (item.id === home.id) {
          found = true;
        }
      });
      expect(found).to.be(true);
      done();
    });
  });

  it('Should not be possible to delete a home without authentication', (done) => {
    app.mobileRequest('del', `/api/homes/${home.id}`)
    .expect(403)
    .end((err, res) => {
      should.not.exist(err);
      done();
    });
  });

  it('Should be possible to delete a home', (done) => {
    app.authRequest('del', `/api/homes/${home.id}`)
    .expect(200)
    .end((err, res) => {
      should.not.exist(err);
      done();
    });
  });

  it('Should not have the deleted home in the list anymore', (done) => {
    app.mobileRequest('get', '/api/homes')
    .expect(200)
    .end((err, res) => {
      should.not.exist(err);
      should(res.body).have.property('homes');
      expect(res.body.homes.length).to.be(0);
      done();
    });
  });
});
