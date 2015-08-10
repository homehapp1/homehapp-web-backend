'use strict';

import React from 'react';
import { Link } from 'react-router';
import { setFullHeight } from '../../../common/Helpers';

class HomeStory extends React.Component {
  static propTypes = {
    home: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setFullHeight();
  }

  render() {
    return (
      <div className='story'>
        <h1>{this.props.home.title} Story for {this.props.home.slug}</h1>
        <Link to='homeDetails' params={{slug: this.props.home.slug}}>Got to details</Link>
        <p>
          <Link to='app'>Back to frontpage</Link>
        </p>
      </div>
    );
  }
}

export default HomeStory;
