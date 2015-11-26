let debug = require('debug')('NeighborhoodsAPI');

export default class NeighborhoodsAPI {
  constructor(app,qb) {
    this.QB = qb;
  }

  listNeighborhoodsByCity(req, res, next) {
    let city = null;
    return new Promise((resolve, reject) => {
      this.QB
      .forModel('City')
      .findBySlug(req.params.city)
      .fetch()
      .then((result) => {
        city = result.city;
        return this.QB
        .forModel('Neighborhood')
        .parseRequestArguments(req)
        .query({
          enabled: true,
          'location.city': city
        })
        .sort({
          title: 1
        })
        .findAll()
        .fetch();
      })
      .then((result) => {
        for (let neighborhood of result.models) {
          neighborhood.location.city = city;
        }
        resolve(result.models);
      })
      .catch((err) => {
        debug('Reject', err);
        reject(err);
      });
    });
  }

  listNeighborhoods(req, res, next) {
    return new Promise((resolve, reject) => {
      this.QB
      .forModel('Neighborhood')
      .parseRequestArguments(req)
      .populate({
        'location.city': 'slug title'
      })
      .sort({
        title: 1
      })
      .query({
        enabled: true
      })
      .findAll()
      .fetch()
      .then((result) => {
        resolve(result.models);
      })
      .catch((err) => {
        reject(err);
      });
    });
  }

  getNeighborhoodBySlug(req, res, next) {
    let city = null;
    let neighborhood = null;

    return new Promise((resolve) => {
      this.QB
      .forModel('City')
      .findBySlug(req.params.city)
      .fetch()
      .then((result) => {
        debug('Got city', result.model.title);
        city = result.model;
        debug('Search for neighborhood', req.params.neighborhood);

        return this.QB
        .forModel('Neighborhood')
        .findBySlug(req.params.neighborhood)
        .query({
          enabled: true
        })
        .fetch();
      })
      .then((result) => {
        debug('Got neighborhood', result.model.title);
        neighborhood = result.model;
        neighborhood.location.city = city;

        return this.QB
        .forModel('Home')
        .findByNeighborhood(neighborhood)
        .fetch();
      })
      .then((result) => {
        debug('Got neighborhood homes', result.models.length);
        neighborhood.homes = result.models;
        resolve(neighborhood);
      })
      .catch(next);
    });
  };


}
