const express = require('express')
const parser = require('body-parser')
const db = require('./models');
const cors = require('cors');
const app = express()

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(cors())


/* Route to get all employees from database */
app.get("/allemployees", (req,res)=>{

    db.Employee.find({}, (err, usersFound) => {
        if(err){
            res.status(401);
        }else{
            res.json(usersFound)
        }
    })
})

/* Route to get one specific employee from database based on id parameter*/
app.get("/employee/:id", (req,res)=>{

    db.Employee.find({_id: parseInt(req.params.id)}, (err, uFound) => {
        if(err){
            res.status(401);
        }else{
            res.json(uFound)
        }
    })
})

/* Route to get one specific employee from database based on email parameter*/
app.get("/employee/email/:email", (req,res)=>{

    db.Employee.findOne({Email: req.params.email}, (err, uFound) => {
        if(err){
            res.status(401);
        }else{
            res.json(uFound)
        }
    })
})


/* Route to get one json paylod based on id parameter with  information like employee, chain of command, hr employee info, manager employee info and all those who report to this employee*/
app.get("/superLOOKUP/:id", (req, res) => {
    let superFound = {
        user: {},
        chainofcommand: [],
        underlings: [],
        hrInfo: [],
        managerInfo: []
    }
    let id = req.params.id
    db.Employee.find({_id: parseInt(id)}, (err, userFound) => {
        if(err){
            res.status(401);
        }else{
            console.log(userFound)
            if(userFound[0]._id === 101){
                console.log("USER FOUND")
                console.log(userFound)
                userFound[0].manager = null
                console.log("After adding null")
                console.log(userFound)
            }
            superFound.user = userFound
            db.Employee.find({manager: parseInt(id)}, (err,succ)=>{
                if(err){
                    res.status(401);
                }else{
                    //console.log(userFound)
                    superFound.underlings = succ
                    //console.log("User Found HR: ")
                    let hrToLookup = userFound[0].HRrep;
                    if(userFound[0].HRrep === undefined || userFound[0]._id === 101){

                        //console.log(userFound.HRrep)
                        hrToLookup = 115
                        //console.log(hrToLookup)
                        //_id: superFound.user[0].HRrep
                    }
                    db.Employee.find({_id: parseInt(hrToLookup)}, (err,hrFound)=>{
                        if(err){
                            res.status(401);
                        }else{
                            //console.log(hrFound)
                            superFound.hrInfo = hrFound
                            //console.log(userFound)
                            console.log("MANAGER FOUND")
                            if(superFound.user[0].manager === null){
                                getOneStepUp(parseInt(id)).then(chain =>{
                                    superFound.chainofcommand = chain
                                    console.log("IM FINISHED HERE IS THE SUPER FOUND:")
                                    console.log(superFound)
                                    res.json(superFound)
                                })
                            }else{
                            db.Employee.find({_id: parseInt(superFound.user[0].manager)}, (err,managerFound)=>{
                                if(err){
                                    res.status(401);
                                }else{
                                superFound.managerInfo = managerFound
                                getOneStepUp(parseInt(id)).then(chain =>{
                                    superFound.chainofcommand = chain
                                    console.log("IM FINISHED HERE IS THE SUPER FOUND:")
                                    console.log(superFound)
                                    res.json(superFound)
                                })
                                }
                            })
                            }
                        }
                    })
                }
            })
        }   
    })
})


/* Route to populate the manager of a specific employee based on the employees id */
app.get("/employee/manager/populate/:id", (req,res)=>{
    
    db.Employee.find({_id: req.params.id}, (err, uFound) => {
        if(err){
            res.status(401);
        }else{
            console.log("hi")
        }
    })
        .populate("manager")
        .exec((err, success) =>{
            res.json(success)
    })

})

/* Route to populate the hr rep of a specific employee based on the employees id */
app.get("/employee/hr/populate/:id", (req,res)=>{
    
    db.Employee.find({_id: req.params.id}, (err, uFound) => {
        if(err){
            res.status(401);
        }else{
            console.log("hi")
        }
    })
        .populate("manager")
        .exec((err, success) =>{
            res.json(success)
    })
    
})

/* Route to populate a specific employee based on the employees id */
app.get("/search/employees/:search", (req,res)=>{
    let search=req.params.search
    console.log("Search: "+search)
    db.Employee.find({ $text : { $search: search } }, (err,succ)=>{
        if(err){
            res.status(404)
        }
        console.log(succ.length)
        if(succ.length === 0){

            res.json({"ERROR":"No results found please try again"})
        }else{
        //console.log(succ)
        res.json(succ)
        }
    })

})

/* Route to populate all employees who report to the employees whose id is provided */
app.get("/findUnderlings/:id", (req,res)=>{
    let id = req.params.id
    console.log("ID: "+id)
    db.Employee.find({manager: parseInt(id)}, (err,succ)=>{
        if(err){
            res.status(404)
        }
        console.log(succ)
        res.json(succ)
    })
})

/* Route to test the one step up function */
app.get("/test/:id", (req, res) =>{
    let id = req.params.id

    let userChain
    getOneStepUp(parseInt(id)).then(user =>{
        console.log("IM FINISHED")
        res.json(user)
    })
})

/* Route to test if server was working */
app.post("/getEmployees", (req, res)=>{
    console.log(req.body)
    res.json({yay:"yay"})
})


async function getTagEmployees(emps) {
    let employees = []
    let foundTag

    for(let i=0; i < emps.length; i++){

        foundEmp = await db.Employee.find( { _id : parseInt(emps[i]) }, (err, succEmp)=>{
            if (err) {
                console.log(err)
            } else {
                return succEmp
            }  
        })
        .catch((error) => {
            console.log(error);
        })

        employees.push(foundEmp)

    }
    console.log("sending off data")

    return employees
}



//Asynchronous function that goes through managers untill it reaches the CEO to give you the list of managers above you

async function getOneStepUp(id) {
    let listOfCommand = [];
    let inLoop = true
    let user
    if(id === null || id === undefined){
        console.log("input was null / undefined getOneStepUp")
        return listOfCommand
    }else{
    while(inLoop){
        user = await db.Employee.findOne({_id: parseInt(id)});
        listOfCommand.push(user)
        if(user.manager === null || user.manager === undefined){
            inLoop = false
        }else{
            id = user.manager
        }
    }
    return listOfCommand;
    }
}



app.listen(3001, () => {
    console.log(__dirname)
    console.log('HR server listening on port 3001 ...')
})