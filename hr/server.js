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


app.listen(3001, () => {
    console.log('HR server listening on port 3001 ...')
})