import ReactUpdates from 'react/lib/ReactUpdates';
import DOMManipulator from './DOMManipulator';
let debug = require('debug')('Helpers');

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

exports.setCDNUrlProperties = function setCDNUrlProperties(url, props) {
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
        if (Array.isArray(target[key])) {
          target[key] = target[key].concat(value);
        } else if (typeof target[key] === 'object'
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

exports.scrollTop = function scrollTop(offset = null, speed = 500) {
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

  if (speed < 10) {
    window.scrollTo(0, init + dy * i);
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

let orientation = null;

exports.getOrientation = function getOrientation() {
  if (window.innerHeight > window.innerWidth) {
    return 'portrait';
  }

  return 'landscape';
}

exports.setFullHeight = function setFullHeight() {
  let height = window.innerHeight;

  let iosHeights = [
    1302, // iPad Pro portrait,

    960, // iPad retina portrait, iPad Pro landscape
    704, // iPad retina landscape,

    628, // iPhone 6(s)+ portrait
    414, // iPhone 6(s)+ landscape

    559, // iPhone 6(s) portrait
    375, // iPhone 6(s) landscape

    460, // iPhone 5(s) portrait
    320, // iPhone 5(s) landscape

    372, // iPhone 4(s) portrait
    320 // iPhone 4(s) landscape
  ];

  // Prevent resizing the iOS device full heights, because scrolling will
  // otherwise cause a nasty side effect
  if (/iPad|iPhone|iPod/.test(navigator.platform)) {
    if (orientation === exports.getOrientation()) {
      return null;
    }

    orientation = exports.getOrientation();

    let closest = iosHeights[0];

    for (let h of iosHeights) {
      if (Math.abs(h - height) < Math.abs(closest - height)) {
        closest = h;
      }
    }

    height = closest;
  }

  let setHeight = function(item, strict = false, max = 650) {
    let h = height;

    if (item.hasAttribute('data-proportion')) {
      let prop = Number(item.getAttribute('data-proportion'));

      if (prop > 0) {
        h = Math.round(h * prop);
      }
    }

    h = Math.max(max, h);
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

  let items = document.getElementsByClassName('aspect-ratio');
  for (let item of items) {
    let ar = Number(item.getAttribute('data-aspect-ratio'));
    if (!ar) {
      continue;
    }

    item.style.height = `${Math.round(window.innerWidth / ar)}px`;
  }

  items = document.getElementsByClassName('full-height-always');
  for (let item of items) {
    setHeight(item, false, 0);
  }

  if (window && window.innerWidth <= 640) {
    items = document.getElementsByClassName('full-height-small');
    for (let item of items) {
      setHeight(item, false, 0);
    }

    items = document.getElementsByClassName('full-height');
    for (let item of items) {
      if (item.className.match(/full-height-(always|small)/)) {
        continue;
      }
      item.style.height = null;
      item.style.minHeight = null;
    }

    items = document.getElementsByClassName('full-height-strict');
    for (let item of items) {
      if (item.className.match(/full-height-always/)) {
        continue;
      }
      item.style.height = null;
      item.style.minHeight = null;
    }

    return null;
  }

  items = document.getElementsByClassName('full-height');
  for (let item of items) {
    setHeight(item, false);
  }

  items = document.getElementsByClassName('full-height-strict');
  for (let item of items) {
    setHeight(item, true);
  }
};

exports.itemViews = function itemViews() {
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

exports.literals = function literals(q, type = 'base') {
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

exports.capitalize = function capitalize(str) {
  return str && str[0].toUpperCase() + str.slice(1);
};

// The contents of this function are open for discussion. Currently
// this method extrapolates some values, trying to make sane results
exports.primaryHomeTitle = function primaryHomeTitle(home) {
  if (home.title) {
    return home.title;
  }

  let parts = [];
  let attributes = home.attributes || [];
  for (let c of attributes) {
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

exports.setPageTitle = function setPageTitle(title = '') {
  if (typeof document === 'undefined' || typeof document.title === 'undefined') {
    return null;
  }

  if (!Array.isArray(title)) {
    title = [title];
  }

  // Always append with the site title
  if (title.indexOf('Homehapp') === -1) {
    title.push('Homehapp');
  }
  document.title = title.join(' | ');
};

exports.initMetadata = function initMetadata(res) {
  if (typeof res.locals === 'undefined') {
    res.locals = {};
  }

  if (typeof res.locals.openGraph === 'undefined') {
    res.locals.openGraph = {
      'og:image': []
    };
  }

  if (typeof res.locals.metadatas === 'undefined') {
    res.locals.metadatas = [];
  }
};

exports.setLastMod = function setLastMod(objects, res) {
  let lastMod = null;

  if (!Array.isArray(objects)) {
    objects = [objects];
  }

  for (let object of objects) {
    if (!object || typeof object.updatedAt === 'undefined') {
      continue;
    }

    try {
      lastMod = Math.max(lastMod, object.updatedAt);
    } catch (error) {
      debug('Failed to use object.updatedAt, but continue as it is nothing fatal');
    }
  }

  if (!res) {
    debug('Cannot set the last modified meta tags, missing argument `res`');
  }

  if (lastMod && res) {
    exports.initMetadata(res);
    let date = new Date(lastMod);
    try {
      res.locals.openGraph['og:updated_time'] = date.toISOString();
      res.locals.metadatas.push({
        'http-equiv': 'last-modified',
        'content': res.locals.openGraph['og:updated_time']
      });

    } catch (error) {
      debug('Failed to set the last-modified', error.message);
    }
  }
  return lastMod;
};

exports.createNotification = function createNotification(d) {
  if (typeof document === 'undefined') {
    console.error('document is not defined');
    return null;
  }

  let container = document.getElementById('notifications');
  let data = {
    type: d.type || 'info',
    label: d.label || null,
    message: d.message || '',
    duration: d.duration || 5
  };
  // Translate table for wider support range of type keywords
  let translate = {
    error: 'danger'
  };
  if (typeof translate[data.type] !== 'undefined') {
    data.type = translate[data.type];
  }

  // Set duration to zero if the original duration was not set for
  // danger type
  if (data.type === 'danger' && !d.duration) {
    data.duration = 0;
  }

  let notification = document.createElement('div');
  notification.className = 'notification';

  let alert = document.createElement('div');
  alert.className = `data alert-${data.type} alert`;

  let message = document.createElement('message');

  if (data.label) {
    message.innerHTML = `<strong>${data.label}:</strong> ${data.message}`;
  } else {
    message.innerHTML = data.message;
  }

  let closeNotification = function closeNotification() {
    if (notification.hover) {
      setTimer();
      return false;
    }
    notification.className += ' away';
    // Remove the DOM node after a delay, allowing the animations to finish
    // setTimeout(function() {
    //   if (notification.parentNode) {
    //     // notification.parentNode.removeChild(notification);
    //   }
    // }, 2000);
  };

  let forceCloseNotification = function forceCloseNotification() {
    notification.hover = false;
    closeNotification();
  };

  let setTimer = function setTimer() {
    if (data.duration > 0) {
      setTimeout(closeNotification, data.duration * 1000);
    }
  };
  setTimer();

  let close = document.createElement('span');
  close.className = 'close';
  close.textContent = '×';
  close.addEventListener('click', forceCloseNotification);
  alert.appendChild(message);
  alert.appendChild(close);
  notification.appendChild(alert);
  container.appendChild(notification);

  notification.addEventListener('mouseover', () => {
    notification.hover = true;
  });
  notification.addEventListener('mouseout', () => {
    notification.hover = false;
  });
  // Close with a slight delay to give user time to see the notification
  // at least once
  notification.close = function() {
    setTimeout(forceCloseNotification, 500);
  };
  return notification;
};
