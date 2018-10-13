const mongoose = require('../db/connection')
Schema = mongoose.Schema;

const TagsJoinSchema = new mongoose.Schema({
    TagName: String,
    tag: {type: Schema.Types.ObjectId, ref: "Tag"},
    user: {type: Schema.Types.ObjectId, ref: "User"},
})


const TagJoin = mongoose.model('TagJoin', TagsJoinSchema);
module.exports = TagJoin
