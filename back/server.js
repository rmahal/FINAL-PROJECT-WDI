const express = require('express')
const parser = require('body-parser')
const ejs = require('ejs')
const cors = require('cors');
const axios = require('axios');
const fetch = require("node-fetch");
const app = express()
app.set('view engine', 'ejs');
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cors())

app.use(express.static('public'));


app.get("/", (req,res)=>{
    res.sendFile('views/index.html', {root: __dirname});
})

app.get("/org", (req,res)=>{
    res.sendFile('views/orgchart.html', {root: __dirname});
})


app.get('/userprofile/:id', function(req, res) {
    var id = req.params.id;
    console.log("ID: "+id)
    var url = "http://localhost:3001/employee/"+id
    console.log("URL: "+url)
    fetch(url)
    .then(response =>  response.json())
    .then(response => {
            if(response[0].manager == null){
                var manId = response[0]._id;
                console.log("MAN ID: "+manId)
                var url = "http://localhost:3001/employee/"+manId
                console.log("URL: "+url)
                fetch(url)
                .then(manager =>  manager.json())
                .then(manager => {
                    
                   console.log("\n\n MANAGER RESPONSE: \n\n",manager)
                   res.render('userprofile',{
                       user: response,
                       manager: response
                   });
                })
                
            }else{
            var manId = response[0].manager;
            console.log("MAN ID: "+manId)
            var url = "http://localhost:3001/employee/manager/populate/"+manId
            console.log("URL: "+url)
            fetch(url)
            .then(manager =>  manager.json())
            .then(manager => {
                
               console.log("\n\n MANAGER RESPONSE: \n\n",manager)
               res.render('userprofile',{
                   user: response,
                   manager: manager
               });
            })
        }
    })

});

app.get("/userprofile", (req,res)=>{
    res.sendFile('views/userprofile.html', {root: __dirname});
})

app.listen(3000, () => {
    console.log('Backend server listening on port 3000 ...')
})