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

exports.merge = function merge(...argv) {
  let target = Object.assign({}, argv.shift());

  argv.forEach((a) => {
    for (let key in a) {
      let value = a[key];
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

exports.createProperty = function(index = 1) {
  // @TODO: This part is to be removed when the API connection provides proper data
  var randomSeed = function(min, max, precision = 0) {
    if (precision) {
      return Number((min + max * Math.random()).toFixed(precision));
    }

    return min + Math.floor(max * Math.random());
  };

  var getRandom = function (arr, l = 0) {
    if (l) {
      l = Math.min(arr.length, l);
      let rval = [];
      let i = 0;

      while (rval.length < l) {
        let opt = getRandom(arr);
        if (rval.indexOf(opt) === -1) {
          rval.push(opt);
        }

        i++;

        // Overflow protection and throttling
        if (i > 100) {
          break;
        }
      }
      return rval;
    }

    let seed = randomSeed(0, arr.length);
    return arr[seed];
  };

  // Create a random card for demo purposes only
  return {
    slug: index,
    images: getRandom(['v1439796815/contentMockup/DSCF9347.jpg', 'v1439796815/contentMockup/DSCF9253.jpg', 'v1439796812/contentMockup/DSCF9310.jpg', 'v1439796810/contentMockup/DSCF9299.jpg', 'v1439796803/contentMockup/DSCF9261.jpg', 'v1439796800/contentMockup/DSCF9339.jpg', 'v1439796799/contentMockup/DSCF9328.jpg', 'v1439796797/contentMockup/DSCF9272.jpg', 'v1439796794/contentMockup/DSCF9301.jpg', 'v1439796791/contentMockup/DSCF9188.jpg', 'v1439796791/contentMockup/DSCF9306.jpg', 'v1439796791/contentMockup/DSCF9280.jpg', 'v1439796780/contentMockup/DSCF9257.jpg', 'v1439796776/contentMockup/DSCF9245.jpg', 'v1439796775/contentMockup/DSCF9201.jpg', 'v1439796764/contentMockup/DSCF9227.jpg', 'v1439796763/contentMockup/DSCF9111.jpg', 'v1439796759/contentMockup/DSCF9158.jpg', 'v1439796753/contentMockup/DSCF9225.jpg', 'v1439796748/contentMockup/DSCF9144.jpg', 'v1439796743/contentMockup/DSCF9178.jpg', 'v1439796741/contentMockup/DSCF9156.jpg', 'v1439796733/contentMockup/DSCF9177.jpg', 'v1439796732/contentMockup/DSCF9160.jpg', 'v1439796719/contentMockup/DSCF9102.jpg', 'v1439796718/contentMockup/DSCF9155.jpg', 'v1439796708/contentMockup/DSCF9141.jpg', 'v1439796701/contentMockup/DSCF9097.jpg', 'v1439796699/contentMockup/DSCF9095.jpg', 'v1439796693/contentMockup/DSCF9108.jpg', 'v1439796687/contentMockup/DSCF9105.jpg', 'v1439796684/contentMockup/DSCF9103.jpg'], randomSeed(2, 10)),
    price: randomSeed(1, 5, 4),
    construction: getRandom(['Adobe', 'Brick', 'Concrete Block', 'Log', 'Metal', 'Stone', 'Straw', 'Wood']),
    exterior: getRandom(['Coastal view', 'City view', 'Hill view', 'By a river', 'Ocean view', 'Lakefront', 'Greenbelt', 'Golf Course', 'Suburban', 'City', 'Cul De Sac', 'Dead End Street', 'Gated Community']),
    style: getRandom(['A-Frame', 'Bungalow', 'Colonial', 'Contemporary', 'Cottage', 'Dome', 'Log', 'Mediterranean', 'Ranch', 'Spanish', 'Tudor', 'Victorian']),
    roof: getRandom(['Composition Shingle', 'Concrete Tile', 'Metal', 'Rock', 'Shake', 'Slate', 'Tar', 'Tile', 'Wood']),
    yard: getRandom(['Swimming Pool', 'Sport pool', 'Spa', 'Sauna', 'Steam Room', 'Fireplace or fire pit', 'Built-in BBQ', 'Outdoor Kitchen', 'Courtyard', 'Covered Patio', 'Uncovered Patio', 'Deck', 'Tennis Courts', 'Trees and Landscaping', 'Gardens', 'Lawn', 'Automatic Sprinklers', 'Drip', 'Misting System'], randomSeed(0, 4)),
    flooring: getRandom(['Carpeting', 'Concrete', 'Bamboo', 'Stone', 'Tile', 'Laminate', 'Cork', 'Vinyl / Linoleum', 'Manufactured Wood', 'Marble', 'Wood'], randomSeed(0, 4)),
    energy: getRandom(['Attic Fans', 'Ceiling Fans', 'Dual or Triple Pane Windows', 'Programmable Thermostats', 'Single Flush Toilets', 'Window Shutters', 'Solar Heat', 'Solar Plumbing', 'Solar Screens', 'Storm Windows', 'Tankless Water Heater', 'Skylights or Sky Tubes', 'Whole House Fan'], randomSeed(0, 4)),
    disabilityFeatures: getRandom(['Extra-Wide Doorways', 'Ramps', 'Grab Bars', 'Lower Counter Heights', 'Walk-in Tubs and Showers'], randomSeed(0, 2)),
    storified: (randomSeed(0, 4)) ? false : true,

    address: {
      street: '221 B Baker Street',
      city: 'London',
      country: 'GB'
    }
  };
};

exports.itemViews = function() {
  let tmp = document.getElementsByClassName('item');
  let items = [];

  if (tmp.length < 2) {
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
