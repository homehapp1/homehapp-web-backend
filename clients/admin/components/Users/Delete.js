/*global window */
'use strict';

import React from 'react';
// import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Button from 'react-bootstrap/lib/Button';
import Well from 'react-bootstrap/lib/Well';
import Nav from 'react-bootstrap/lib/Nav';
import TabbedArea from 'react-bootstrap/lib/TabbedArea';
import TabPane from 'react-bootstrap/lib/TabPane';
import SubNavigationWrapper from '../Navigation/SubNavigationWrapper';
import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';
import UserStore from '../../stores/UserStore';
import UserActions from '../../actions/UserActions';
import { createNotification } from '../../../common/Helpers';

let debug = require('../../../common/debugger')('UsersDelete');

export default class UsersDelete extends React.Component {
  static propTypes = {
    user: React.PropTypes.object.isRequired,
    context: React.PropTypes.object
  }

  static contextTypes = {
    router: React.PropTypes.func
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onUserStoreChange.bind(this);
  }

  state = {
    error: null
  }

  componentDidMount() {
    UserStore.listen(this.storeListener);
  }

  componentWillUnmount() {
    UserStore.unlisten(this.storeListener);
  }

  onUserStoreChange(state) {
    debug('onUserStoreChange', state);
    if (!state.error && state.deleted) {
      debug('Redirect to user listing');
      let href = this.context.router.makeHref('users');
      window.location.href = href;
      return;
    }
    this.setState(state);
  }

  onDelete() {
    debug('Delete');
    UserActions.deleteItem(this.props.user);
  }

  handlePendingState() {
    createNotification({
      message: 'Saving user...'
    });
    return null;
  }

  handleErrorState() {
    createNotification({
      label: 'Error deleting user',
      message: this.state.error.message
    });
  }

  render() {
    if (this.state.error) {
      this.handleErrorState();
    }
    if (UserStore.isLoading()) {
      this.handlePendingState();
    }
    debug('User being prepared for deletion', this.props.user);

    return (
      <SubNavigationWrapper>
        <Nav sidebar>
          <h2 className='navigation-title'>Delete User</h2>
          <NavItemLink to='users'>
            &lt; Back
          </NavItemLink>
        </Nav>
        <Row>
          <h1><i className='fa fa-user'></i> Delete user {this.props.user.displayName}</h1>
          <TabbedArea defaultActiveKey={1}>
            <TabPane eventKey={1} tab='Delete'>
              <Row>
                <form name='userDetails' ref='userDetailsForm' method='POST'>
                  <Col md={10} sm={10}>
                    <Panel header='Common'>
                      Please confirm the deletion of this user
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
