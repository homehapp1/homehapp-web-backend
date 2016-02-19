let debug = require('debug')('PageListActions');

export default require('../../common/actions/BaseListActions')
  .generate('PageListActions', {
    updateItem(model) {
      debug('updateItem', model);
      this.dispatch(model);
    }
  });
