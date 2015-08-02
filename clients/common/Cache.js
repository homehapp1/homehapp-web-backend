'use strict';

let debug = require('./debugger')('Cache');

// dummy storage, normally use Local Storage
let _storage = {};

class Cache {
  constructor() {
    this.ttl = 60 * 60 * 1000; // 1 hour
  }
  getStorage(group) {
    if (!_storage[group]) {
      _storage[group] = {};
    }
    return _storage;
  }
  has(group, key) {
    debug('has', group, key);
    // TODO: Validate TTL also
    let storage = this.getStorage(group);
    return storage.hasOwnProperty(key);
  }
  get(group, key) {
    debug('get', group, key);
    // TODO: Get item from real storage,get value and return it
    let storage = this.getStorage(group);
    return storage[key];
  }
  set(group, key, value) {
    debug('set', group, key);
    // TODO: Should save object to storage which includes timestamp
    let storage = this.getStorage(group);
    storage[key] = value;
  }
  fill(group, values) {
    debug('fill', group, values);
    // TODO: Should save objects to storage which includes timestamps
    let storage = this.getStorage(group);
    storage = values;
  }
}

module.exports = new Cache();
