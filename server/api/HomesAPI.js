let debug = require('debug')('HomesAPI');

export default class HomesAPI {
  constructor(app,qb) {
    this.QB = qb;
  }

  listHomes(req) {
    let query = {};

    if (req.params.type) {
      query.announcementType = req.params.type;
    }

    if (req.params.story) {
      query['story.enabled'] = true;
    }

    return new Promise((resolve, reject) => {
      this.QB
      .forModel('Home')
      .parseRequestArguments(req)
      .query(query)
      .populate({
        'location.neighborhood': {}
      })
      .sort({
        'metadata.score': -1
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

  getHome(req) {
    return new Promise((resolve, reject) => {
      this.QB
      .forModel('Home')
      .populate({
        'location.neighborhood': {},
        agents: {}
      })
      .findBySlug(req.params.slug)
      .fetch()
      .then((result) => {
        resolve(result.model);
      })
      .catch((err) => {
        reject(err);
      });;
    });
  }

  populateCityForHome(home) {
    debug('populateCityForHome', home);
    if (!home.location || !home.location.neighborhood || !home.location.neighborhood.location || !home.location.neighborhood.location.city) {
      debug('No city defined');
      return Promise.resolve(home);
    }
    debug('City defined');

    return new Promise((resolve) => {
      this.QB
      .forModel('City')
      .findById(home.location.neighborhood.location.city)
      .fetch()
      .then((result) => {
        debug('City available', result.model);
        home.location.neighborhood.location.city = result.model;
        resolve(home);
      })
      .catch((err) => {
        // Do not populate city if it was not found from the database
        debug('City not available', err);
        home.location.neighborhood.location.city = null;
        resolve(home);
      });
    });
  }
}