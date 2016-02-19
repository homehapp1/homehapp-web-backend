import PageActions from '../actions/PageActions';
import PageSource from '../sources/PageSource';
import ModelStore from '../../common/stores/BaseModelStore';

export default ModelStore.generate('PageStore', {
  actions: PageActions,
  source: PageSource,
  listeners: {}
});
