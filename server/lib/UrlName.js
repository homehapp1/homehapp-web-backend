'use strict';

let Entities = require('html-entities').Html4Entities;
let entities = new Entities();

exports.urlName = function urlName(str) {
  let patterns = [
    ['&amp;', '_et_'],
    ['&([a-z])(cedil|elig|lpha|slash|tilde|acute|circ|grave|zlig|uml);', '$1'],
    ['[^0-9a-z\.\-]', '_'],
    ['^[\\-_\\.]+', ''],
    ['[\\-_\\.]+$', ''],
    ['_{2,}', '_'],
    ['_?\\-_?', '-'],
    ['\\.{2,}', '.'],
    ['\\s+', '_']
  ];

  let tmp = entities.encode(str.toLowerCase());
  let encoded = tmp;

  for (let pattern of patterns) {
    let regexp = new RegExp(pattern[0], 'ig');
    encoded = encoded.replace(regexp, pattern[1]);
    console.log('--', pattern[0], '->', pattern[1], ':', encoded);
  }
  console.log(str, tmp, encoded);
  return encoded;
};
