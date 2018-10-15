const mongoose = require('mongoose'),
Schema = mongoose.Schema;



const userSchema = new Schema ({
    email: {
        type: String,
        required: true,
        unique: true },
    password: {
        type: String, 
        required: true
    },
    hrID: Number
    
})


const User = mongoose.model('User', userSchema);

module.exports = User;

