import PageListActions from '../actions/PageListActions';
import PageListSource from '../sources/PageListSource';
import ListStore from '../../common/stores/BaseListStore';
// let debug = require('debug')('PageListStore');

export default ListStore.generate('PageListStore', {
  actions: PageListActions,
  source: PageListSource,
  listeners: {
    handleUpdateItem: {
      action: PageListActions.UPDATE_ITEM,
      method: function handleUpdateItem(model) {
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
