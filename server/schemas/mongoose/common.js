import Plugins from './Plugins';
import moment from 'moment';
import Mongoose from 'mongoose';

let Entities = require('html-entities').Html4Entities;
let entities = new Entities();


exports.getImageSchema = function getImageSchema(Schema) {
  let image = new Schema({
    url: {
      type: String
    },
    width: {
      type: Number,
      required: true,
      default: 0
    },
    height: {
      type: Number,
      required: true,
      default: 0
    },
    alt: {
      type: String,
      default: ''
    },
    tag: {
      type: String
    },
    isMaster: {
      type: Boolean,
      default: false
    },
    author: {
      type: String,
      default: ''
    },
    thumbnail: {
      data: String,
      dataVersion: Number,
      url: String
    }
  });
  image.virtual('aspectRatio').get(function() {
    return this.width / this.height;
  });
  return image;
};

exports.getStoryBlockSchema = function getStoryBlockSchema(Schema) {
  return new Schema({
    template: {
      type: String,
      default: 'default'
    },
    properties: {
      type: Schema.Types.Mixed
    }
  });
};

exports.loadCommonPlugins = (schema, name, mongoose) => {
  let extensionsFile = require('path').join(__dirname, name.toLowerCase() + '_extensions.js');
  if (require('fs').existsSync(extensionsFile)) {
    require(extensionsFile).extendSchema(schema, mongoose);
  }

  schema.plugin(Plugins.createdAt, {index: true});
  schema.plugin(Plugins.lastModified, {index: true});
  schema.plugin(Plugins.multiSet, {index: true});
  schema.plugin(Plugins.uuid, {index: true});
  schema.plugin(Plugins.enableACL, {
    requestModelName: name.toLowerCase()
  });
  schema.set('toJSON', { virtuals: true });
};

exports.commonJsonTransform = (ret) => {
  // remove the _id of every document before returning the result
  delete ret._id;
  delete ret.__v;
  if (ret.uuid) {
    ret.id = ret.uuid.toString();
    delete ret.uuid;
  }

  // Delete private properties
  let ownProps = Object.getOwnPropertyNames(ret);
  ownProps.forEach((prop) => {
    if (prop.substring(0, 1) === '_') {
      delete ret[prop];
    }
  });

  delete ret.deletedAt;

  // Include EPOCH timestap for object
  if (ret.createdAt) {
    ret.createdAtTS = moment(ret.createdAt).unix();
  }
  if (ret.updatedAt) {
    ret.updatedAtTS = moment(ret.updatedAt).unix();
  }

  return ret;
};

exports.getMainImage = function getMainImage(model, placeholder = null) {
  if (!placeholder) {
    placeholder = {
      url: 'https://res.cloudinary.com/homehapp/image/upload/v1441913472/site/images/content/content-placeholder.jpg',
      alt: 'Placeholder',
      width: 1920,
      height: 1280,
      aspectRatio: 1920 / 1280
    };
  }

  // This should include a check for the main image, but we go now with the
  // simplest solution
  if (model.images && model.images.length) {
    return model.images[0];
  }
  if (model.story && model.story.blocks) {
    let images = [];
    for (let block of model.story.blocks) {
      switch (block.template.type) {
        case 'BigImage':
          images.push(block.properties.image);
          break;
        case 'Gallery':
          images.concat(block.properties.images);
          break;
      }
      // Return the first available image from any story block
      if (images.length) {
        return images[0];
      }
    }
  }
  // Fallback placeholder
  return placeholder;
};

exports.populateMetadata = function populateMetadata(schema) {
  schema.createdBy = {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'User'
  };
  schema.createdAt = {
    type: Date
  };
  schema.updatedBy = {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'User'
  };
  schema.updatedAt = {
    type: Date
  };
  schema.deletedBy = {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'User'
  };
  schema.deletedAt = {
    type: Date
  };
  schema.metadata = {
    title: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    score: {
      type: Number,
      default: 0
    }
  };
  return schema;
};

exports.urlName = function urlName(str) {
  let patterns = [
    ['&amp;', '_et_'],
    ['&([a-z])(cedil|elig|lpha|slash|tilde|acute|circ|grave|zlig|uml);', '$1'],
    ['[^0-9a-z\.\-]', '_'],
    ['^[\\-_\\.]+', ''],
    ['[\\-_\\.]+$', ''],
    ['_{2,}', '_'],
    ['_?\\-_?', '-'],
    ['\\.{2,}', '.'],
    ['\\s+', '_']
  ];

  let tmp = entities.encode(String(str).toLowerCase());
  let encoded = tmp;

  for (let pattern of patterns) {
    let regexp = new RegExp(pattern[0], 'ig');
    encoded = encoded.replace(regexp, pattern[1]);
  }
  return encoded;
};


exports.generateUniqueSlug = function generateUniqueSlug(model, cb, iteration) {
  if (iteration > 10) {
    return cb(new Error('iteration overflow'));
  }
  model.slug = exports.urlName(model.title);

  if (iteration) {
    model.slug += `-${iteration}`;
  }

  model.constructor.count({slug: model.slug, deletedAt: null}, function (err, count) {
    if (err) {
      return cb(err);
    }
    // slug is unique
    if (count === 0) {
      return cb();
    }
    // slug is not unique
    generateUniqueSlug(model, cb, (iteration || 0) + 1);
  });
};
