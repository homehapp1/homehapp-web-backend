'use strict';

import {loadCommonPlugins, commonJsonTransform, getImageSchema, getStoryBlockSchema} from './common';

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
  schemas.HomeImage = new Schema(getImageSchema(Schema));
  schemas.HomeStoryBlock = new Schema(getStoryBlockSchema(Schema));

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
    // Details
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    location: {
      address: {
        street: {
          type: String,
          default: ''
        },
        apartment: {
          type: String,
          default: ''
        },
        city: {
          type: String,
          default: ''
        },
        zipcode: {
          type: String,
          default: ''
        },
        country: {
          type: String,
          default: ''
        }
      },
      neighborhood: {
        type: ObjectId,
        ref: 'Neighborhood',
        index: true,
        default: null
      }
    },
    costs: {
      currency: {
        type: String,
        enum: ['EUR', 'GBP', 'USD'],
        default: 'GBP'
      },
      deptFreePrice: {
        type: Number
      },
      sellingPrice: {
        type: Number
      },
      squarePrice: {
        type: Number
      },
      realEstateTaxPerYear: {
        type: Number
      },
      electricChargePerMonth: {
        type: Number
      },
      waterChargePerMonth: {
        type: Number
      },
      waterChargePerType: {
        type: String,
        enum: ['person', 'household'],
        default: 'person'
      }
    },
    attributes: [schemas.HomeAttribute],
    amenities: [String],
    facilities: [String],
    // Story
    story: {
      enabled: {
        type: Boolean,
        default: false
      },
      blocks: [schemas.HomeStoryBlock]
    },
    images: [schemas.HomeImage],
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

  schemas.Home.virtual('homeTitle').get(function () {
    if (this.title && this.title.length) {
      return this.title;
    }
    let title = this.location.address.street;
    title += ` ${this.location.address.apartment}`;
    title += `, ${this.location.address.city}`;
    return title.trim();
  });

  schemas.Home.virtual('pageTitle').get(function () {
    let title = [this.homeTitle];
    if (this.location.neighborhood && this.location.neighborhood.title) {
      title.push(this.location.neighborhood.title);
    }
    if (this.location.address.city) {
      title.push(this.location.address.city);
    }
    return title.join(' | ');
  });

  schemas.Home.virtual('waterChargeSuffix').get(function () {
    let suffix = `${this.costs.waterChargePerType} / month`;
    return suffix;
  });

  schemas.Home.virtual('fomattedPrice').get(function() {
    if (!this.costs.sellingPrice) {
      return '';
    }

    return `£${String(Math.round(this.costs.sellingPrice)).replace(/(\d)(?=(\d{3})+$)/g, '$1,')}`;
  });

  schemas.Home.statics.editableFields = function () {
    return [
      'title', 'description', 'location', 'costs', 'story', 'amenities',
      'facilities', 'attributes', 'images'
    ];
  };

  Object.keys(schemas).forEach((name) => {
    loadCommonPlugins(schemas[name], name, mongoose);
    schemas[name].options.toJSON.transform = (doc, ret) => {
      return commonJsonTransform(ret);
    };
    if (name === 'HomeStoryBlock' || name === 'HomeAttribute') {
      schemas[name].options.toJSON.transform = (doc, ret) => {
        ret = commonJsonTransform(ret);
        delete ret.id;
        return ret;
      };
    }
  });

  next(schemas);
};
