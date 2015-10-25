import SourceBuilder from '../../common/sources/Builder';
import CityActions from '../actions/CityActions';
// let debug = require('debug')('CitySource');

export default SourceBuilder.build({
  name: 'CitySource',
  actions: {
    base: CityActions,
    error: CityActions.requestFailed
  },
  methods: {}
});
