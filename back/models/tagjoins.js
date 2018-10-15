const mongoose = require('../db/connection')
Schema = mongoose.Schema;

const TagjoinSchema = new mongoose.Schema({
    tag: {type: Schema.Types.Number, ref: "Tag"},
    user: {type: Schema.Types.Number, ref: "Userext"},
})


const Tagjoin = mongoose.model('Tagjoin', TagjoinSchema);
module.exports = Tagjoin
