import QueryBuilder from '../server/lib/QueryBuilder';
import app from "../server/app";

export default class MockupData {
  constructor(app) {
    this.qb = new QueryBuilder(app);
  }

  home = {
    title: 'Test home',
    story: {
      enabled: true,
      blocks: []
    }
  }

  neighborhood = {
    title: 'Test neighborhood',
    story: {
      enabled: true,
      blocks: []
    }
  }

  createHome() {
    return new Promise((resolve, reject) => {
      this.qb
      .forModel('Home')
      .createNoMultiset(this.home)
      .then((model) => {
        this.home = model;
        resolve(model);
      })
      .catch((err) => {
        reject(err);
      });
    });
  }

  removeHomes() {
    return new Promise((resolve, reject) => {
      this.qb
      .forModel('Home')
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
}
