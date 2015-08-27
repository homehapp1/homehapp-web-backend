'use strict';

import React from 'react';

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

  removeEvent(eventName, fn) {
    this.node.removeEventListener(eventName, fn, capture);
  }

  css(args, value = null) {
    if (typeof args === 'string' && typeof value === 'string') {
      this.node.style[args] = value;
      return this;
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
      console.log('parent', node, skipLevels);
    } while (skipLevels >= 0);

    return new DOMManipulator(node);
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
}

export default DOMManipulator;
