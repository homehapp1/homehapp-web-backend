'use strict';

import {loadCommonPlugins, commonJsonTransform} from './common';

exports.loadSchemas = function (mongoose, next) {
  let Schema = mongoose.Schema;
  let ObjectId = Schema.Types.ObjectId;

  let schemas = {};

  schemas.HomeAttribute = new Schema({
    name: String,
    value: Schema.Types.Mixed,
    valueType: {
      type: String,
      default: 'string'
    }
  });

  schemas.HomeStoryBlock = new Schema({
    template: {
      type: String,
      default: 'default'
    },
    properties: {
      type: Schema.Types.Mixed
    }
  });

  schemas.Home = new Schema({
    uuid: {
      type: String,
      index: true,
      unique: true
    },
    slug: {
      type: String,
      index: true,
      required: true
    },
    title: {
      type: String
    },
    description: {
      type: String
    },
    location: {
      address: {
        street: String,
        apartment: String,
        city: String,
        zipcode: String,
        country: String
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      }
    },
    // Details
    price: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      enum: ['EUR', 'GBP', 'USD']
    },
    attributes: [schemas.HomeAttribute],
    // Strory
    story: {
      enabled: {
        type: Boolean,
        default: false
      },
      blocks: [schemas.HomeStoryBlock]
    },
    // Flags
    visible: {
      type: Boolean,
      index: true,
      default: true
    },
    // Relations
    createdBy: {
      type: ObjectId,
      ref: 'User'
    },
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

  schemas.Home.statics.editableFields = function () {
    return [
      'title', 'description', 'details', 'story', 'location'
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
