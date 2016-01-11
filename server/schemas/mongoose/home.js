import {loadCommonPlugins, commonJsonTransform, getImageFields, getAddressFields, getImageSchema, getStoryBlockSchema, getMainImage, populateMetadata} from './common';

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
  schemas.HomeImage = getImageSchema(Schema);
  schemas.HomeStoryBlock = getStoryBlockSchema(Schema);

  schemas.Home = new Schema(populateMetadata({
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
    enabled: {
      type: Boolean,
      default: true
    },
    // Details
    title: {
      type: String,
      default: ''
    },
    announcementType: {
      type: String,
      enum: ['buy', 'rent', 'story'],
      default: 'story'
    },
    description: {
      type: String,
      default: ''
    },
    details: {
      area: {
        type: Number,
        default: null
      },
    },
    location: {
      address: getAddressFields(),
      coordinates: {
        type: [],
        default: null
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
      sellingPrice: {
        type: Number
      },
      rentalPrice: {
        type: Number
      },
      councilTax: {
        type: Number
      }
    },
    properties: {
      type: String,
      default: ''
    },
    // attributes: [schemas.HomeAttribute],
    // amenities: [String],
    // facilities: [String],
    // Story
    story: {
      enabled: {
        type: Boolean,
        default: false
      },
      blocks: [schemas.HomeStoryBlock]
    },
    neighborhoodStory: {
      enabled: {
        type: Boolean,
        default: false
      },
      blocks: [schemas.HomeStoryBlock]
    },
    images: [schemas.HomeImage],
    _image: getImageFields(),
    epc: getImageFields(),
    floorplans: [schemas.HomeImage],
    brochures: [schemas.HomeImage],
    // Flags
    visible: {
      type: Boolean,
      index: true,
      default: true
    },
    agents: [{
      type: ObjectId,
      ref: 'Agent',
      index: true,
      default: null
    }]
  }));

  schemas.Home.virtual('image').get(function() {
    if (this._image && this._image.url) {
      return this._image;
    }

    return null;
  });

  schemas.Home.virtual('image').set(function(image) {
    if (!image.url || !image.width || !image.height) {
      this._image = null;
    }

    this._image = image;
  });

  schemas.Home.virtual('mainImage').get(function() {
    return getMainImage(this);
  });

  schemas.Home.virtual('homeTitle').get(function () {
    if (this.title && this.title.length) {
      return this.title;
    }

    let title = [];
    if (this.location.address.street) {
      title.push(`${this.location.address.street} ${this.location.address.apartment}`);
    }
    if (this.location.neighborhood && typeof this.location.neighborhood.title !== 'undefined') {
      title.push(`neighborhood ${this.location.neighborhood.title}`);
    }
    if (this.location.address.street) {
      title.push(`street ${this.location.address.city}`);
    }

    if (!title.length) {
      title.push('Unnamed');
    }

    return title.join(', ').trim();
  });

  schemas.Home.virtual('pageTitle').get(function () {
    let title = [this.homeTitle];
    if (this.location.neighborhood && typeof this.location.neighborhood.title !== 'undefined') {
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

  schemas.Home.virtual('formattedPrice').get(function() {
    let price = null;

    if (this.costs.sellingPrice) {
      price = this.costs.sellingPrice;
    }

    if (this.costs.rentalPrice) {
      price = this.costs.rentalPrice;
    }

    if (!price) {
      return null;
    }

    return `${String(Math.round(price)).replace(/(\d)(?=(\d{3})+$)/g, '$1,')}`;
  });

  schemas.Home.statics.editableFields = function () {
    return [
      'title', 'description', 'location', 'costs', 'story', 'neighborhoodStory',
      'amenities', 'facilities', 'attributes', 'images', 'announcementType',
      'brochures', 'image', 'epc', 'floorplans', 'properties', 'enabled'
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
