'use strict';

import React from 'react';
import { setFullHeight } from '../../Helpers';
import DOMManipulator from '../../DOMManipulator';

let debug = require('debug')('BigBlock');

export default class BigBlock extends React.Component {
  constructor() {
    super();
    this.onScroll = this.onScroll.bind(this);
    this.containerTolerance = 0;
  }

  componentDidMount() {
    this.onMounted();
  }

  componentWillUnmount() {
    this.onUnmount();
  }

  onMounted() {
    setFullHeight();
    try {
      this.container = new DOMManipulator(this.refs.container);
    } catch (error) {
      this.container = null;
    }
    window.addEventListener('scroll', this.onScroll, false);
    this.onScroll();
  }

  onUnmount() {
    window.removeEventListener('scroll', this.onScroll, false);
  }

  onDisplayContainer() {
    debug('onDisplayContainer');
  }

  onHideContainer() {
    debug('onHideContainer');
  }

  onScroll() {
    if (!this.container) {
      return;
    }
    if (this.container.visible(this.containerTolerance)) {
      if (this.container.attr('data-viewport') !== 'visible') {
        debug('Reveal container');
        this.container.attr('data-viewport', 'visible');
        this.onDisplayContainer();
      }
    } else {
      if (this.container.attr('data-viewport') !== 'outside') {
        debug('Hide container');
        this.container.attr('data-viewport', 'outside');
        this.onHideContainer();
      }
    }
  }
}
