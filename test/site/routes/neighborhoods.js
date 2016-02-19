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
  let home = null;
  let city = null;
  let neighborhood = null;

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
    mockup.createModel('Neighborhood')
    .then((rval) => {
      neighborhood = rval;

      // Create the city
      return mockup.createModel('City')
    })
    .then((rval) => {
      city = rval;

      // Create the home
      return mockup.createModel('Home')
    })
    .then((rval) => {
      home = rval;

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
    let url = `/api/neighborhoods/${city.slug}/${neighborhood.slug}`;

    mockup
    .updateModel('Neighborhood', neighborhood, {
      location: {
        city: city.id
      }
    })
    .then((model) => {
      request(app)
      .get(url)
      .expect(200)
      .end((err, res) => {
        body = res.body;
        should.not.exist(err, `'${url}' should exist`);
        should(body).have.property('status', 'ok');
        should(body).have.property('neighborhood');
        mockup.verifyNeighborhood(body.neighborhood);
        done();
      });
    })
    .catch((err) => {
      done(err);
    });
  });

  it('Should not exist any homes in the newly created neighborhood', (done) => {
    let url = `/api/neighborhoods/${city.slug}/${neighborhood.slug}/homes`;
    request(app)
    .get(url)
    .expect(200)
    .end((err, res) => {
      should.not.exist(err, `'${url}' should exist`);
      should(res.body).have.property('status', 'ok');
      should(res.body).have.property('homes');
      should(res.body.homes).be.instanceof(Array);
      expect(res.body.homes.length).to.eql(0);
      done();
    });
  });


  it('Check the URL space to verify that the newly created neighborhood is available', (done) => {
    let urls = [
      `/neighborhoods/${city.slug}/${neighborhood.slug}`,
      `/neighborhoods/${city.slug}/${neighborhood.slug}/homes`
    ];

    let promises = urls.map((url) => {
      return new Promise((resolve, reject) => {
        request(app)
        .get(url)
        .expect(200)
        .end((err, res) => {
          should.not.exist(err, `URL '${url}' should exist`);
          resolve();
        });
      });
    });

    Promise.all(promises)
    .then(() => {
      done();
    });
  });

  it('Should have a home in the neighborhood listing', (done) => {
    mockup
    .updateModel('Home', home, {
      location: {
        neighborhood: neighborhood.id
      }
    })
    .then((rval) => {
      let url = `/api/neighborhoods/${city.slug}/${neighborhood.slug}/homes`;
      request(app)
      .get(url)
      .expect(200)
      .end((err, res) => {
        should.not.exist(err, `URL '${url}' should exist`);
        should(res.body).have.property('homes');
        expect(res.body.homes.length).to.eql(1);
        console.log('res.body', res.body.homes[0].slug, home.slug);
        expect(res.body.homes[0].slug).to.eql(home.slug);
        done();
      });
    })
    .catch((err) => {
      done(err);
    });
  });

  it('Neighborhood should not be listed when it is not enabled', (done) => {
    let url = `/api/neighborhoods/${city.slug}`;
    mockup
    .updateModel('Neighborhood', neighborhood, {
      enabled: false
    })
    .then((rval) => {
      neighborhood = rval;

      request(app)
      .get(url)
      .expect(200)
      .end((err, res) => {
        should.not.exist(err, `'${url}' should exist`);
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
