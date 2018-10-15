var db = require('./models');




let CEO = {
    "FirstName": "Dani",
    "LastName": "Howe",
    "Email": "dani@fakeORG.com",
    "Phone": "6789567890",
    "Address": "111 abc street",
    "CountryCode": "US",
    "JobTitle": "CEO",
    "manager": null,
    "HRrep": null
}


let leftManager = {
    "FirstName": "Ozan",
    "LastName": "Neale",
    "Email": "ozan@fakeORG.com",
    "Phone": "1784567890",
    "Address": "111 abc street",
    "CountryCode": "US",
    "JobTitle": "Manager",
    "manager": null,
    "HRrep": null
}

let rightManager = {
    "FirstName": "Khalid",
    "LastName": "Harmon",
    "Email": "khalid@fakeORG.com",
    "Phone": "1790590890",
    "Address": "111 abc street",
    "CountryCode": "US",
    "JobTitle": "Manager",
    "manager": null,
    "HRrep": null
}

let leftEmployeeLM = {
    "FirstName": "Esmai",
    "LastName": "Wade",
    "Email": "esmai@fakeORG.com",
    "Phone": "1787567790",
    "Address": "111 abc street",
    "CountryCode": "US",
    "JobTitle": "Employee",
    "manager": null,
    "HRrep": null
}

let rightEmployeeLM = {
    "FirstName": "Yisroel",
    "LastName": "Gutierrez",
    "Email": "yisroel@fakeORG.com",
    "Phone": "1799567890",
    "Address": "111 abc street",
    "CountryCode": "US",
    "JobTitle": "Employee",
    "manager": null,
    "HRrep": null
}

let leftEmployeeRM = {
    "FirstName": "Damian",
    "LastName": "Robins",
    "Email": "damian@fakeORG.com",
    "Phone": "1714561190",
    "Address": "111 abc street",
    "CountryCode": "US",
    "JobTitle": "Employee",
    "manager": null,
    "HRrep": null
}

let rightEmployeeRM = {
    "FirstName": "Mollie",
    "LastName": "Thornton",
    "Email": "mollie@fakeORG.com",
    "Phone": "6784567890",
    "Address": "111 abc street",
    "CountryCode": "US",
    "JobTitle": "Employee",
    "manager": null,
    "HRrep": null
}

let HR = {
    "FirstName": "Marc",
    "LastName": "Sparrow",
    "Email": "marc@fakeORG.com",
    "Phone": "6784567890",
    "Address": "111 abc street",
    "CountryCode": "US",
    "JobTitle": "Human Resouces",
    "manager": null,
    "HRrep": null
}





db.Employee.deleteMany({}, (err, deletedShow) =>{
    if(err){console.log(err);}
    else{
        console.log(deletedShow)
    }
})


db.Employee.deleteMany({}, (err, deletedShows) => { 
    db.Employee.create(CEO, (err, savedCEO) => {
        if(err){console.log(err)};

        db.Employee.create(HR, (err, savedHR) => {

            leftManager.manager = savedCEO._id;
            leftManager.HRrep = savedHR._id;
            rightManager.manager = savedCEO._id;
            rightManager.HRrep = savedHR._id;

            db.Employee.create(leftManager, (err, savedLeftManager) => {

                leftEmployeeLM.manager = savedLeftManager._id
                leftEmployeeLM.HRrep = savedHR._id;
                rightEmployeeLM.manager = savedLeftManager._id
                rightEmployeeLM.HRrep = savedHR._id;

                db.Employee.create(rightManager, (err, savedRighttManager) => {

                    leftEmployeeRM.manager = savedRighttManager._id
                    leftEmployeeRM.HRrep = savedHR._id;
                    rightEmployeeRM.manager =  savedRighttManager._id
                    rightEmployeeRM.HRrep = savedHR._id;

                    db.Employee.create(leftEmployeeLM, (err, leftEmployeeLM) => {

                        db.Employee.create(rightEmployeeLM, (err, savedrightEmployeeLM) => {

                            db.Employee.create(leftEmployeeRM, (err, savedleftEmployeeRM) => {

                                db.Employee.create(rightEmployeeRM, (err, savedrightEmployeeRM) => {

                                })
                            })
                        })
                    })
                })
            })
        })
    })
})