const mongoose = require('../db/connection')
Schema = mongoose.Schema;

const TagSchema = new mongoose.Schema({
    _id: Number,
    TagName: String,
})


const Tag = mongoose.model('Tag', TagSchema);
module.exports = Tag
