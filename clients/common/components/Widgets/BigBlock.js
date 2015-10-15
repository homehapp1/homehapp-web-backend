'use strict';

import React from 'react';
import { setFullHeight, scrollTop } from '../../Helpers';
import DOMManipulator from '../../DOMManipulator';

let debug = require('debug')('BigBlock');

export default class BigBlock extends React.Component {
  constructor() {
    super();
    this.onScroll = this.onScroll.bind(this);
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
    debug('Scrolling', this.container);
    if (!this.container) {
      debug('No container :(');
      return;
    }
    if (this.container.visible()) {
      debug(this.container, 'is visible');
      if (this.container.attr('data-viewport') !== 'visible') {
        this.container.attr('data-viewport', 'visible');
        this.onDisplayContainer();
      }
    } else {
      debug(this.container, 'is NOT visible');
      if (this.container.attr('data-viewport') !== 'outside') {
        this.container.attr('data-viewport', 'outside');
        this.onHideContainer();
      }
    }
  }
}
