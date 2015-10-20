import React from 'react';
import NeighborhoodListStore from '../../stores/NeighborhoodListStore';
import NeighborhoodsIndex from './index';

import Loading from '../../../common/components/Widgets/Loading';

class NeighborhoodsIndexContainer extends React.Component {
  static propTypes = {
    params: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onChange.bind(this);
  }

  state = {
    error: null,
    neighborhoods: NeighborhoodListStore.getState().neighborhoods
  }

  componentDidMount() {
    NeighborhoodListStore.listen(this.storeListener);
    NeighborhoodListStore.fetchNeighborhoods();
  }

  componentWillUnmount() {
    NeighborhoodListStore.unlisten(this.storeListener);
  }

  onChange(state) {
    this.setState(state);
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
    if (NeighborhoodListStore.isLoading() || !this.state.neighborhoods) {
      return this.handlePendingState();
    }

    return (
      <NeighborhoodsIndex neighborhoods={this.state.neighborhoods} />
    );
  }
}

export default NeighborhoodsIndexContainer;
