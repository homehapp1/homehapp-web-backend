import { loadCommonPlugins, commonJsonTransform, getImageSchema, getStoryBlockSchema, populateMetadata } from './common';

exports.loadSchemas = function (mongoose, next) {
  let Schema = mongoose.Schema;
  let schemas = {};
  schemas.ContentImage = getImageSchema(Schema);
  schemas.ContentStoryBlock = getStoryBlockSchema(Schema);

  // schemas.ContentImage.virtual('aspectRatio').get(function () {
  //   return this.width / this.height;
  // });

  schemas.Content = new Schema(populateMetadata({
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
    navigation: {
      type: Boolean,
      default: true
    },
    visible: {
      type: Boolean,
      index: true,
      default: true
    },
    story: {
      enabled: {
        type: Boolean,
        default: false
      },
      blocks: [schemas.ContentStoryBlock]
    }
  }));

  schemas.Content.virtual('pageTitle').get(function () {
    let title = [this.title];
    return title.join(' | ');
  });

  schemas.Content.statics.editableFields = function () {
    return [
      'title', 'description'
    ];
  };

  Object.keys(schemas).forEach((name) => {
    loadCommonPlugins(schemas[name], name, mongoose);
    schemas[name].options.toJSON.transform = (doc, ret) => {
      return commonJsonTransform(ret);
    };
    if (name === 'ContentStoryBlock' || name === 'ContentAttribute') {
      schemas[name].options.toJSON.transform = (doc, ret) => {
        ret = commonJsonTransform(ret);
        delete ret.id;
        return ret;
      };
    }
  });

  next(schemas);
};
