import BaseModelActions from '../../common/actions/BaseModelActions';
let debug = require('../../common/debugger')('AgentActions');

export default BaseModelActions.generate('AgentActions', {
  releaseNumber(id) {
    debug('releaseNumber', id);
    this.dispatch(id);
  }
});
