const mongoose = require('../db/connection')
Schema = mongoose.Schema;

const UserextSchema = new mongoose.Schema({
    _id: String,
    hrUID: Number,
    PhotoURL: String,
    BackdropURL: String,
    OverviewText: String,
    MobilePhone: String,
})


const Userext = mongoose.model('Userext', UserextSchema);
module.exports = Userext