const mongoose = require("mongoose");
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/hr-backend", {useNewUrlParser: true});

//require and export models
module.exports.Employee = require('./employees')