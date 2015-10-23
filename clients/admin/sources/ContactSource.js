import SourceBuilder from '../../common/sources/Builder';
import ContactActions from '../actions/ContactActions';

export default SourceBuilder.build({
  name: 'ContactSource',
  actions: {
    base: ContactActions,
    error: ContactActions.requestFailed
  },
  methods: {}
});
