import { loadCommonPlugins, commonJsonTransform, getMainImage, getImageSchema, populateMetadata } from './common';

exports.loadSchemas = function (mongoose, next) {
  let Schema = mongoose.Schema;
  let schemas = {};
  schemas.AgentImage = getImageSchema(Schema);

  schemas.Agent = new Schema(populateMetadata({
    uuid: {
      type: String,
      index: true,
      unique: true
    },
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agency',
      default: null
    },
    contactNumber: {
      type: String,
      default: null
    },
    _contactNumberSid: {
      type: String
    },
    _realPhoneNumber: {
      type: String
    },
    _realPhoneNumberType: {
      type: String,
      default: 'mobile',
      enum: ['mobile', 'local']
    },
    email: {
      type: String,
      default: null
    },
    images: [schemas.AgentImage],
    location: {
      address: {
        country: {
          type: String,
          default: 'GB'
        }
      }
    },
    // Flags
    visible: {
      type: Boolean,
      index: true,
      default: true
    }
  }));

  schemas.Agent.statics.editableFields = function () {
    return [
      'firstname', 'lastname', 'phone', 'email',
      'image', 'location'
    ];
  };
  schemas.Agent.virtual('mainImage').get(function() {
    return getMainImage(this, {
      url: 'https://res.cloudinary.com/homehapp/image/upload/v1444858227/site/images/content/person-placeholder.png',
      width: 800,
      height: 800
    });
  });
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
