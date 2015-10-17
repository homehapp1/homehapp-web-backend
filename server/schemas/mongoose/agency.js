

import { loadCommonPlugins, commonJsonTransform, getImageSchema, populateMetadata } from './common';

exports.loadSchemas = function (mongoose, next) {
  let Schema = mongoose.Schema;
  let schemas = {};
  schemas.AgencyImage = getImageSchema(Schema);

  schemas.Agency = new Schema(populateMetadata({
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
      type: String,
      required: true
    },
    logo: [schemas.AgencyImage],
    // Flags
    visible: {
      type: Boolean,
      index: true,
      default: true
    }
  }));

  schemas.Agency.statics.editableFields = function () {
    return [
      'title', 'logo', 'visible'
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
