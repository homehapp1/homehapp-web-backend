import CityListActions from '../actions/CityListActions';
import CityListSource from '../sources/CityListSource';
import ListStore from '../../common/stores/BaseListStore';
// let debug = require('debug')('CityListStore');

export default ListStore.generate('CityListStore', {
  actions: CityListActions,
  source: CityListSource,
  listeners: {}
});
