const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//#region for user chat
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    maxlength: 70,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  }

}, {
  timestamps: true
})
// #endregion


//#region for validate
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.correctPass = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
// #endregion

const User = mongoose.model('User', userSchema);
module.exports = User;
