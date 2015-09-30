/*global window, process */
'use strict';

let debug = require('./debugger')('Cache');

let getTimestamp = () => {
  return Math.round((new Date()).getTime() / 1000);
};

let hasLocalStorageSupport = () => {
  try {
    return 'localStorage' in window && window.localStorage !== null;
  } catch (e) {
    return false;
  }
};

class CacheStorage {
  constructor(config) {
    this.config = config;
    this.initialize();
  }
  initialize() {}
  hasValue(/*group, key*/) {
    return false;
  }
  getValue(/*group, key*/) {
    return null;
  }
  setValue(/*group, key, value*/) {
    return false;
  }
  _isValidItem(cachedItem) {
    let tsNow = getTimestamp();
    if ((tsNow - cachedItem.timestamp) < this.config.ttl) {
      if (cachedItem.data !== null) {
        return true;
      }
    }
    return false;
  }
}

class LocalStorage extends CacheStorage {
  initialize() {
    this._storage = window.localStorage;
  }
  hasValue(group, key) {
    let groupKey = this._generateGroupKey(group, key);
    let cachedValue = JSON.parse(this._storage.getItem(groupKey));
    if (!cachedValue) {
      return false;
    }
    return this._isValidItem(cachedValue);
  }
  getValue(group, key) {
    if (!this.hasValue(group, key)) {
      return null;
    }
    let groupKey = this._generateGroupKey(group, key);
    let cachedValue = JSON.parse(this._storage.getItem(groupKey));
    if (!cachedValue) {
      return null;
    }
    return cachedValue.data;
  }
  setValue(group, key, value) {
    let groupKey = this._generateGroupKey(group, key);
    let cachedValue = {
      timestamp: getTimestamp(),
      data: value
    };

    try {
      this._storage.setItem(groupKey, JSON.stringify(cachedValue));
    } catch (err) {
      if (err.code === 'QUOTA_EXCEEDED_ERR') {
        this._storage.clear();
        return false;
      }
    }

    return true;
  }
  _generateGroupKey(group, key) {
    return `${group}.${key}`;
  }
}

class MemoryStorage extends CacheStorage {
  initialize() {
    this._storage = {};
  }
  hasValue(group, key) {
    this._prepareGroup(group);
    if (!this._storage[group].hasOwnProperty(key)) {
      return false;
    }
    let cachedValue = this._storage[group][key];
    return this._isValidItem(cachedValue);
  }
  getValue(group, key) {
    this._prepareGroup(group);
    if (!this.hasValue(group, key)) {
      return null;
    }
    let cachedValue = this._storage[group][key];
    return cachedValue.data;
  }
  setValue(group, key, value) {
    this._prepareGroup(group);
    let cachedValue = {
      timestamp: getTimestamp(),
      data: value
    };
    this._storage[group][key] = cachedValue;
    return true;
  }
  _prepareGroup(group) {
    if (!this._storage[group]) {
      this._storage[group] = {};
    }
  }
}

class Cache {
  constructor() {
    this.ttl = 60 * 60; // 1 hour
    this._enabled = true;
    this._configureStorage();
  }
  disable() {
    this._enabled = false;
  }
  enable() {
    this._enabled = true;
  }
  has(group, key) {
    debug('has', group, key);
    if (!this._enabled) {
      return false;
    }
    return this.storage.hasValue(group, key);
  }
  get(group, key) {
    debug('get', group, key);
    if (!this._enabled) {
      return null;
    }
    return this.storage.getValue(group, key);
  }
  set(group, key, value) {
    debug('set', group, key);
    if (!this._enabled) {
      return false;
    }
    return this.storage.setValue(group, key, value);
  }

  _configureStorage() {
    if (hasLocalStorageSupport()) {
      this.storage = new LocalStorage({
        ttl: this.ttl
      });
    } else {
      this.storage = new MemoryStorage({
        ttl: this.ttl
      });
    }
  }
}

let cacheInstance = new Cache();
if (process.env.DEBUG) {
  cacheInstance.disable();
}
module.exports = cacheInstance;
