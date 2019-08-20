
var mongoose = require('mongoose');

module.exports = mongoose.model('UserInfo',{
  name: String,
  message: String
});