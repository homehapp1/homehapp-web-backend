'use strict';

import AgentActions from '../actions/AgentActions';
import AgentSource from '../sources/AgentSource';
import ModelStore from '../../common/stores/BaseModelStore';

export default ModelStore.generate('AgentStore', {
  actions: AgentActions,
  source: AgentSource,
  listeners: {
    handleReleaseNumber: {
      action: AgentActions.RELEASE_NUMBER,
      method: (id) => {
        this.getInstance().debug('handleReleaseNumber', id);
        this.error = null;
        if (!this.getInstance().isLoading()) {
          setTimeout(() => {
            this.getInstance().releaseNumber(id);
          });
        }
      }
    }
  }
});
