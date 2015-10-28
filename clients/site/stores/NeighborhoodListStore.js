import NeighborhoodListActions from '../actions/NeighborhoodListActions';
import NeighborhoodListSource from '../sources/NeighborhoodListSource';
import ListStore from '../../common/stores/BaseListStore';
let debug = require('debug')('NeighborhoodListStore');

export default ListStore.generate('NeighborhoodListStore', {
  actions: NeighborhoodListActions,
  source: NeighborhoodListSource,
  listeners: {}
});
