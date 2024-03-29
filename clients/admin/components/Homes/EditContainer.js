import React from 'react';
import HomeListStore from '../../stores/HomeListStore';
import HomesEdit from './Edit';
import Loading from '../../../common/components/Widgets/Loading';
let debug = require('debug')('EditContainer');

export default class HomesEditContainer extends React.Component {
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
        <h3>Loading homes...</h3>
      </Loading>
    );
  }

  handleErrorState() {
    return (
      <div className='homes-error'>
        <h3>Error loading homes!</h3>
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

    let tab = this.props.params.tab || 1;

    return (
      <HomesEdit home={this.state.home} tab={tab} />
    );
  }
}
