import React from 'react';
import NeighborhoodListStore from '../../stores/NeighborhoodListStore';
import NeighborhoodsEdit from './Edit';
import Loading from '../../../common/components/Widgets/Loading';

class NeighborhoodsEditContainer extends React.Component {
  static propTypes = {
    params: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onChange.bind(this);
  }

  state = {
    error: null,
    neighborhood: NeighborhoodListStore.getItem(this.props.params.id)
  }

  componentDidMount() {
    NeighborhoodListStore.listen(this.storeListener);
    if (!NeighborhoodListStore.getItem(this.props.params.id)) {
      NeighborhoodListStore.fetchAllItems();
    }
  }

  componentWillUnmount() {
    NeighborhoodListStore.unlisten(this.storeListener);
  }

  onChange(/*state*/) {
    this.setState({
      error: NeighborhoodListStore.getState().error,
      neighborhood: NeighborhoodListStore.getItem(this.props.params.id)
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

    if (NeighborhoodListStore.isLoading() || !this.state.neighborhood) {
      return this.handlePendingState();
    }

    let tab = this.props.params.tab || 1;

    return (
      <NeighborhoodsEdit neighborhood={this.state.neighborhood} tab={tab} />
    );
  }
}

export default NeighborhoodsEditContainer;
