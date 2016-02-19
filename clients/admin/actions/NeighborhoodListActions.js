export default require('../../common/actions/BaseListActions')
  .generate('NeighborhoodListActions', {
    updateItem(model) {
      this.dispatch(model);
    }
  });
