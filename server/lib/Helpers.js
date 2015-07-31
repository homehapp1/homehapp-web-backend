"use strict";

import fs from "fs";
import path from "path";
import util from "util";
import uuid from "uuid";

exports.randomString = function randomString(len = 8) {
  let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  let randomStr = "";
  let cc = 0;
  while (cc < len) {
    cc++;
    var rnum = Math.floor(Math.random() * chars.length);
    randomStr += chars.substring(rnum, rnum + 1);
  }
  return randomStr;
};

let typeOf = exports.typeOf = function typeOf(input) {
  return ({}).toString.call(input).slice(8, -1).toLowerCase();
};

exports.toTitleCase = function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

exports.clone = function clone(input) {
  let output = input,
  type = typeOf(input),
  index, size;

  if (type === "array") {
    output = [];
    size = input.length;
    for (index = 0; index < size; ++index) {
      output[index] = clone(input[index]);
    }
  } else if (type === "object") {
    output = {};
    for (index in input) {
      output[index] = clone(input[index]);
    }
  }

  return output;
};

exports.walkDirSync = function walkDirSync(dir, opts={}) {
  if (opts.ext) {
    if (!util.isArray(opts.ext)) {
      opts.ext = [opts.ext];
    }
  }

  let results = [];
  fs.readdirSync(dir).forEach((file) => {
    file = path.join(dir, file);
    let stat = fs.statSync(file);
    if (stat.isDirectory()) {
      results = results.concat(walkDirSync(file, opts));
    } else {
      if (opts.ext && !(opts.ext.indexOf(path.extname(file)) !== -1)) {
        return;
      }
      results.push(file);
    }

  });
  return results;
};

exports.listDirSync = function listDirSync(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
};

exports.merge = function merge(...argv) {
  let target = Object.assign({}, argv.shift());

  argv.forEach((a) => {
    for (let [key, value] of enumerate(a)) {
      if (a.hasOwnProperty(key)) {
        if (require("util").isArray(target[key])) {
          target[key] = target[key].concat(value);
        } else if (typeof target[key] === "object"
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

exports.getEnvironmentValue = function getEnvironmentValue(envKey, defaultValue) {
  let value = defaultValue;
  if (process.env[envKey]) {
    value = process.env[envKey];
  }
  return value;
};

exports.generateUUID = function generateUUID() {
  return uuid.v4();
};

exports.pick = function pick (obj, keys) {
  let res = {};
  let i = 0;

  if (typeof obj !== "object") {
    return res;
  }

  if (typeof keys === "string") {
    if (keys in obj) {
      res[keys] = obj[keys];
    }
    return res;
  }

  let len = keys.length;

  while (len--) {
    var key = keys[i++];
    if (key in obj) {
      res[key] = obj[key];
    }
  }

  return res;
};

exports.union = function union(x, y) {
  var obj = {};
  for (var i = x.length - 1; i >= 0; --i) {
    obj[x[i]] = x[i];
  }
  for (var z = y.length - 1; x >= 0; --z) {
    obj[y[z]] = y[i];
  }
  var res = [];
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      res.push(obj[k]);
    }
  }

  return res;
};

exports.isEmpty = function isEmpty(val) {
  if (val === null) {
    return true;
  }
  if (require("util").isArray(val) || val.constructor === String) {
    return !val.length;
  }

  return false;
};

let enumerate = exports.enumerate = function* enumerate(obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
};
