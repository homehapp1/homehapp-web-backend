/*global window */
'use strict';

import React from 'react';
// import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
// import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import Well from 'react-bootstrap/lib/Well';
import Nav from 'react-bootstrap/lib/Nav';
import TabbedArea from 'react-bootstrap/lib/TabbedArea';
import TabPane from 'react-bootstrap/lib/TabPane';
import SubNavigationWrapper from '../Navigation/SubNavigationWrapper';
import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';
// import EditDetails from './EditDetails';
import AgentStore from '../../stores/AgentStore';
import AgentActions from '../../actions/AgentActions';
// import AgentListActions from '../../actions/AgentListActions';
import NotificationLayout from '../Layout/NotificationLayout';

let debug = require('../../../common/debugger')('AgentsDelete');

export default class AgentsDelete extends React.Component {
  static propTypes = {
    agent: React.PropTypes.object.isRequired,
    context: React.PropTypes.object
  }

  static contextTypes = {
    router: React.PropTypes.func
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onAgentStoreChange.bind(this);
  }

  state = {
    error: null
  }

  componentDidMount() {
    AgentStore.listen(this.storeListener);
  }

  componentWillUnmount() {
    AgentStore.unlisten(this.storeListener);
  }

  onAgentStoreChange(state) {
    debug('onAgentStoreChange', state);
    if (!state.error && state.deleted) {
      debug('Redirect to agent listing');
      let href = this.context.router.makeHref('agents');
      window.location.href = href;
      return;
    }
    this.setState(state);
  }

  onDelete() {
    debug('Delete');
    AgentActions.deleteItem(this.props.agent);
  }

  handlePendingState() {
    return (
      <NotificationLayout>
        <h3>Deleting the agent...</h3>
      </NotificationLayout>
    );
  }

  handleErrorState() {
    return (
      <div className='agent-error'>
        <h3>Error deleting agent!</h3>
        <p>{this.state.error.message}</p>
      </div>
    );
  }

  render() {
    let error = null;
    let savingLoader = null;
    if (this.state.error) {
      error = this.handleErrorState();
    }
    if (AgentStore.isLoading()) {
      savingLoader = this.handlePendingState();
    }
    debug('Agent being prepared for deletion', this.props.agent);

    return (
      <SubNavigationWrapper>
        <Nav sidebar>
          <h2 className='navigation-title'>Delete Agent</h2>
          <NavItemLink to='agents'>
            &lt; Back
          </NavItemLink>
        </Nav>
        <Row>
          <h1><i className='fa fa-user'></i> Delete {this.props.agent.rname}</h1>
          <TabbedArea defaultActiveKey={1}>
            <TabPane eventKey={1} tab='Delete'>
              <Row>
                {error}
                {savingLoader}
                <form name='agentDetails' ref='agentDetailsForm' method='POST'>
                  <Col md={10} sm={10}>
                    <Panel header='Common'>
                      Please confirm the deletion of this agent
                    </Panel>
                    <Well>
                      <Row>
                        <Col md={6}>
                          <Button bsStyle='danger' accessKey='d' onClick={this.onDelete.bind(this)}>Delete</Button>
                        </Col>
                      </Row>
                    </Well>
                  </Col>
                </form>
              </Row>
            </TabPane>
          </TabbedArea>
        </Row>
      </SubNavigationWrapper>
    );
  }
}
