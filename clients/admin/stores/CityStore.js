import CityActions from '../actions/CityActions';
import CitySource from '../sources/CitySource';
import ModelStore from '../../common/stores/BaseModelStore';

export default ModelStore.generate('CityStore', {
  actions: CityActions,
  source: CitySource,
  listeners: {}
});
