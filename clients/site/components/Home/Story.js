"use strict";

import React from "react";
import { Link } from "react-router";

import HomeStore from "../../stores/HomeStore";
import HomeActions from "../../actions/HomeActions";

class HomeStory extends React.Component {
  static propTypes = {
    params: React.PropTypes.object
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.homeStoreListener = this.homeStoreOnChange.bind(this);
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
    if (this.state.loading) {
      return (
        <div className="story-loader">
          <h3>Loading story data...</h3>
        </div>
      );
    } else if (this.state.error) {
      return (
        <div className="story-error">
          <h3>Error loading story!</h3>
          <p>{this.state.error.message}</p>
        </div>
      );
    }

    return (
      <div className="story">
        <h1>{this.state.home.title} Story for {this.props.params.slug}</h1>
        <Link to="homeDetails" params={{slug: this.props.params.slug}}>Got to details</Link>
        <p>
          <Link to="app">Back to frontpage</Link>
        </p>
      </div>
    );
  }
}

export default HomeStory;
