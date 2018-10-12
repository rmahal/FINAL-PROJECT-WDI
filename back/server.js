const express = require('express')
const parser = require('body-parser')


const app = express()


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static('public'));


app.get("/", (req,res)=>{
    res.sendFile('views/index.html', {root: __dirname});
})

app.get("/org", (req,res)=>{
    res.sendFile('views/orgchart.html', {root: __dirname});
})
app.get("/userprofile", (req,res)=>{
    res.sendFile('views/userprofile.html', {root: __dirname});
})

app.listen(3000, () => {
    console.log('Backend server listening on port 3000 ...')
})