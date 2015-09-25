'use strict';

import ReactUpdates from 'react/lib/ReactUpdates';
import DOMManipulator from './DOMManipulator';

exports.floor = function floor(v) {
  v = Math.floor(v * 100) / 100;
  if ('#{v}'.match(/\./)) {
    let vp = `${v}`.split('.');
    let n = vp[0];
    let d = vp[1];
    if (d < 10) {
      d = `${d}0`;
    }
    v = `${n}.${d}`;
  }
  return v;
};

exports.setCDNUrlProperties = function(url, props) {
  let propStr = '';
  for (let [key, val] of enumerate(props)) {
    propStr += `${key}_${val},`;
  }
  propStr = propStr.substr(0, propStr.length - 1);

  let re = /^(https?:\/\/res.cloudinary.com\/\w+\/\w+\/upload\/)(\w+)/;
  url = url.replace(re, `$1${propStr}/$2`);

  return url;
};

exports.merge = function merge(...argv) {
  let target = Object.assign({}, argv.shift());

  argv.forEach((a) => {
    for (let [key, value] of enumerate(a)) {
      if (a.hasOwnProperty(key)) {
        if (typeof target[key] === 'object'
          && typeof target[key] !== 'undefined'
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

exports.scrollTop = function(offset = null, speed = 500) {
  if (offset === null) {
    return window.pageYOffset || document.documentElement.scrollTop;
  }

  let f = 5;
  let init = document.documentElement.scrollTop + document.body.scrollTop;
  let c = Math.ceil(speed / f);
  let i = 0;

  // Invalid count
  if (c <= 0) {
    return null;
  }

  let dy = (offset - init) / c;
  let nextHop = function() {
    i++;
    window.scrollTo(0, init + dy * i);

    if (i < c) {
      setTimeout(nextHop, f);
    }
  };

  nextHop();
};

exports.setFullHeight = function() {
  let items = document.getElementsByClassName('full-height');
  let height = window.innerHeight;

  let setHeight = function(item, strict = false) {
    let h = height;

    if (item.hasAttribute('data-proportion')) {
      let prop = Number(item.getAttribute('data-proportion'));

      if (prop > 0) {
        h = Math.round(h * prop);
      }
    }

    h = Math.max(650, h);
    let dh = h / item.offsetHeight;

    // Don't change anything, if the changed height differs less
    // than 10% of the previous. Especially on iPad and iPhone
    // the flickering caused by the lack of this looks very bad
    if (Math.abs(dh - 1) < 0.1) {
      return;
    }

    if (strict) {
      item.style.height = `${h}px`;
    } else {
      item.style.minHeight = `${h}px`;
    }
  };

  for (let i = 0; i < items.length; i++) {
    setHeight(items[i], false);
  }

  items = document.getElementsByClassName('full-height-strict');

  for (let i = 0; i < items.length; i++) {
    setHeight(items[i], true);
  }
};

exports.itemViews = function() {
  let tmp = document.getElementsByClassName('item');
  let items = [];

  if (!tmp.length) {
    return null;
  }

  for (let i = 0; i < tmp.length; i++) {
    if (!tmp[i].className.match(/\bfixed\b/)) {
      continue;
    }
    items.push(tmp[i]);
  }

  for (let i = 0; i < items.length; i++) {
    let item = new DOMManipulator(items[i]);

    // Check if the element is in the viewport with a small tolerance AFTER
    // the element should be displayed
    if (!item.visible() && items.length > 1) {
      item.addClass('outside-viewport');
    } else {
      item.removeClass('outside-viewport');
    }
  }
};

exports.formatPrice = function(price) {
  if (!price) {
    return '';
  }

  return `£${String(Math.round(price)).replace(/(\d)(?=(\d{3})+$)/g, '$1,')}`;
};

exports.literals = function(q, type = 'base') {
  let rval = (type === 'ordinal') ? `${q}th` : String(q);

  switch (q % 10) {
    case 1:
      if (q < 10) {
        rval = (type === 'ordinal') ? 'first' : 'one';
      } else if (q > 20 && type === 'ordinal') {
        rval = `${q}st`;
      }
      break;

    case 2:
      if (q < 10) {
        rval = (type === 'ordinal') ? 'second' : 'two';
      } else if (q > 20 && type === 'ordinal') {
        rval = `${q}nd`;
      }
      break;

    case 3:
      if (q < 10) {
        rval = (type === 'ordinal') ? 'third' : 'three';
      } else if (q > 20 && type === 'ordinal') {
        rval = `${q}rd`;
      }
      break;
  }

  return rval;
};

exports.capitalize = function(str) {
  return str && str[0].toUpperCase() + str.slice(1);
};

// The contents of this function are open for discussion. Currently
// this method extrapolates some values, trying to make sane results
exports.primaryHomeTitle = function(home) {
  if (home.title) {
    return home.title;
  }

  let parts = [];
  for (let i = 0; i < home.attributes.length; i++) {
    let c = home.attributes[i];
    switch (c.name) {
      case 'rooms':
        parts.push(`${exports.literals(c.value)} room apartment`);
        break;

      // case 'floor':
      //   parts.push(`${exports.literals(c.value, 'ordinal')} floor`);
      //   break;
    }
  }

  let location = [];

  if (home.location.address.street) {
    location.push(` on ${home.location.address.street}`);
  }

  if (home.location.neighborhood) {
    location.push(` in ${home.location.neighborhood.title}`);
  }

  if (home.location.address.city) {
    location.push(`, ${home.location.address.city}`);
  }

  return exports.capitalize(`${parts.join(', ')}${location.join('')}`);
};

let enumerate = exports.enumerate = function* enumerate(obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
};

exports.randomNumericId = function randomNumericId() {
  return Math.round((new Date()).getTime() + (Math.random(0, 1000) * 100));
};

exports.moveToIndex = function moveToIndex(arr, currentIndex, newIndex) {
  if (newIndex >= arr.length) {
    var k = newIndex - arr.length;
    while ((k--) + 1) {
      arr.push(undefined);
    }
  }
  arr.splice(newIndex, 0, arr.splice(currentIndex, 1)[0]);
  return arr;
};

exports.setPageTitle = function setPageTitle(title) {
  console.log('document', typeof document);
  if (typeof document === 'undefined' || typeof document.title === 'undefined') {
    return null;
  }
  // Always append with the site title
  title = String(title).replace(/ \| Homehapp$/, '') + ' | Homehapp';
  document.title = title;
};
