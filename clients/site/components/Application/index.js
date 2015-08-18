'use strict';

import React from 'react';
let {RouteHandler} = require('react-router');

//import ApplicationStore from '../../../common/stores/ApplicationStore';

import Header from '../Header';
import Navigation from '../Navigation';
import Footer from '../Footer';
import Layout from '../../../common/components/Layout';

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
      <Layout>
        <Navigation {...this.props} />
        <Header {...this.props} />
        <div id='container'>
          <RouteHandler />
        </div>
        <Footer {...this.props} />
      </Layout>
    );
  }
}

export default Application;
