import alt from '../../common/alt';
import HomeListActions from '../actions/HomeListActions';
import HomeListSource from '../sources/HomeListSource';
// import Cache from '../../common/Cache';

// let debug = require('../../common/debugger')('HomeListStore');

@alt.createStore
class HomeListStore {
  constructor() {
    this.bindListeners({
      handleUpdateHomes: HomeListActions.UPDATE_HOMES,
      handleFetchHomes: HomeListActions.FETCH_HOMES,
      handleFetchFailed: HomeListActions.FETCH_FAILED
    });

    this.homes = [];
    this.error = null;

    this.exportPublicMethods({
      getHome: this.getHome
    });

    this.exportAsync(HomeListSource);
  }

  getHome(id) {
    let { homes } = this.getState();
    for (let home of homes) {
      if (!id) {
        return home;
      }
      if (home.id === id) {
        return home;
      }
    }
    this.error = 'No matching id found in homes';
  }

  handleUpdateHomes(homes) {
    this.homes = homes;
    this.error = null;
  }
  handleFetchHomes() {
    this.homes = [];
    this.error = null;
  }
  handleFetchFailed(error) {
    this.error = error;
  }
}

module.exports = HomeListStore;
