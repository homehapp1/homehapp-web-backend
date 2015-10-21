import NeighborhoodListActions from '../actions/NeighborhoodListActions';
import NeighborhoodListSource from '../sources/NeighborhoodListSource';
import ListStore from '../../common/stores/BaseListStore';
let debug = require('debug')('NeighborhoodListStore');

export default ListStore.generate('NeighborhoodListStore', {
  actions: NeighborhoodListActions,
  source: NeighborhoodListSource,
  listeners: {
    handleUpdateItem: {
      action: NeighborhoodListActions.UPDATE_ITEM,
      method: function handleUpdateItem(model) {
        //this.getInstance().debug('handleUpdateItem', model);
        debug('handleUpdateItem', this, model);
        console.log('this.getInstance()', this.getInstance());
        this.error = null;
        if (!this.getInstance().isLoading()) {
          setTimeout(() => {
            this.getInstance().updateItem(model);
          });
        }
      }
    }
  }
});
