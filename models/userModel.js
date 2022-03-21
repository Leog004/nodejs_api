const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// name, email, photo, password, passwordConfirm
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'A username must be provided'],
    trim: true,
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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    require: [true, 'A user must provide a password'],
    minlength: 6,
    select: false,
  },
  passwordConfirm: {
    type: String,
    require: [true, 'A user must provide a password'],
    validate: {
      validator: function (el) {
        // This will only work on SAVE
        return this.password === el;
      },
      messgae: 'The password are not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  // only run this function if password was modyfied
  if (!this.isModified('password')) return next();

  // hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userpassword
) {
  return await bcrypt.compare(candidatePassword, userpassword);
};

userSchema.pre(/^find/, async function (next) {
  // this points to the current query
  // query: get collection that active are not equel to false;
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStap = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStap;
  }

  // False means not changed
  return false;
};

userSchema.methods.createPaswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
