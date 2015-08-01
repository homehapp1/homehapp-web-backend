'use strict';

import React from 'react';
import HomeStore from '../../stores/HomeStore';
import HomeActions from '../../actions/HomeActions';

import HomeStory from './Story';

class HomeContainer extends React.Component {
  static propTypes = {
    params: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.homeStoreListener = this.homeStoreOnChange.bind(this);
  }

  componentDidMount() {
    HomeStore.listen(this.homeStoreListener);
    HomeActions.fetchHome(this.props.params.slug);
  }

  componentWillUnmount() {
    HomeStore.unlisten(this.homeStoreListener);
  }

  state = {
    loading: false,
    error: null,
    home: HomeStore.getState().home
  }

  homeStoreOnChange(state) {
    if (state.home) {
      this.setState({home: state.home, loading: false, error: null});
    } else if (state.error) {
      this.setState({error: state.error, loading: false});
    } else {
      this.setState({home: null, error: null, loading: true});
    }
  }

  render() {
    if (this.state.loading || !this.state.home) {
      return (
        <div className='story-loader'>
          <h3>Loading story data...</h3>
        </div>
      );
    } else if (this.state.error) {
      return (
        <div className='story-error'>
          <h3>Error loading story!</h3>
          <p>{this.state.error.message}</p>
        </div>
      );
    }

    return (
      <HomeStory home={this.state.home} />
    );
  }
}

export default HomeContainer;
