const mongoose = require("mongoose");
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/Projec-HR", {useNewUrlParser: true});

//require and export models
module.exports.Contact = require('./contacts')
module.exports.Userext = require('./userexts')
module.exports.Tag = require('./tags');
module.exports.Tagjoin = require('./tagjoins')
module.exports.User = require('./users')