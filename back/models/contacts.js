const mongoose = require('../db/connection')
Schema = mongoose.Schema;

const ContactSchema = new mongoose.Schema({
    userID: Number,
    Label: String,
    Value: String,
})


const Contact = mongoose.model('Contact', ContactSchema);
module.exports = Contact