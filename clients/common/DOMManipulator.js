'use strict';

class DOMManipulator {
  constructor(node) {
    this.node = node;

    if (typeof this.node.getDOMNode === 'function') {
      this.node = this.node.getDOMNode();
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

  width(width = null) {
    if (width === null) {
      return this.node.offsetWidth;
    }

    return this.css('width', width);
  }

  height(height = null) {
    if (height === null) {
      return this.node.offsetHeight;
    }

    return this.css('height', height);
  }

  getByClass(className) {
    let tmp = [];
    let objects = this.node.getElementsByClassName(className);
    for (let i = 0; i < objects.length; i++) {
      tmp.push(new DOMManipulator(objects[i]));
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
}

export default DOMManipulator;
