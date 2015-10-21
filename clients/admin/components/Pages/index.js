import React from 'react';
import PageListStore from '../../stores/PageListStore';
import Loading from '../../../common/components/Widgets/Loading';

import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Nav from 'react-bootstrap/lib/Nav';
import SubNavigationWrapper from '../Navigation/SubNavigationWrapper';

import { setPageTitle } from '../../../common/Helpers';

let debug = require('../../../common/debugger')('PagesIndex');

export default class PagesIndex extends React.Component {
  constructor(props) {
    super(props);
    this.storeListener = this.onChange.bind(this);
  }

  onChange(state) {
    debug('onChange', state);
    this.setState({
      pages: state.items,
      error: state.error
    });
  }

  state = {
    pages: null,
    error: null
  }

  componentDidMount() {
    debug('componentDidMount');
    setPageTitle('Pages');
    PageListStore.listen(this.storeListener);
    PageListStore.fetchItems();
  }

  componentWillUnmount() {
    PageListStore.unlisten(this.storeListener);
  }

  handlePendingState() {
    return (
      <Loading>
        <h3>Loading pages...</h3>
      </Loading>
    );
  }

  handleErrorState() {
    return (
      <div className='pages-error'>
        <h3>Error loading pages!</h3>
        <p>{this.state.error.message}</p>
      </div>
    );
  }

  render() {
    if (this.state.error) {
      return this.handleErrorState();
    }

    if (PageListStore.isLoading()) {
      return this.handlePendingState();
    }

    let pages = this.state.pages || [];

    return (
      <SubNavigationWrapper>
        <Nav sidebar>
          <h2 className='navigation-title'>
            Pages
          </h2>
          <p>There are {pages.length} pages in the system currently.</p>
          <ul>
            <li><Link to='pageCreate'><i className='fa fa-page'></i> Create a new page</Link></li>
          </ul>
        </Nav>
        <Row>
          <h1><i className='fa fa-page'></i> {pages.length} pages</h1>
          <ul>
            {pages.map((page, i) => {
              return (
                <li key={i}>
                  <Link
                    to='pageEdit'
                    params={{id: page.id}}>
                    {page.title}
                  </Link>
                </li>
              );
            })}
          </ul>

        </Row>
      </SubNavigationWrapper>
    );
  }
}
