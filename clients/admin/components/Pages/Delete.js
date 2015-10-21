/*global window */
import React from 'react';
// import { Link } from 'react-router';
import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Nav from 'react-bootstrap/lib/Nav';
import TabbedArea from 'react-bootstrap/lib/TabbedArea';
import TabPane from 'react-bootstrap/lib/TabPane';
import Well from 'react-bootstrap/lib/Well';
import Button from 'react-bootstrap/lib/Button';

import SubNavigationWrapper from '../Navigation/SubNavigationWrapper';
import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';
import PagesDetails from './Details';

import PageStore from '../../stores/PageStore';
import PageListStore from '../../stores/PageListStore';

import { setPageTitle, createNotification } from '../../../common/Helpers';

let debug = require('debug')('PagesEdit');

export default class PagesEdit extends React.Component {
  static propTypes = {
    params: React.PropTypes.object.isRequired,
    context: React.PropTypes.object
  }

  static contextTypes = {
    router: React.PropTypes.func
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onStateChange.bind(this);
    this.redirect = false;
  }

  state = {
    page: PageListStore.getItem(this.props.params.id),
    error: null
  }

  componentDidMount() {
    setPageTitle(['Create', 'Pages']);

    PageListStore.listen(this.storeListener);

    if (!PageListStore.getItem(this.props.params.id)) {
      PageListStore.fetchItems();
    }
  }

  componentWillUnmount() {
    PageListStore.unlisten(this.storeListener);
  }

  onStateChange(state) {
    debug('onStateListChange', state);
    this.setState({
      error: state.error,
      page: PageListStore.getItem(this.props.params.id) || null
    });

    if (!state.error && this.redirect) {
      setTimeout(() => {
        this.context.router.transitionTo('pages');
      }, 100);
    }
  }

  handleErrorState() {
    if (!this.state.error) {
      return null;
    }

    createNotification({
      label: 'Error',
      message: this.state.error.message,
      type: 'danger'
    });
  }

  onDelete() {
    PageListStore.removeItem(this.state.page.id);
    this.redirect = true;
  }

  handlePendingState() {
    return (
      <p>Loading...</p>
    );
  }

  handleSavingState() {
    createNotification({
      message: 'Saving page'
    });
  }

  render() {
    if (this.state.error) {
      return this.handleErrorState();
    }
    let loading = null;
    if (PageListStore.isLoading() || !this.state.page) {
      return this.handlePendingState();
    }

    let title = (this.state.page) ? this.state.page.title : '';
    debug('this.state', this.state);

    return (
      <SubNavigationWrapper>
        <Nav sidebar>
          <h2 className='navigation-title'>Delete {title}</h2>
          <NavItemLink to='pages'>
            &lt; Back
          </NavItemLink>
        </Nav>
        <Row>
          <h1><i className='fa fa-page'></i> Delete {title}</h1>
          <TabbedArea defaultActiveKey={1}>
            <TabPane eventKey={1} tab='Details'>
              <Row>
                <form method='delete'>
                  <Col md={10} sm={10}>
                    <Panel header='Please confirm'>
                      <p>Please confirm the deletion of the page</p>
                    </Panel>
                    <Well>
                      <Row>
                        <Col md={6}>
                          <Button bsStyle='danger' accessKey='s' onClick={this.onDelete.bind(this)}>Delete</Button>
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
