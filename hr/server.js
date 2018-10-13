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

app.get("/findUnderlings/:id", (req,res)=>{
    let id = req.params.id
    console.log("ID: "+id)
    db.Employee.find({manager: id}, (err,succ)=>{
        console.log(succ)
        res.json(succ)
    })
})


app.get("/test/:id", (req, res) =>{
    let id = req.params.id
    list = [];
    function asyncLoop(limit, cb) {

        if (limit !== null) {
            db.Employee.findOne({_id: id}).exec( (err, manFound) => {
                id = manFound._id
                console.log("Found ID: "+id)
                console.log("manFound: ", manFound)
                list.push(manFound);
                limit = manFound.manager
                asyncLoop(limit, cb);
            });
        } else {
            cb();
        }
    }
    asyncLoop(0, function() {
        callback({_id: id});
    });

    console.log("FULL LIST:")
    console.log(list)
})


app.listen(3001, () => {
    console.log('HR server listening on port 3001 ...')
})