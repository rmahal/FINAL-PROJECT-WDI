const express = require('express')
const parser = require('body-parser')
const db = require('./models');
const app = express()

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get("/", (req,res)=>{
    
    db.Employee.find({}, (err, usersFound) => {
        if(err){
            res.status(401);
        }else{
            res.json(usersFound)
        }
    })
})



app.get("/api/populate/:id", (req,res)=>{
    

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



    // let user = []

    // let userFound = {}
    
    // db.Employee.find({_id: req.params.id}, (err, uFound) => {
    //     if(err){
    //         res.status(401);
    //     }else{
    //         user.push(uFound)
    //         console.log(uFound)
    //         userFound=uFound
    //     }
    // })
    // let chainOfCommand = []
    // chainOfCommand.push(userFound)
    // let notNull = true
    // let id = userFound.manager
    // console.log("USER : ",userFound)
    // console.log("Manager ID: "+id)
    // while(notNull){
    //     db.Employee.find({_id: id}, (err, newFound) => {
    //         if(err){
    //             res.status(401);
    //         }else if(newFound.manager === null){
    //             notNull = false

    //         }else{
    //             chainOfCommand.push(newFound)

    //         }
    //     })
    //     id = userFound.manager
    // }
    // user.push(chainOfCommand)

    // res.json(user)
})



app.listen(3001, () => {
    console.log('HR server listening on port 3001 ...')
})