'use strict';

import should from 'should';
import expect from 'expect.js';
import request from 'supertest';

import testUtils from '../utils';
import MockupData from '../../MockupData';

let app = null;
let debug = require('debug')('Home API paths');
let mockup = null;

describe('Home API paths', () => {
  before((done) => {
    testUtils.createApp((err, appInstance) => {
      app = appInstance;
      mockup = new MockupData(app);
      mockup.removeAll('Home')
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
    mockup.createModel('Home')
    .then((rval) => {
      home = rval;
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
        expect(body.homes.length).to.eql(1);

        body.homes.map((item) => {
          mockup.verify('Home', item);
        });

        done();
      });
    })
    .catch((err) => {
      done(err);
    });
  });

  it('Response of /api/homes/:slug gives the correct object', (done) => {
    request(app)
    .get(`/api/homes/${home.slug}`)
    .expect(200)
    .end((err, res) => {
      body = res.body;
      should(body).have.property('status', 'ok');
      should(body).have.property('home');
      mockup.verifyHome(body.home);
      done();
    });
  });

  it('Check the URL space to verify that the newly created home is available', (done) => {
    let urls = [
      '/homes',
      `/homes/${home.slug}`,
      `/homes/${home.slug}/story`,
      `/homes/${home.slug}/details`,
      `/homes/${home.slug}/contact`,
      '/search'
    ];

    let promises = urls.map((url) => {
      return new Promise((resolve, reject) => {
        request(app)
        .get(url)
        .expect(200)
        .end((err, res) => {
          should.not.exist(err, `URL '${url}' should exist`);
          body = res.text;
          resolve();
        });
      });
    });

    Promise.all(promises)
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
  });

  it('Check that the home is found with the flag "buy"', (done) => {
    mockup
    .updateModel('Home', home, {
      announcementType: 'buy'
    })
    .then((model) => {
      return new Promise((resolve, reject) => {
        request(app)
        .get(`/api/homes?type=buy`)
        .expect(200)
        .end((err, res) => {
          should.not.exist(err);
          should(res.body).have.property('status', 'ok');
          should(res.body).have.property('homes');
          let ids = res.body.homes.map((h) => {
            return h.id;
          });

          expect(ids.indexOf(home.uuid)).not.to.be(-1);
          resolve();
        })
      });
    })
    .then(() => {
      request(app)
      .get(`/api/homes?type=rent`)
      .expect(200)
      .end((err, res) => {
        should.not.exist(err);
        should(res.body).have.property('status', 'ok');
        should(res.body).have.property('homes');
        let ids = res.body.homes.map((h) => {
          return h.id;
        });

        expect(ids.indexOf(home.uuid)).to.be(-1);
        done();
      });
    })
    .catch((err) => {
      done(err);
    });
  });

  it('Check that the home is found with the flag "rent"', (done) => {
    mockup
    .updateModel('Home', home, {
      announcementType: 'rent'
    })
    .then((model) => {
      return new Promise((resolve, reject) => {
        request(app)
        .get(`/api/homes?type=rent`)
        .expect(200)
        .end((err, res) => {
          should.not.exist(err);
          should(res.body).have.property('status', 'ok');
          should(res.body).have.property('homes');
          let ids = res.body.homes.map((h) => {
            return h.id;
          });

          expect(ids.indexOf(home.uuid)).not.to.be(-1);
          resolve();
        })
      });
    })
    .then(() => {
      request(app)
      .get(`/api/homes?type=buy`)
      .expect(200)
      .end((err, res) => {
        should.not.exist(err);
        should(res.body).have.property('status', 'ok');
        should(res.body).have.property('homes');
        let ids = res.body.homes.map((h) => {
          return h.id;
        });

        expect(ids.indexOf(home.uuid)).to.be(-1);
        done();
      });
    })
    .catch((err) => {
      done(err);
    });
  });

  it('Home should be hidden after enabled is set to false', (done) => {
    mockup
    .updateModel('Home', home, {
      enabled: false
    })
    .then((model) => {
      request(app)
      .get('/api/homes')
      .expect(200)
      .end((err, res) => {
        should.not.exist(err);
        let found = false;
        res.body.homes.map((h) => {
          if (h.id === home.id) {
            found = true;
          }
        });

        expect(found).to.be(false);
        done();
      });
    })
  });

  it('Home can be deleted', (done) => {
    mockup
    .remove(home)
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
  });

  it('Check the URL space to verify that the deleted home is no longer available', (done) => {
    let urls = [
      `/homes/${home.slug}`,
      `/homes/${home.slug}/story`,
      `/homes/${home.slug}/details`,
      `/homes/${home.slug}/contact`
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
    })
    .catch((err) => {
      done(err);
    });
  });
});
