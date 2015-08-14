'use strict';

import ReactUpdates from 'react/lib/ReactUpdates';

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

  for (let i = 0; i < items.length; i++) {
    items[i].style.minHeight = `${height}px`;
  }

  items = document.getElementsByClassName('full-height-strict');

  for (let i = 0; i < items.length; i++) {
    items[i].style.height = `${height}px`;
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
    images: getRandom(['v1436955664/DSCF9259_gjc84p', 'v1436955433/DSCF9129_vkms23', 'v1436955385/DSCF9098_ynzhue', 'v1436955372/DSCF9096_iqxiyh', 'v1436955483/DSCF9157_bsxil9', 'v1436955483/DSCF9158_bl9klb', 'v1436955629/DSCF9247_ebbijd'], randomSeed(2, 10)),
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
