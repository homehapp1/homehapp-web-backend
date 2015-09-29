'use strict';

import {loadCommonPlugins, commonJsonTransform} from './common';

exports.loadSchemas = function (mongoose, next) {
  let Schema = mongoose.Schema;
  let ObjectId = Schema.Types.ObjectId;

  let schemas = {};

  // This *probably* should be named as something else than Image
  // as the same image schema can (and should) be used wherever images
  // are used
  schemas.Image = new Schema({
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
    },
    // Relations
    createdBy: {
      type: ObjectId,
      ref: 'User'
    },
    // neighborhood: {
    //   type: ObjectId,
    //   ref: 'Neighborhood'
    // },
    // Common metadata
    createdAt: {
      type: Date
    },
    updatedAt: {
      type: Date
    },
    deletedAt: {
      type: Date
    }
  });

  schemas.Image.statics.editableFields = function () {
    return [
      'alt', 'tag', 'isMaster', 'author'
    ];
  };

  Object.keys(schemas).forEach((name) => {
    loadCommonPlugins(schemas[name], name, mongoose);
    schemas[name].options.toJSON.transform = (doc, ret) => {
      return commonJsonTransform(ret);
    };
  });

  next(schemas);
};
