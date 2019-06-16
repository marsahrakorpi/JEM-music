const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      }
    }
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator(password) {
        return validator.contains(password, '$2b');
      },
    },
  },
  firstname: {
    type: String,
    required: true,
    validate: {
      validator(firstname){
        return validator.isAlphanumeric(firstname);
      }
    }
  },
  lastname: {
    type: String,
    required: true,
    validate: {
      validator(lastname){
        return validator.isAlphanumeric(lastname);
      }
    }
  },
  ip: {
    type: String,
    required: true,
    validate: {
      validator(ip) {
        return validator.isIP(ip);
      },
    },
  },
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);  