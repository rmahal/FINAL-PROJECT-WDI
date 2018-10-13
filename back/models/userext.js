const mongoose = require('../db/connection')
Schema = mongoose.Schema;

const UserextSchema = new mongoose.Schema({
    hrUID: String,
    PhotoURL: String,
    OverviewText: String,
})


const Userext = mongoose.model('Userext', UserextSchema);
module.exports = Userext