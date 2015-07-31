'use strict';

import React from 'react';
import { Link } from 'react-router';

class HomeDetails extends React.Component {
  static propTypes = {
    params: React.PropTypes.object
  }

  render() {
    return (
      <div className='details'>
        <h1>Home Details for {this.props.params.slug}</h1>
        <Link to='home' params={{slug: this.props.params.slug}}>Back to story</Link>
      </div>
    );
  }
}

export default HomeDetails;
