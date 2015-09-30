'use strict';

import {loadCommonPlugins, commonJsonTransform} from './common';

exports.loadSchemas = function (mongoose, next) {
  let Schema = mongoose.Schema;
  let ObjectId = Schema.Types.ObjectId;

  let schemas = {};

  // This *probably* should be named as something else than CityImage
  // as the same image schema can (and should) be used wherever images
  // are used
  schemas.CityImage = new Schema({
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
  });

  schemas.CityStoryBlock = new Schema({
    template: {
      type: String,
      default: 'default'
    },
    properties: {
      type: Schema.Types.Mixed
    }
  });

  // schemas.CityImage.virtual('aspectRatio').get(function () {
  //   return this.width / this.height;
  // });

  schemas.City = new Schema({
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
    // Details
    title: {
      type: String,
      default: ''
    },
    aliases: {
      type: [String],
      default: []
    },
    description: {
      type: String,
      default: ''
    },
    location: {
      country: {
        type: String,
        default: 'Great Britain'
      },
      coordinates: {
        type: [Number],
        default: [],
        index: '2dsphere'
      }
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

  schemas.City.virtual('pageTitle').get(function () {
    let title = [this.CityTitle];
    if (this.location.city) {
      title.push(this.location.city.title);
    }
    return title.join(' | ');
  });

  schemas.City.statics.editableFields = function () {
    return [
      'title', 'description', 'location', 'images'
    ];
  };

  Object.keys(schemas).forEach((name) => {
    loadCommonPlugins(schemas[name], name, mongoose);
    schemas[name].options.toJSON.transform = (doc, ret) => {
      return commonJsonTransform(ret);
    };
    if (name === 'CityStoryBlock' || name === 'CityAttribute') {
      schemas[name].options.toJSON.transform = (doc, ret) => {
        ret = commonJsonTransform(ret);
        delete ret.id;
        return ret;
      };
    }
  });

  next(schemas);
};
