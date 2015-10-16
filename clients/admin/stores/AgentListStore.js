'use strict';

import AgentListActions from '../actions/AgentListActions';
import AgentListSource from '../sources/AgentListSource';
import ListStore from '../../common/stores/BaseListStore';

export default ListStore.generate('AgentListStore', {
  actions: AgentListActions,
  source: AgentListSource
});
