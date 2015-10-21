/*global window */
import React from 'react';
// import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Nav from 'react-bootstrap/lib/Nav';
import TabbedArea from 'react-bootstrap/lib/TabbedArea';
import TabPane from 'react-bootstrap/lib/TabPane';
import SubNavigationWrapper from '../Navigation/SubNavigationWrapper';
import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';
import PagesDetails from './Details';
import ViewMetadata from '../Shared/ViewMetadata';

import PageStore from '../../stores/PageStore';
import PageListStore from '../../stores/PageListStore';

import { setPageTitle, createNotification } from '../../../common/Helpers';

let debug = require('debug')('PagesEdit');

export default class PagesEdit extends React.Component {
  static propTypes = {
    params: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onStateChange.bind(this);
  }

  onStateChange(state) {
    debug('onStateListChange', state);
    this.setState({
      error: state.error,
      page: PageListStore.getItem(this.props.params.id) || null
    });
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

  state = {
    page: PageListStore.getItem(this.props.params.id),
    error: null
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
          <h2 className='navigation-title'>Edit {title}</h2>
          <NavItemLink to='pages'>
            &lt; Back
          </NavItemLink>
        </Nav>
        <Row>
          <h1><i className='fa fa-page'></i> Edit {title}</h1>
          <TabbedArea defaultActiveKey={1}>
            <TabPane eventKey={1} tab='Details'>
              <PagesDetails page={this.state.page} />
            </TabPane>
            <TabPane eventKey={3} tab='Metadata'>
              <ViewMetadata object={this.state.page} />
            </TabPane>
          </TabbedArea>
        </Row>
      </SubNavigationWrapper>
    );
  }
}
