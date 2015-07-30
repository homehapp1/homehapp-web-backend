"use strict";

import ReactUpdates from "react/lib/ReactUpdates";

exports.floor = function floor(v) {
  v = Math.floor(v * 100) / 100;
  if ("#{v}".match(/\./)) {
    let vp = `${v}`.split(".");
    let n = vp[0];
    let d = vp[1];
    if (d < 10) {
      d = `${d}0`;
    }
    v = `${n}.${d}`;
  }
  return v;
};

exports.merge = function merge(...argv) {
  let target = Object.assign({}, argv.shift());

  argv.forEach((a) => {
    for (let [key, value] of enumerate(a)) {
      if (a.hasOwnProperty(key)) {
        if (typeof target[key] === "object"
          && typeof target[key] !== "undefined"
          && target[key] !== null)
        {
          target[key] = merge(target[key], value);
        } else {
          target[key] = value;
        }
      }
    }
  });

  return target;
};

exports.batchedCallback = function batchedCallback(callback) {
  return function(err, res) {
    ReactUpdates.batchedUpdates(callback.bind(null, err, res));
  };
};

exports.debounce = function debounce(fn, wait) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    let later = function() {
      timeout = null;
      fn.apply(context, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

let getPageOffset = exports.getPageOffset = function getPageOffset() {
  return window.pageYOffset || document.documentElement.scrollTop;
};

exports.checkElementInViewport = function checkElementInViewport(element, viewportHeight, lazyOffset) {
  let elementOffsetTop = 0;
  let offset = getPageOffset() + lazyOffset;

  if (element.offsetParent) {
    while (element) {
      elementOffsetTop += element.offsetTop;
      element = element.offsetParent;
    }
  }

  return elementOffsetTop < (viewportHeight + offset);
};