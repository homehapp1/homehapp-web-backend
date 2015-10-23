import ContactActions from '../actions/ContactActions';
import ContactSource from '../sources/ContactSource';
import ModelStore from '../../common/stores/BaseModelStore';

export default ModelStore.generate('ContactStore', {
  actions: ContactActions,
  source: ContactSource,
  listeners: {}
});
