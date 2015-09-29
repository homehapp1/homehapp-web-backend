'use strict';

import {loadCommonPlugins, commonJsonTransform, getImageSchema, getStoryBlockSchema} from './common';

exports.loadSchemas = function (mongoose, next) {
  let Schema = mongoose.Schema;
  let ObjectId = Schema.Types.ObjectId;

  let schemas = {};

  schemas.NeighborhoodStoryBlock = new Schema(getStoryBlockSchema(Schema));
  schemas.NeighborhoodImage = new Schema(getImageSchema(Schema));

  schemas.Neighborhood = new Schema({
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
      borough: {
        type: String,
        default: null
      },
      postCodes: {
        type: [String],
        default: []
      },
      postOffice: {
        type: String,
        default: null
      },
      city: {
        title: {
          type: String,
          default: 'London'
        },
        slug: {
          type: String,
          default: 'london'
        }
      },
      coordinates: {
        type: [Number],
        default: [],
        index: '2dsphere'
      }
    },
    // Story
    story: {
      enabled: {
        type: Boolean,
        default: false
      },
      blocks: [schemas.NeighborhoodStoryBlock]
    },
    images: [schemas.NeighborhoodImage],

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

  schemas.Neighborhood.virtual('pageTitle').get(function () {
    let title = [this.neighborhoodTitle];
    if (this.location.city) {
      title.push(this.location.city.title);
    }
    return title.join(' | ');
  });

  schemas.Neighborhood.statics.editableFields = function () {
    return [
      'title', 'description', 'location', 'images'
    ];
  };

  Object.keys(schemas).forEach((name) => {
    loadCommonPlugins(schemas[name], name, mongoose);
    schemas[name].options.toJSON.transform = (doc, ret) => {
      return commonJsonTransform(ret);
    };
    if (name === 'NeighborhoodStoryBlock') {
      schemas[name].options.toJSON.transform = (doc, ret) => {
        ret = commonJsonTransform(ret);
        delete ret.id;
        return ret;
      };
    }
  });

  next(schemas);
};
