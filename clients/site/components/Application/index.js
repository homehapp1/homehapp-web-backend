'use strict';

import React from 'react';
let {RouteHandler} = require('react-router');

import Header from '../Header';
import Navigation from '../Navigation';
import Footer from '../Footer';
import Layout from '../../../common/components/Layout';
import GoogleAnalytics from '../../../common/components/Analytics/GoogleAnalytics';

let debug = require('debug')('Application');

export default class Application extends React.Component {
  static propTypes = {
    context: React.PropTypes.object
  }

  static contextTypes = {
    router: React.PropTypes.func
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
    debug(this.context.router);
    return (
      <Layout>
        <Navigation {...this.props} />
        <Header {...this.props} />
        <div id='container'>
          <RouteHandler />
        </div>
        <Footer {...this.props} />
        <GoogleAnalytics router={this.context.router} />
      </Layout>
    );
  }
}
