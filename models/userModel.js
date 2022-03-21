const mongoose = require('mongoose');
const validator = require('validator');

// name, email, photo, password, passwordConfirm
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'A username must be provided'],
    trim: true,
    validate: [
      validator.isAlpha,
      'It must be only characters and not more than',
    ],
  },
  email: {
    type: String,
    require: [true, 'A email must be provided'],
    trim: true,
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, 'User must include an valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    require: [true, 'A user must provide a password'],
    minlength: 6,
  },
  passwordConfirm: {
    type: String,
    require: [true, 'A user must provide a password'],
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
