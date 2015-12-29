import { loadCommonPlugins, commonJsonTransform, populateMetadata } from './common';

exports.loadSchemas = function (mongoose, next) {
  let Schema = mongoose.Schema;
  let schemas = {};
  schemas.Contact = new Schema(populateMetadata({
    uuid: {
      type: String,
      index: true,
      unique: true
    },
    // Details
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'email',
      enum: ['email', 'phone']
    },
    subType: {
      type: String,
      default: null
    },
    sender: {
      name: {
        type: String,
        default: null
      },
      email: {
        type: String,
        default: null
      },
      phone: {
        type: String,
        default: null
      },
      country: {
        type: String,
        default: null
      }
    },
    home: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Home',
      default: null
    },
    recipient: {
      agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent'
      },
      name: {
        type: String,
        default: null
      },
      email: {
        type: String,
        default: null
      },
      phone: {
        type: String,
        default: null
      }
    },
    // Store the related tags (e.g. home ID and such) here
    tags: []
  }));

  schemas.Contact.virtual('contactTitle').get(function () {
    return this.createdAt.toString();
  });

  schemas.Contact.statics.editableFields = function () {
    return [
      'title', 'message', 'type', 'sender', 'recipient', 'tags',
      'home', 'subType'
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
