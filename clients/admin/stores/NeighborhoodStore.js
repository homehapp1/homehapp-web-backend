import NeighborhoodActions from '../actions/NeighborhoodActions';
import NeighborhoodSource from '../sources/NeighborhoodSource';
import ModelStore from '../../common/stores/BaseModelStore';

export default ModelStore.generate('NeighborhoodStore', {
  actions: NeighborhoodActions,
  source: NeighborhoodSource,
  listeners: {}
});
