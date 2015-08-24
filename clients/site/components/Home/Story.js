'use strict';

import React from 'react';
import { Link } from 'react-router';

class HomeStory extends React.Component {
  static propTypes = {
    home: React.PropTypes.object.isRequired
  }

  render() {
    return (
      <div className='story'>
        <h1>{this.props.home.title} Story for {this.props.home.slug}</h1>
        <Link to='homeDetails' params={{slug: this.props.home.slug}}>Go to details</Link>
        <p>
          <Link to='app'>Back to frontpage</Link>
        </p>
      </div>
    );
  }
}

export default HomeStory;
