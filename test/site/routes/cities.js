'use strict';

import should from 'should';
import expect from 'expect.js';
import request from 'supertest';

import testUtils from '../utils';
import MockupData from '../../MockupData';

let app = null;
let debug = require('debug')('City API paths');
let mockup = null;

describe('City API paths', () => {
  before((done) => {
    testUtils.createApp((err, appInstance) => {
      app = appInstance;
      mockup = new MockupData(app);
      mockup.removeAll('City')
      .then(() => {
        done(err);
      })
      .catch((err) => {
        console.error('Failed to delete neighborhoods');
        done(err);
      });
    });
  });

  let body = null;
  let city = null;

  it('Response of /neighborhoods should redirect to the single city listing', (done) => {
    mockup.createModel('City')
    .then((rval) => {
      city = rval;
      request(app)
      .get('/neighborhoods')
      .expect(301)
      .end((err, res) => {
        should.not.exist(err);
        done();
      });
    })
    .catch((err) => {
      done(err);
    });
  });

  it('City can be deleted', (done) => {
    mockup
    .remove(city)
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
  });

  it('Check the URL space to verify that the deleted neighborhood is no longer available', (done) => {
    let urls = [
      `/neighborhoods/${city.slug}`
    ];

    let promises = urls.map((url) => {
      return new Promise((resolve, reject) => {
        request(app)
        .get(url)
        .expect(404)
        .end((err, res) => {
          should.not.exist(err, `URL '${url}' should not exist anymore`);
          body = res.text;
          resolve();
        });
      });
    });

    Promise.all(promises)
    .then(() => {
      done();
    });
  });
});
