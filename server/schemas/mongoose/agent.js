'use strict';

import { loadCommonPlugins, commonJsonTransform, getImageSchema } from './common';

exports.loadSchemas = function (mongoose, next) {
  let Schema = mongoose.Schema;
  let ObjectId = Schema.Types.ObjectId;

  let schemas = {};

  schemas.AgentImage = new Schema(getImageSchema(Schema));

  schemas.Agent = new Schema({
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
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    company: {
      title: {
        type: String,
        default: null
      },
      phone: {
        type: String,
        default: null
      },
      email: {
        type: String,
        default: null
      }
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    images: [schemas.AgentImage],
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

  schemas.Agent.statics.editableFields = function () {
    return [
      'firstname', 'lastname', 'phone', 'email',
      'image'
    ];
  };
  schemas.Agent.virtual('rname').get(function () {
    let name = [];
    if (this.lastname) {
      name.push(this.lastname);
    }
    if (this.firstname) {
      name.push(this.firstname);
    }
    return name.join(', ');
  });
  schemas.Agent.virtual('name').get(function () {
    let name = [];
    if (this.firstname) {
      name.push(this.firstname);
    }
    if (this.lastname) {
      name.push(this.lastname);
    }
    return name.join(' ');
  });

  Object.keys(schemas).forEach((name) => {
    loadCommonPlugins(schemas[name], name, mongoose);
    schemas[name].options.toJSON.transform = (doc, ret) => {
      return commonJsonTransform(ret);
    };
  });

  next(schemas);
};
