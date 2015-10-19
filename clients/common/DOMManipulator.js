

import React from 'react';
let debug = require('debug')('DOMManipulator');

class DOMManipulator {
  constructor(node) {
    try {
      let dom = React.findDOMNode(node);

      if (!dom) {
        throw new Error('Not a React node');
      }

      this.node = dom;
    } catch (error) {
      this.node = node;
    }
  }

  hasClass(className) {
    let regexp = new RegExp(`(^| )${className}($| )`);
    if (this.node.className.match(regexp)) {
      return true;
    }

    return false;
  }

  addClass(className) {
    if (this.hasClass(className)) {
      return this;
    }

    if (this.node.className) {
      this.node.className += ` ${className}`;
    } else {
      this.node.className = className;
    }

    return this;
  }

  removeClass(className) {
    if (!this.hasClass(className)) {
      return this;
    }
    let regexp = new RegExp(`(^| )${className}($| )`);
    this.node.className = this.node.className.replace(regexp, ' ').replace(/[ ]{2,}/, ' ').replace(/^ /, '').replace(/ $/, '');
    return this;
  }

  addEvent(eventName, fn, capture = false) {
    this.node.addEventListener(eventName, fn, capture);
  }

  removeEvent(eventName, fn, capture = false) {
    this.node.removeEventListener(eventName, fn, capture);
  }

  css(args, value = null) {
    if (typeof args === 'string') {
      if (value) {
        this.node.style[args] = value;
        return this;
      }
      return (this.node.currentStyle) ? this.node.currentStyle[args] : getComputedStyle(this.node, null)[args];
    }

    for (let i in args) {
      this.node.style[i] = args[i];
    }
    return this;
  }

  /**
   * Get or set an attribute of the current node
   *
   * @params key    string   Attribute key
   * @params value  mixed    When undefined, act as a getter, otherwise set the attribute
   * @return self
   */
  attr(key, value = undefined) {
    if (value === undefined) {
      if (this.node.hasAttribute(key)) {
        return this.node.getAttribute(key);
      }
      return undefined;
    }

    if (value === null) {
      this.node.removeAttribute(key);
    } else {
      this.node.setAttribute(key, value);
    }

    return this;
  }

  /**
   * Get or set the node width
   *
   * @params number width   Either the width to be set or null to return the current width
   * @return mixed          Current width when getting, self when setting
   */
  width(width = null) {
    if (width === null) {
      return this.node.offsetWidth;
    }

    return this.css('width', `${width}px`);
  }

  /**
   * Get or set the node height
   *
   * @params number height   Either the height to be set or null to return the current height
   * @return mixed           Current height when getting, self when setting
   */
  height(height = null) {
    if (height === null) {
      return this.node.offsetHeight;
    }

    return this.css('height', `${height}px`);
  }

  getByClass(className) {
    let tmp = [];
    let objects = this.node.getElementsByClassName(className);
    for (let i = 0; i < objects.length; i++) {
      tmp.push(new DOMManipulator(objects[i]));
    }
    return tmp;
  }

  getByTagName(tag) {
    let tmp = [];
    let objects = this.node.getElementsByTagName(tag);
    for (let i = 0; i < objects.length; i++) {
      tmp.push(new DOMManipulator(objects[i]));
    }
    return tmp;
  }

  getNode() {
    return this.node;
  }

  parent(skipLevels = 0) {
    let node = this.node;

    do {
      if (!node.parentNode) {
        throw new Exception('This node has no parents', this.node);
      }
      node = node.parentNode;
      skipLevels--;
    } while (skipLevels >= 0);

    return new DOMManipulator(node);
  }

  children() {
    let children = this.node.children;
    let tmp = [];

    for (let i = 0; i < children.length; i++) {
      tmp.push(new DOMManipulator(children[i]));
    }
    return tmp;
  }

  visible(tolerance = 0) {
    let el = this.node;
    var top = el.offsetTop;
    var height = el.offsetHeight;

    while(el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
    }

    return (
      top - tolerance < (window.pageYOffset + window.innerHeight) &&
      (top + height + tolerance) > window.pageYOffset
    );
  }

  isFullscreen() {
    return !(!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement);
  }

  enterFullscreen() {
    debug('Enter fullscreen');
    if (this.node.requestFullscreen) {
      return this.node.requestFullscreen();
    } else if (this.node.msRequestFullscreen) {
      return this.node.msRequestFullscreen();
    } else if (this.node.mozRequestFullScreen) {
      return this.node.mozRequestFullScreen();
    } else if (this.node.webkitRequestFullscreen) {
      return this.node.webkitRequestFullscreen();
    }
    return false;
  }

  exitFullscreen() {
    debug('Exit fullscreen');
    if (document.exitFullscreen) {
      return document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      return document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      return document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      return document.webkitExitFullscreen();
    }

    return false;
  }

  toggleFullscreen(onEnter = null, onExit = null) {
    if (document.fullscreenEnabled) {
      debug('Fullscreen not enabled');
    }
    let events = ['webkitfullscreenchange', 'mozfullscreenchange', 'fullscreenchange', 'MSFullscreenChange'];
    let fsChange = function() {
      debug('fsChange', this.isFullscreen());
      if (this.isFullscreen()) {
        if (typeof onEnter === 'function') {
          onEnter();
        }
      } else {
        if (typeof onExit === 'function') {
          onExit();
        }
        for (let event of events) {
          debug('removeEventListener', event);
          document.removeEventListener(event, fsChange);
        }
      }
    };
    fsChange = fsChange.bind(this);

    for (let event of events) {
      debug('addEventListener', event);
      document.addEventListener(event, fsChange);
    }

    if (this.isFullscreen()) {
      this.exitFullscreen();
    } else {
      this.enterFullscreen();
    }
  }
}

export default DOMManipulator;
