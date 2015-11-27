'use strict';

import should from 'should';
import expect from 'expect.js';
import request from 'supertest';

import testUtils from '../../utils';
import MockupData from '../../../MockupData';

let app = null;
let debug = require('debug')('Home API paths');
let mockup = null;

describe('Home API paths', () => {
  before((done) => {
    testUtils.createApp((err, appInstance) => {
      app = appInstance;
      mockup = new MockupData(app);
      mockup.removeHomes()
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

  it('Should respond to /api/homes with correct structure', (done) => {
    request(app)
    .get('/api/homes')
    .expect(200)
    .end((err, res) => {
      should.not.exist(err);
      body = res.body;
      done();
    });
  });

  it('Response of /api/homes should have the correct structure', (done) => {
    should(body).have.property('status', 'ok');
    should(body).have.property('homes');
    should(body.homes).be.instanceof(Array);
    should(body.homes).be.empty;
    done();
  });

  it('Response of /api/homes should have the mockup home', (done) => {
    mockup.createHome()
    .then((home) => {
      request(app)
      .get('/api/homes')
      .expect(200)
      .end((err, res) => {
        should.not.exist(err);
        body = res.body;
        should(body).have.property('status', 'ok');
        should(body).have.property('homes');
        should(body.homes).be.instanceof(Array);
        should(body.homes).not.be.empty;

        body.homes.map((item) => {
          should(item).have.property('slug');
          should(item).have.property('story');
          should(item).have.property('location');
          expect(item.slug).to.be(home.slug);
        });

        done();
      });
    })
    .catch((err) => {
      done(err);
    });
  });
});
