const mongoose = require('../db/connection')
Schema = mongoose.Schema;

const EmployeeSchema = new mongoose.Schema({
    _id: Number,
    FirstName: String,
    LastName: String,
    Email: String,
    Phone: String,
    Address: String,
    CountryCode: {
        type: String,
        maxlength: 2
    },
    JobTitle: String,
    Org: String,
    manager: {type: Schema.Types.Number, ref: "Employee"},
    HRrep: {type: Schema.Types.Number, ref: "Employee"},
})


const Employee = mongoose.model('Employee', EmployeeSchema);
module.exports = Employee