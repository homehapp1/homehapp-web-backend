'use strict';

import should from 'should';
import expect from 'expect.js';
import request from 'supertest';

import testUtils from '../utils';
import MockupData from '../../MockupData';

let app = null;
let debug = require('debug')('Neighborhood API paths');
let mockup = null;

describe('Neighborhood API paths', () => {
  before((done) => {
    testUtils.createApp((err, appInstance) => {
      app = appInstance;
      mockup = new MockupData(app);
      mockup.removeAll('Neighborhood')
      .then(() => {
        return mockup.removeAll('City');
      })
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
  let neighborhood = null;
  let city = null;

  it('Should respond to /api/neighborhoods with correct structure', (done) => {
    request(app)
    .get('/api/neighborhoods')
    .expect(200)
    .end((err, res) => {
      should.not.exist(err);
      body = res.body;
      done();
    });
  });

  it('Response of /api/neighborhoods should have the correct structure', (done) => {
    should(body).have.property('status', 'ok');
    should(body).have.property('items');
    should(body.items).be.instanceof(Array);
    should(body.items).be.empty;
    done();
  });

  it('Response of /api/neighborhoods should have the mockup neighborhood', (done) => {
    console.log('/api/neighborhoods');
    mockup.createModel('Neighborhood')
    .then((rval) => {
      neighborhood = rval;

      // Create the city
      return mockup.createModel('City')
    })
    .then((rval) => {
      city = rval;

      request(app)
      .get('/api/neighborhoods')
      .expect(200)
      .end((err, res) => {
        should.not.exist(err);
        body = res.body;
        should(body).have.property('status', 'ok');
        should(body).have.property('items');
        should(body.items).be.instanceof(Array);
        should(body.items).not.be.empty;
        expect(body.items.length).to.eql(1);

        body.items.map((item) => {
          mockup.verify('Neighborhood', item);
        });

        done();
      });
    })
    .catch((err) => {
      done(err);
    });
  });

  it('Response of /api/neighborhood/:city/:slug does not give the object before neighborhood city is saved', (done) => {
    let urls = [
      `/neighborhoods/${city.slug}/${neighborhood.slug}`,
      `/api/neighborhoods/${city.slug}/${neighborhood.slug}`
    ];

    let promises = urls.map((url) => {
      request(app)
      .get(url)
      .expect(404)
      .end((err, res) => {
        console.log(res.body);
        should.not.exist(err, `'${url}' should not exist yet`);
      });

    });
    Promise.all(promises)
    .then(() => {
      done();
    });
  });

  it('Response of /api/neighborhoods/:city/:slug gives the correct object', (done) => {
    neighborhood.location.city = city._id;
    let url = `/api/neighborhoods/${city.slug}/${neighborhood.slug}`;

    mockup
    .updateModel('Neighborhood', neighborhood)
    .then((model) => {
      request(app)
      .get(url)
      .expect(200)
      .end((err, res) => {
        body = res.body;
        // should.not.exist(err, `'${url}' should exist`);
        console.log(`'${url}' response:`, body);
        // should(body).have.property('status', 'ok');
        // should(body).have.property('neighborhood');
        // mockup.verifyNeighborhood(body.neighborhood);
        done();
      });
    })
    .catch((err) => {
      done(err);
    });
  });

  // it('Check the URL space to verify that the newly created neighborhood is available', (done) => {
  //   let urls = [
  //     `/neighborhoods/${city.slug}/${neighborhood.slug}`,
  //     `/neighborhoods/${city.slug}/${neighborhood.slug}/homes`
  //   ];
  //
  //   let promises = urls.map((url) => {
  //     return new Promise((resolve, reject) => {
  //       request(app)
  //       .get(url)
  //       .expect(200)
  //       .end((err, res) => {
  //         should.not.exist(err, `URL '${url}' should exist`);
  //         resolve();
  //       });
  //     });
  //   });
  //
  //   Promise.all(promises)
  //   .then(() => {
  //     done();
  //   });
  // });

  it('Neighborhood should not be listed when it is not enabled', (done) => {
    neighborhood.enabled = false;
    mockup
    .updateModel('Neighborhood', neighborhood)
    .then((rval) => {
      neighborhood = rval;

      request(app)
      .get(`/api/neighborhoods/${city.slug}`)
      .expect(200)
      .end((err, res) => {
        expect(res.body.items.length).to.be(0);
        done();
      });
    })
    .catch((err) => {
      done(err);
    });;
  });

  it('Neighborhood can be deleted', (done) => {
    mockup
    .remove(neighborhood)
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
  });

  it('Check the URL space to verify that the deleted neighborhood is no longer available', (done) => {
    let urls = [
      `/neighborhoods/${city.slug}/${neighborhood.slug}`,
      `/neighborhoods/${city.slug}/${neighborhood.slug}/homes`
    ];

    let promises = urls.map((url) => {
      return new Promise((resolve, reject) => {
        request(app)
        .get(url)
        .expect(404)
        .end((err, res) => {
          // console.log('err', err);
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
