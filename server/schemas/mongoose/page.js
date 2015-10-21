import { loadCommonPlugins, commonJsonTransform, getImageSchema, getStoryBlockSchema, populateMetadata } from './common';

exports.loadSchemas = function (mongoose, next) {
  let Schema = mongoose.Schema;
  let schemas = {};
  schemas.PageImage = getImageSchema(Schema);
  schemas.PageStoryBlock = getStoryBlockSchema(Schema);

  // schemas.PageImage.virtual('aspectRatio').get(function () {
  //   return this.width / this.height;
  // });

  schemas.Page = new Schema(populateMetadata({
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
      blocks: [schemas.PageStoryBlock]
    }
  }));

  schemas.Page.virtual('pageTitle').get(function () {
    let title = [this.title];
    return title.join(' | ');
  });

  schemas.Page.statics.editableFields = function () {
    return [
      'title', 'description'
    ];
  };

  Object.keys(schemas).forEach((name) => {
    loadCommonPlugins(schemas[name], name, mongoose);
    schemas[name].options.toJSON.transform = (doc, ret) => {
      return commonJsonTransform(ret);
    };
    if (name === 'PageStoryBlock') {
      schemas[name].options.toJSON.transform = (doc, ret) => {
        ret = commonJsonTransform(ret);
        delete ret.id;
        return ret;
      };
    }
  });

  next(schemas);
};
