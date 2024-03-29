/*global window */
import React from 'react';
// import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Nav from 'react-bootstrap/lib/Nav';
import TabbedArea from 'react-bootstrap/lib/TabbedArea';
import TabPane from 'react-bootstrap/lib/TabPane';
import SubNavigationWrapper from '../Navigation/SubNavigationWrapper';
import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';
import PagesDetails from './Details';
import ViewMetadata from '../Shared/ViewMetadata';
import EditModel from '../Shared/EditModel';

import PageListStore from '../../stores/PageListStore';
import PageActions from '../../actions/PageActions';
import PageStore from '../../stores/PageStore';

import { setPageTitle, createNotification } from '../../../common/Helpers';

let debug = require('debug')('PagesEdit');

export default class PagesEdit extends EditModel {
  static propTypes = {
    params: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onStateChange.bind(this);
  }

  state = {
    page: PageListStore.getItem(this.props.params.id),
    error: null
  }

  componentDidMount() {
    setPageTitle(['Edit', 'Pages']);

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
    if (PageListStore.isLoading() || !this.state.page) {
      return this.handlePendingState();
    }

    let title = (this.state.page) ? this.state.page.title : '';
    let openTab = this.resolveOpenTab(this.props.params.tab);
    debug('openTab', openTab);

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
          <TabbedArea defaultActiveKey={openTab}>
            <TabPane eventKey={1} tab='Details'>
              <PagesDetails page={this.state.page} />
            </TabPane>
            <TabPane eventKey={3} tab='Metadata'>
              <ViewMetadata object={this.state.page} store={PageStore} actions={PageActions} />
            </TabPane>
          </TabbedArea>
        </Row>
      </SubNavigationWrapper>
    );
  }
}
