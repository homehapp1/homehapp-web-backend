export default require('../../common/actions/BaseListActions')
  .generate('CityListActions', {
    updateItem(model) {
      this.dispatch(model);
    }
  });
