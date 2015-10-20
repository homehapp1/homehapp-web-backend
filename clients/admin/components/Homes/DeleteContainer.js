import React from 'react';
import HomeListStore from '../../stores/HomeListStore';
import HomesDelete from './Delete';
import Loading from '../../../common/components/Widgets/Loading';
let debug = require('debug')('DeleteContainer');

export default class HomesDeleteContainer extends React.Component {
  static propTypes = {
    params: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onChange.bind(this);
  }

  state = {
    error: null,
    home: HomeListStore.getHome(this.props.params.id)
  }

  componentDidMount() {
    HomeListStore.listen(this.storeListener);
    if (!HomeListStore.getHome(this.props.params.id)) {
      HomeListStore.fetchHomes();
    }
  }

  componentWillUnmount() {
    HomeListStore.unlisten(this.storeListener);
  }

  onChange(state) {
    debug('state', state, HomeListStore.getState());
    this.setState({
      error: HomeListStore.getState().error,
      home: HomeListStore.getHome(this.props.params.id)
    });
  }

  handlePendingState() {
    return (
      <Loading>
        <h3>Loading home...</h3>
      </Loading>
    );
  }

  handleErrorState() {
    return (
      <div className='homes-error'>
        <h3>Error loading home!</h3>
        <p>{this.state.error.message}</p>
      </div>
    );
  }

  render() {
    if (this.state.error) {
      return this.handleErrorState();
    }
    debug('Home', this.state.home);

    if (HomeListStore.isLoading() || !this.state.home) {
      return this.handlePendingState();
    }

    return (
      <HomesDelete home={this.state.home} />
    );
  }
}
