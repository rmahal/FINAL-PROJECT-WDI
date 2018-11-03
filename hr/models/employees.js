const mongoose = require('../db/connection')
Schema = mongoose.Schema;

const EmployeeSchema = new mongoose.Schema({
    _id: String,
    FirstName: String,
    LastName: String,
    Email: String,
    Phone: String,
    Street: String,
    City: String,
    State: {
        type: String,
        maxlength: 2
    },
    ZipCode: Number,
    CountryCode: {
        type: String,
        maxlength: 2
    },
    TimeZone: String,
    JobTitle: String,
    Org: String,
    manager: {type: Schema.Types.Number, ref: "Employee"},
    HRrep: {type: Schema.Types.Number, ref: "Employee"},
})


const Employee = mongoose.model('Employee', EmployeeSchema);
module.exports = Employee