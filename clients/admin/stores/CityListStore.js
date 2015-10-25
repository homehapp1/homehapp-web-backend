import CityListActions from '../actions/CityListActions';
import CityListSource from '../sources/CityListSource';
import ListStore from '../../common/stores/BaseListStore';
let debug = require('debug')('CityListStore');

export default ListStore.generate('CityListStore', {
  actions: CityListActions,
  source: CityListSource,
  listeners: {
    handleUpdateItem: {
      action: CityListActions.UPDATE_ITEM,
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
