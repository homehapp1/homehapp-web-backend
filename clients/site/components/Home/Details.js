'use strict';

import React from 'react';
import { Link } from 'react-router';

class HomeDetails extends React.Component {
  static propTypes = {
    home: React.PropTypes.object.isRequired
  }

  render() {
    return (
      <div className='details'>
        <h1>Home Details for {this.props.home.slug}</h1>
        <p>{this.props.home.description}</p>
        <Link to='home' params={{slug: this.props.home.slug}}>Back to story</Link>
      </div>
    );
  }
}

export default HomeDetails;
