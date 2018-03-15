var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  fname: String,
  lname: String,
  email: String,
  password: String
});

module.exports = mongoose.model('User', userSchema);
