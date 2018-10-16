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

app.get("/allemployees", (req,res)=>{
    
    db.Employee.find({}, (err, usersFound) => {
        if(err){
            res.status(401);
        }else{
            res.json(usersFound)
        }
    })
})


app.get("/employee/:id", (req,res)=>{

    db.Employee.find({_id: req.params.id}, (err, uFound) => {
        if(err){
            res.status(401);
        }else{
            res.json(uFound)
        }
    })
})


app.get("/employee/email/:email", (req,res)=>{

    db.Employee.findOne({Email: req.params.email}, (err, uFound) => {
        if(err){
            res.status(401);
        }else{
            res.json(uFound)
        }
    })
})



app.get("/superLOOKUP/:id", (req, res) => {
    let superFound = {
        user: {},
        chainofcommand: [],
        underlings: []
    }
    let id = req.params.id
    db.Employee.find({_id: id}, (err, userFound) => {
        if(err){
            res.status(401);
        }else{
            superFound.user = userFound
            db.Employee.find({manager: id}, (err,succ)=>{
                if(err){
                    res.status(401);
                }else{
                    superFound.underlings = succ
                    getOneStepUp(id).then(chain =>{
                        superFound.chainofcommand = chain
                        console.log("IM FINISHED HERE IS THE SUPER FOUND:")
                        console.log(superFound)
                        res.json(superFound)
                    })
                }
            })
        }   
    })
})

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

app.get("/findUnderlings/:id", (req,res)=>{
    let id = req.params.id
    console.log("ID: "+id)
    db.Employee.find({manager: id}, (err,succ)=>{
        if(err){
            res.status(404)
        }
        console.log(succ)
        res.json(succ)
    })
})


app.get("/test/:id", (req, res) =>{
    let id = req.params.id

    let userChain
    getOneStepUp(id).then(user =>{
        //user.json()
        console.log("USER: ",user)
        console.log("IM FINISHED")
        res.json(user)


    })

    //console.log("USERCHAIN: ",userChain)

    //res.json(user)


})






async function getOneStepUp(id) {
    let listOfCommand = [];
    let inLoop = true
    let user
    
    while(inLoop){
        user = await db.Employee.findOne({_id: id});
        console.log("Thing reponse")
        console.log(user)
        listOfCommand.push(user)
        if(user.manager === null || user.manager === undefined){
            inLoop = false
        }else{
            console.log("this was hit val is",user.manager)
            id = user.manager
        }
    }
    console.log("\n\n\n\n CHAIN OF COMMAND:", listOfCommand)
    return listOfCommand;
}



app.listen(process.env.PORT || 3000, () => {
    console.log('HR server listening on port 3001 ...')
})