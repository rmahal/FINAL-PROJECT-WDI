const mongoose = require('../db/connection')
Schema = mongoose.Schema;

const EmployeeSchema = new mongoose.Schema({
    FirstName: String,
    LastName: String,
    Email: String,
    Phone: Number,
    Address: String,
    CountryCode: {
        type: String,
        maxlength: 2
    },
    JobTitle: String,
    manager: {type: Schema.Types.ObjectId, ref: "Employee"},
    HRrep: {type: Schema.Types.ObjectId, ref: "Employee"},
})


const Employee = mongoose.model('Employee', EmployeeSchema);
module.exports = Employee