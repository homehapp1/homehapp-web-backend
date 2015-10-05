/*global window */
'use strict';

import React from 'react';
// import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import Well from 'react-bootstrap/lib/Well';
import Nav from 'react-bootstrap/lib/Nav';
import TabbedArea from 'react-bootstrap/lib/TabbedArea';
import TabPane from 'react-bootstrap/lib/TabPane';
import SubNavigationWrapper from '../Navigation/SubNavigationWrapper';
import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';
import EditDetails from './EditDetails';
import HomeStore from '../../stores/HomeStore';
import HomeActions from '../../actions/HomeActions';

import Loading from '../../../common/components/Widgets/Loading';

let debug = require('../../../common/debugger')('HomesDelete');

export default class HomesDelete extends React.Component {
  static propTypes = {
    home: React.PropTypes.object.isRequired,
    context: React.PropTypes.object
  }

  static contextTypes = {
    router: React.PropTypes.func
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onHomeStoreChange.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  state = {
    error: null
  }

  componentDidMount() {
    HomeStore.listen(this.storeListener);
  }

  componentWillUnmount() {
    HomeStore.unlisten(this.storeListener);
  }

  onHomeStoreChange(state) {
    debug('onHomeStoreChange', state);
    this.setState(state);
  }

  onDelete() {
    debug('Delete');
    HomeActions.deleteItem(this.props.home);
  }

  onDeleted() {
    debug('Redirect to home listing');
    this.context.router.transitionTo('homes');
  }

  handlePendingState() {
    return (
      <Loading>
        <h3>Saving home...</h3>
      </Loading>
    );
  }

  handleErrorState() {
    return (
      <div className='home-error'>
        <h3>Error updating home!</h3>
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
    if (HomeStore.isLoading()) {
      savingLoader = this.handlePendingState();
    }
    debug('Home being prepared for deletion', this.props.home);

    return (
      <SubNavigationWrapper>
        <Nav sidebar>
          <h2 className='navigation-title'>Delete Home</h2>
          <NavItemLink to='homes'>
            &lt; Back
          </NavItemLink>
        </Nav>
        <Row>
          <h1><i className='fa fa-home'></i> Edit {this.props.home.homeTitle}</h1>
          <TabbedArea defaultActiveKey={1}>
            <TabPane eventKey={1} tab='Delete'>
              <Row>
                {error}
                {savingLoader}
                <form name='homeDetails' ref='homeDetailsForm' method='POST'>
                  <Col md={10} sm={10}>
                    <Panel header='Common'>
                      Please confirm the deletion of this property
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
