'use strict';

import Plugins from './Plugins';
import moment from 'moment';

exports.getImageSchema = function getImageSchema() {
  return {
    url: {
      type: String
    },
    aspectRatio: { // TODO: Remove this and use the virtual property
      type: Number,
      required: true
    },
    width: {
      type: Number,
      required: true,
      default: 0
    },
    height: {
      type: Number,
      required: true,
      default: 0
    },
    alt: {
      type: String,
      default: ''
    },
    tag: {
      type: String
    },
    isMaster: {
      type: Boolean,
      default: false
    },
    author: {
      type: String,
      default: ''
    }
  };
};

exports.loadCommonPlugins = (schema, name, mongoose) => {
  let extensionsFile = require('path').join(__dirname, name.toLowerCase() + '_extensions.js');
  if (require('fs').existsSync(extensionsFile)) {
    require(extensionsFile).extendSchema(schema, mongoose);
  }

  schema.plugin(Plugins.createdAt, {index: true});
  schema.plugin(Plugins.lastModified, {index: true});
  schema.plugin(Plugins.multiSet, {index: true});
  schema.plugin(Plugins.uuid, {index: true});
  schema.plugin(Plugins.enableACL, {
    requestModelName: name.toLowerCase()
  });
  schema.set('toJSON', { virtuals: true });
};

exports.commonJsonTransform = (ret) => {
  // remove the _id of every document before returning the result
  delete ret._id;
  delete ret.__v;
  if (ret.uuid) {
    ret.id = ret.uuid.toString();
    delete ret.uuid;
  }

  // Delete private properties
  let ownProps = Object.getOwnPropertyNames(ret);
  ownProps.forEach((prop) => {
    if (prop.substring(0, 1) === '_') {
      delete ret[prop];
    }
  });

  delete ret.deletedAt;

  // Include EPOCH timestap for object
  if (ret.createdAt) {
    ret.createdAtTS = moment(ret.createdAt).unix();
  }
  if (ret.updatedAt) {
    ret.updatedAtTS = moment(ret.updatedAt).unix();
  }

  return ret;
};
