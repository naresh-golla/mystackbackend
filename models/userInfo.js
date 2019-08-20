var mongoose = require('mongoose');

module.exports = mongoose.model('UserInfo', {
    username: String,
    bio: Object,
    about: String,
    spotlight: Object,
    education: Object,
    work: Object,
    design: String,
    socialprofile: Array,
    pic: String
});