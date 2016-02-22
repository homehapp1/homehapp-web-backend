import {loadCommonPlugins, commonJsonTransform, getImageSchema, getStoryBlockSchema, getMainImage, populateMetadata} from './common';

exports.loadSchemas = function (mongoose, next) {
  let Schema = mongoose.Schema;

  let schemas = {};

  schemas.NeighborhoodStoryBlock = getStoryBlockSchema(Schema);
  schemas.NeighborhoodImage = getImageSchema(Schema);

  schemas.Neighborhood = new Schema(populateMetadata({
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
    enabled: {
      type: Boolean,
      default: false
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
    area: {
      type: [],
      default: []
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
    }
  }));

  schemas.Neighborhood.virtual('pageTitle').get(function getPageTitle() {
    let title = [this.title];
    if (this.location.city) {
      title.push(this.location.city.title);
    }
    return title.join(' | ');
  });

  schemas.Neighborhood.statics.editableFields = function editableFIelds() {
    return [
      'title', 'description', 'location', 'images', 'story', 'visible',
      'metadata', 'enabled', 'area'
    ];
  };

  schemas.Neighborhood.virtual('mainImage').get(function mainImage() {
    // Placeholder
    let placeholder = {
      url: 'https://res.cloudinary.com/homehapp/image/upload/v1456002299/bg_addstory_neighbourhood.png',
      alt: 'A view over London',
      width: 700,
      height: 466,
      aspectRatio: 700 / 466
    };
    return getMainImage(this, placeholder);
  });
  schemas.Neighborhood.virtual('allImages').get(function allImages() {
    let images = this.images || [];

    // @TODO: collect all images

    return images;
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
