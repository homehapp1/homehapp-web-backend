"use strict";

import {loadCommonPlugins, commonJsonTransform} from "./common";

exports.loadSchemas = function (mongoose, next) {
  let Schema = mongoose.Schema;
  let ObjectId = Schema.Types.ObjectId;

  let schemas = {};

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
    title: {
      type: String
    },
    // Flags
    visible: {
      type: Boolean,
      index: true,
      default: true
    },
    // Relations
    // strory: {
    //   type: ObjectId,
    //   ref: "HomeStory"
    // },
    createdBy: {
      type: ObjectId,
      ref: "User"
    },
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

  schemas.Home.statics.editableFields = function () {
    return [
      "title"
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
