'use strict';

class DOMManipulator {
  constructor(node) {
    this.node = node;
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

  addEvent(eventName, fn) {
    this.node.addEventListener(eventName, fn, true);
  }

  removeEvent(eventName, fn) {
    this.node.removeEventListener(eventName, fn);
  }
}

export default DOMManipulator;
