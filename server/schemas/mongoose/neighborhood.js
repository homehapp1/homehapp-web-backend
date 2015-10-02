'use strict';

import {loadCommonPlugins, commonJsonTransform, getImageSchema, getStoryBlockSchema} from './common';

exports.loadSchemas = function (mongoose, next) {
  let Schema = mongoose.Schema;

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
      required: true,
      unique: true
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
    homes: {
      type: [],
      default: null
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        index: true
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
      type: mongoose.Schema.Types.ObjectId,
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

  schemas.Neighborhood.virtual('pageTitle').get(function getPageTitle() {
    let title = [this.neighborhoodTitle];
    if (this.location.city) {
      title.push(this.location.city.title);
    }
    return title.join(' | ');
  });

  schemas.Neighborhood.statics.editableFields = function editableFIelds() {
    return [
      'title', 'description', 'location', 'images'
    ];
  };

  schemas.Neighborhood.virtual('mainImage').get(function getMainImage() {
    // Placeholder
    let placeholder = {
      url: 'https://res.cloudinary.com/homehapp/image/upload/v1439564093/london-view.jpg',
      alt: 'A view over London',
      width: 4828,
      height: 3084,
      aspectRatio: 4828 / 3084
    };
    // This should include a check for the main image, but we go now with the
    // simplest solution
    if (this.images.length) {
      return this.images[0];
    }
    let images = [];
    for (let block of this.story.blocks) {
      switch (block.template.type) {
        case 'BigImage':
          images.push(block.properties.image);
          break;
        case 'Gallery':
          for (let image of block.properties.images) {
            images.push(image);
            break;
          }
          break;
      }
      // Return the first available image from any story block
      if (images.length) {
        return images[0];
      }
    }
    // Fallback placeholder
    return placeholder;
  });

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