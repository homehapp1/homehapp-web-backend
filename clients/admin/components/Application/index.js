'use strict';

import React from 'react';
let {RouteHandler} = require('react-router');

//import ApplicationStore from '../../../common/stores/ApplicationStore';

import Layout from '../Layout';
import Navigation from '../Navigation';

class Application extends React.Component {
  static propTypes = {
    // autoPlay: React.PropTypes.bool.isRequired,
    // maxLoops: React.PropTypes.number.isRequired,
    // posterFrameSrc: React.PropTypes.string.isRequired,
  }
  static defaultProps = {
  }

  constructor(props) {
    super(props);
    // Operations usually carried out in componentWillMount go here
  }

  state = {
    // loopsRemaining: this.props.maxLoops,
  }

  render() {
    return (
      <div>
        <Navigation {...this.props} />
        <Layout>
          <RouteHandler />
        </Layout>
      </div>
    );
  }
}

export default Application;
