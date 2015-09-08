'use strict';

import Helpers from '../../Helpers';
import alt from '../../alt';

let debug = require('../../debugger')('UploadAreaUtils');

@alt.createActions
class UploadActions {
  updateUpload(data) {
    this.dispatch(data);
  }
}
exports.UploadActions = UploadActions;

@alt.createStore
class UploadStore {
  constructor() {
    this.bindListeners({
      handleUpdateUpload: UploadActions.UPDATE_UPLOAD
    });
    this.uploads = {};
  }
  handleUpdateUpload(data) {
    if (!this.uploads[data.instanceId]) {
      this.uploads[data.instanceId] = {};
    }
    if (!this.uploads[data.instanceId][data.id]) {
      this.uploads[data.instanceId][data.id] = {};
    }
    this.uploads[data.instanceId][data.id] = Helpers.merge(this.uploads[data.instanceId][data.id], data.data);
    debug('this.uploads', this.uploads);
  }
}
exports.UploadStore = UploadStore;
