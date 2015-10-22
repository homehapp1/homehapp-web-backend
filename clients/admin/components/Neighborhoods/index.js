import React from 'react';
import { Link } from 'react-router';
import Table from 'react-bootstrap/lib/Table';
import Row from 'react-bootstrap/lib/Row';
import Nav from 'react-bootstrap/lib/Nav';
import SubNavigationWrapper from '../Navigation/SubNavigationWrapper';
import NeighborhoodListStore from '../../stores/NeighborhoodListStore';
import Loading from '../../../common/components/Widgets/Loading';

import { setPageTitle } from '../../../common/Helpers';

let debug = require('debug')('Neighborhoods');

export default class Neighborhoods extends React.Component {
  constructor(props) {
    super(props);
    this.storeListener = this.onChange.bind(this);
  }

  state = {
    error: null,
    neighborhoods: NeighborhoodListStore.getState().items
  }

  componentDidMount() {
    setPageTitle('Neighborhoods');
    NeighborhoodListStore.listen(this.storeListener);
    NeighborhoodListStore.fetchItems();
  }

  componentWillUnmount() {
    NeighborhoodListStore.unlisten(this.storeListener);
  }

  onChange(state) {
    debug('onChange', state);
    this.setState({
      error: state.error,
      neighborhoods: state.items
    });
  }

  handlePendingState() {
    return (
      <Loading>
        <h3>Loading neighborhoods...</h3>
      </Loading>
    );
  }

  handleErrorState() {
    return (
      <div className='neighborhoods-error'>
        <h3>Error loading neighborhoods!</h3>
        <p>{this.state.error.message}</p>
      </div>
    );
  }

  render() {
    if (this.state.error) {
      return this.handleErrorState();
    }

    if (NeighborhoodListStore.isLoading() || !this.state.neighborhoods || !this.state.neighborhoods.length) {
      return this.handlePendingState();
    }

    return (
      <SubNavigationWrapper>
        <Nav sidebar>
          <h2 className='navigation-title'>
            Neighborhoods
          </h2>
        </Nav>
        <Row>
          <h1>{this.state.neighborhoods.length} neighborhoods</h1>
          <Table>
            <thead>
              <tr>
                <th>Neighbourhood</th>
                <th>Story blocks</th>
              </tr>
            </thead>
            <tbody>
              {this.state.neighborhoods.map((neighborhood, i) => {
                let storyBlocks = neighborhood.story.blocks.length || null;
                return (
                  <tr key={i}>
                    <td>
                      <Link
                        to='neighborhoodEdit'
                        params={{id: neighborhood.id}}>
                        {neighborhood.title}
                      </Link>
                    </td>
                    <td>{storyBlocks}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Row>
      </SubNavigationWrapper>
    );
  }
}
