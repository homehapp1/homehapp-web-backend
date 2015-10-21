let debug = require('debug')('NeighborhoodListActions');

export default require('../../common/actions/BaseListActions')
  .generate('NeighborhoodListActions', {
    updateItem(model) {
      debug('updateItem', model);
      this.dispatch(model);
    }
  });
