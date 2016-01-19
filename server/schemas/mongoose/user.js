import moment from 'moment';
import bcrypt from 'bcrypt';
import { loadCommonPlugins, getImageFields, getAddressFields, commonJsonTransform, populateMetadata } from './common';
let debug = require('debug')('UserSchema');

let getSalt = function () {
  let salt = bcrypt.genSaltSync(10);
  return salt;
};

let calculateHash = function (password, salt) {
  let hash = bcrypt.hashSync(password, salt);
  return hash;
};

exports.loadSchemas = function (mongoose, next) {
  let Schema = mongoose.Schema;
  //let ObjectId = Schema.Types.ObjectId;

  let schemas = {};

  schemas.User = new Schema(populateMetadata({
    uuid: {
      type: String,
      index: true,
      unique: true
    },
    firstname: {
      type: String
    },
    lastname: {
      type: String
    },
    _email: {
      type: String
    },
    _lastValidEmail: {
      type: String,
      default: null
    },
    _emailValidated: {
      type: Boolean,
      default: false
    },
    // Authentication related
    username: {
      type: String,
      index: true,
      unique: true
    },
    _salt: {
      type: String
    },
    _saltAlg: {
      type: String,
      default: 'default'
    },
    _password: {
      type: String
    },
    _passwordSetAt: {
      type: Date
    },
    _lastLogin: {
      type: Date
    },
    _accessLevel: {
      type: String,
      default: 'user'
    },
    // JWT Authentication related
    _checkId: {
      type: String,
      default: ''
    },
    // Service authentication related
    _service: {
      facebook: {
        id: {
          type: String,
          index: true
        },
        token: String
      },
      google: {
        id: {
          type: String,
          index: true
        },
        token: String
      }
    },
    active: {
      type: Boolean,
      index: true,
      default: true
    },
    // Client device related
    deviceId: {
      ios: String,
      android: String
    },
    // Push notification related
    pushToken: {
      ios: String,
      android: String
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
    profileImage: getImageFields(),
    contact: {
      address: getAddressFields()
    }
  }));

  schemas.User.virtual('phone').get(function() {
    return this.contactNumber;
  });

  schemas.User.virtual('phone').set(function(value) {
    // Refuse to reset the real phone number with a generated number
    if (value && value !== this.contactNumber) {
      this._realPhoneNumber = value;
    }
  });

  schemas.User.virtual('displayName').get(function () {
    let displayName = [];

    if (this.firstname) {
      displayName.push(this.firstname);
    }
    if (this.lastname) {
      displayName.push(this.lastname);
    }
    if (!displayName.length) {
      //debug('populate with email');
      displayName.push(this._email);
    }
    if (!displayName.length) {
      //debug('populate with username');
      displayName.push(this.username);
    }

    let name = displayName.join(' ');

    if (name.match(/[^\s]/)) {
      return name;
    }
    return '<unidentified johndoe>';
  });
  schemas.User.virtual('name').get(function () {
    let firstname = this.firstname || this.givenName || '';
    let lastname = this.lastname || this.familyName || '';

    if (!firstname && !lastname) {
      return this.username;
    }
    return [firstname, lastname].join(' ');
  });
  schemas.User.virtual('rname').get(function () {
    let firstname = this.firstname || this.givenName || '';
    let lastname = this.lastname || this.familyName || '';

    if (!firstname && !lastname) {
      return this.username;
    }
    return [lastname, firstname].join(', ').replace(/^, /, '');
  });
  schemas.User.virtual('password').set(function (password) {
    debug('Set password', password);
    this._salt = getSalt();
    this._password = calculateHash(password, this._salt);
    this._passwordSetAt = moment().utc().toDate();
  });
  schemas.User.virtual('email').get(function() {
    return this._email;
  });
  schemas.User.virtual('email').set(function (email) {
    email = email.toLowerCase();
    if (!schemas.User.methods.isValidEmail(email)) {
      throw new Error('Invalid email given');
    }
    this._email = email;
  });
  schemas.User.methods.isValidPassword = function (password) {
    if (!this._password) {
      return false;
    }
    if (this._password === calculateHash(password, this._salt)) {
      return true;
    }
    return false;
  };
  schemas.User.methods.isValidEmail = function (email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
  };

  schemas.User.statics.editableFields = function () {
    return [
      'firstname', 'lastname', 'email', 'profileImage', 'contact'
    ];
  };
  schemas.User.virtual('publicData').get(function() {
    let values = {
      id: this.uuid || this.id,
      firstname: this.firstname || this.givenName || '',
      lastname: this.lastname || this.familyName || '',
      email: this.email,
      phone: this.phone,
      name: this.name,
      rname: this.rname,
      profileImage: this.profileImage,
      contact: this.contact || {
        address: null
      },
      createdAt: this.createdAt,
      createdAtTS: this.createdAtTS,
      updatedAt: this.updatedAt,
      updatedAtTS: this.updatedAtTS
    };
  });

  Object.keys(schemas).forEach((name) => {
    loadCommonPlugins(schemas[name], name, mongoose);
    schemas[name].options.toJSON.transform = (doc, ret) => {
      ret = commonJsonTransform(ret);
      delete ret.password;
      return ret;
    };
  });

  next(schemas);
};
