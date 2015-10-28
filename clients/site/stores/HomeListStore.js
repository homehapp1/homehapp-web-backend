import HomeListActions from '../actions/HomeListActions';
import HomeListSource from '../sources/HomeListSource';
import ListStore from '../../common/stores/BaseListStore';
let debug = require('debug')('HomeListStore');

export default ListStore.generate('HomeListStore', {
  actions: HomeListActions,
  source: HomeListSource,
  listeners: {}
});
