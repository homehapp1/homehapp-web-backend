import QueryBuilder from '../server/lib/QueryBuilder';
import app from "../server/app";
import should from 'should';
import expect from 'expect.js';

let debug = require('debug')('MockupData');

export default class MockupData {
  constructor(app) {
    this.qb = new QueryBuilder(app);
  }

  home = {
    slug: 'TESTHOME',
    title: 'Test home',
    story: {
      blocks: [],
      enabled: true
    },
    location: {
      coordinates: [0, 0],
      neighborhood: null
    }
  }

  neighborhood = {
    title: 'Test neighborhood',
    story: {
      blocks: [],
      enabled: true
    },
    enabled: true,
    area: []
  }

  city = {
    title: 'Testoborough',
    slug: 'testoborough'
  }

  createModel(model) {
    if (typeof this[model.toLowerCase()] === 'undefined') {
      throw new Error(`Trying to create a mockup object '${model}' but it is not available`);
    }
    let data = this[model.toLowerCase()];

    return new Promise((resolve, reject) => {
      this.qb
      .forModel(model)
      .createNoMultiset(data)
      .then((obj) => {
        this[model] = obj;
        resolve(obj);
      })
      .catch((err) => {
        reject(err);
      });
    });
  }

  updateModel(model, data) {
    if (typeof this[model.toLowerCase()] === 'undefined') {
      throw new Error(`Trying to create a mockup object '${model}' but it is not available`);
    }
    console.log('Update with data', data);

    return new Promise((resolve, reject) => {
      this.qb
      .forModel(model)
      .findByUuid(data.uuid || data.id)
      .updateNoMultiset(data)
      .then((result) => {
        console.log('Updated model', result);
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
    });
  }

  verify(model, object) {
    if (typeof this[model.toLowerCase()] === 'undefined') {
      throw new Error(`Trying to verify a mockup object '${model}' but it is not available`);
    }
    let data = this[model.toLowerCase()];
    this.compare(data, object);
  }

  /**
   * Deep check for source that has to include all the target properties
   */
  compare(source, target) {
    for (let key in source) {
      should(target).have.property(key);
      let value = source[key];
      switch (typeof value) {
        case 'object':
          if (Array.isArray(value)) {
            expect(value).to.eql(target[key]);
          } else {
            this.compare(value, target[key]);
          }
          break;
        default:
          expect(value).to.eql(target[key]);
      }
    }
  }

  verifyHome(object) {
    this.verify('Home', object);
    should(object).have.property('location');
    should(object.location).have.property('coordinates');
    should(object.location).have.property('neighborhood');

    if (object.location && object.location.neighborhood) {
      this.verifyNeighborhood(object.location.neighborhood);
    }
  }

  verifyNeighborhood(object) {
    this.verify('Neighborhood', object);
    should(object).have.property('location');
    should(object.location).have.property('city');

    if (object.location && object.location.city) {
      this.verifyCity(object.location.city);
    }
  }

  verifyCity(object) {
    this.verify('City', object);
  }

  remove(model) {
    return new Promise((resolve, reject) => {
      model
      .remove()
      .then((data) => {
        resolve(data);
      });
    });
  }

  removeAll(model) {
    return new Promise((resolve, reject) => {
      this.qb
      .forModel(model)
      .findAll()
      .fetch()
      .then((result) => {
        if (!result.models.length) {
          resolve();
        }

        let promises = result.models.map((home) => {
          return new Promise((res, rej) => {
            home
            .remove()
            .then(() => {
              res();
            });
          });
        });

        return Promise.all(promises)
      })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
    });
  }

  removeHomes() {
    return this.removeAll('Home');
  }

  removeNeighborhoods() {
    return this.removeAll('Neighborhood');
  }

  removeCities() {
    return this.removeAll('City');
  }
}
