const express = require('express')
const db = require('./models')
const ejs = require('ejs')
const cors = require('cors')
const axios = require('axios')
const fetch = require("node-fetch")
//const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const multer = require('multer')
let vCard = require('vcards-js')
var fs = require('file-system')
const app = express()
const bodyParser = require('body-parser');
const favicon = require('serve-favicon')
const path = require('path')
//alet salt = bcrypt.genSaltSync();


app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
});


app.use(cors())

app.use(express.static('public'))

app.set('view engine', 'ejs')
app.use(favicon(path.join(__dirname, '/public/img/','favicon.ico')))
console.log(__dirname+'/public/img/'+'favicon.ico')

console.log("STATIC PATH")

const multerConfig = {
    
    storage: multer.diskStorage({
        destination: function(req, file, next){
            next(null, './public/img');
            },   
            
            //Then give the file a unique name
            filename: function(req, file, next){
                console.log(file);
                const ext = file.mimetype.split('/')[1];
                next(null, file.fieldname + '-' + Date.now() + '.'+ext);
            }
            }),
            fileFilter: function(req, file, next){
                if(!file){
                    next();
                }
            const image = file.mimetype.startsWith('image/');
            if(image){
                console.log('photo uploaded');
                next(null, true);
            }else{
                console.log("file not supported");
                
                return next();
            }
    }
}



app.get("/", (req, res) => {
    res.render('index')
})



app.get("/vcard", (req,res)=>{

vCardret = vCard();
console.log("DATA")
console.log(req.query)
if(req.query === null || req.query === ""){
    res.status(404)
}
console.log("VCARD INFO:")
console.log(req.query)
let photoPath = "https://rmahal.com/projects/empdir/back/img/profilepics/"+req.query.id+".jpg"
//set properties
vCardret.firstName = req.query.firstName
vCardret.lastName = req.query.lastName
vCardret.job = req.query.jobTitle
vCardret.workPhone = req.query.workPhone
vCardret.organization = req.query.organization
vCardret.photo.attachFromUrl(photoPath, 'JPEG')
vCardret.workEmail = req.query.email
vCardret.cellPhone = req.query.cellPhone
vCard.workAddress.label = 'Work Address';
vCard.workAddress.street = req.query.street;
vCard.workAddress.city = req.query.city;
vCard.workAddress.stateProvince = req.query.state;
vCard.workAddress.postalCode = req.query.zipCode;
vCard.workAddress.countryRegion = req.query.countryCode;

//set content-type and disposition including desired filename
res.set('Content-Type', 'text/vcard; name="profile.vcf"');
res.set('Content-Disposition', 'inline; filename="profile.vcf"');

let name = __dirname+"/public/vcf/"+req.query.id+".vcf"
console.log(name)
console.log("Routing")

vCard.version = '3.0';

vCardret.saveToFile(name);

//send the response
res.sendFile(name);


})

app.post("/getImages", (req, res) =>{
    console.log(req.body.employees)
    getImages(req.body.employees).then(empResults =>{
        res.json({
            userInfo: empResults,
        })
    }).catch((error) => {
        console.log(error);
        res.status(404)
    })

    res.status(200)
})


app.get("/search", (req,res)=>{
    //console.log("SEARCH REQ:")
    //console.log(req)
    let value= ""

    if(req.query.search !== undefined || req.query.search !== "" ){
        console.log("I was hit query val")
        value = req.query.search
    }else{
        console.log("I was hit, no query val")
        value = ""
    }
    console.log(value)
    res.render('search', {search: value})
})

app.get("/org", (req,res)=>{
    res.sendFile('views/orgchart.html', {root: __dirname});
})

app.post('/upload',multer(multerConfig).single('photo'),function(req,res){
    //console.log(req.params.data)
    res.send('Complete!');
})



// app.get('/tagProfile/:id', (req, res) => {
//     var id = req.params.id;
    
//     console.log("ID: "+id)
//     fetch('http://localhost:3001/getEmployees', {
//     method: 'POST',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({a: 1, b: 'Textual content'})
//     })
    
// })


app.get('/userprofile/:id', (req, res) => {
    var id = req.params.id;
    console.log("ID: "+id)
    var url = "https://rmahal.com/projects/empdir/hr/superLOOKUP/"+id
    console.log("URL: "+url)
    let userMap
    fetch(url)
    .then(response => response.json())
    .then(response => {

    
        db.Contact.find({userID: id}, (err, successContacts)=>{
            if(err){
                console.log(err)
                res.status(404)
            }
            //console.log(successContacts)
            db.Userext.find({hrUID: parseInt(id)}, (errTwo, successUserext)=>{
                if(errTwo){
                    console.log(errTwo)
                    res.status(404)
                }
                
                db.Tagjoin.find({user: parseInt(id)})
                    .populate('tag')
                    .exec( (errThree, successTags) => {
                    if(errThree){
                        console.log(errTwo)
                        res.status(404)
                    
                    }
                    console.log("TAGS:")
                    let tagIds = successTags.map(tagId =>{
                        return tagId.tag
                    })
                    console.log("TAG ID: ")
                    console.log(tagIds)

                    console.log("SUCCESS TAG")
                    console.log(successTags)
                    let allTags = getTag(tagIds)
                    //console.log(getTag(tagIds))

                    console.log("\n\nUSER EXT: \n")
                    console.log(successUserext)
                    // db.Userext.find({}, (errallUEXT, succUserExt)=>{
                        // if(errallUEXT){
                        //     res.status(404)
                        // }else{
                            console.log("ALL TAGS")
                            console.log(allTags)
                            console.log("RESPONSE")
                            console.log(response)
                                getImages(response.underlings).then(chain =>{
                                if(response.chainofcommand.length > 0){
                                getManagerImages(response.chainofcommand[1]).then(managerChain =>{
                                    res.render('userprofile',{
                                        userInfo: response,
                                        contactsInfo: successContacts,
                                        UserextInfo: successUserext,
                                        TagsInfo: successTags,
                                        allImages: chain,
                                        managerImage: managerChain
                                    })
                                })
                                }else{
                                    console.log("I was hit no manager")
                                    res.render('userprofile',{
                                        userInfo: response,
                                        contactsInfo: successContacts,
                                        UserextInfo: successUserext,
                                        TagsInfo: successTags,
                                        allImages: chain,
                                        managerImage: [101,""]
                                    })
                                }
                            })
                        //}
                    //})
                })
            })
        })
    })
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        req.isLogged = true
        return next();
    }
    res.redirect('/');
}

app.delete('/users/:hrid', (req, res) => {
    db.User.deleteOne({hrID: req.params.hrid}, (err,succ)=>{
        if(err){
            console.log(err)
        }else{
            res.json(succ)
        }
    })
})

app.get('/users', (req, res) => {
    db.User.find({}, (err,succ)=>{
        if(err){
            console.log(err)
        }else{
            res.json(succ)
        }
    })
});



app.get('/login', function logInPage(req, res) {
    res.sendFile('views/loginPage.html', {root: __dirname});
})


app.get('/signup', function signUpPage(req, res) {
    res.sendFile('views/signUpPage.html', {root: __dirname});
    
})

app.get('/tagSearch' , (req, res) => {
    res.render('tagSearch')
})

app.get('/allTags', (req, res) => {

    db.Tagjoin.aggregate([{"$group" : {_id:"$tag", count:{$sum:1}}},{$sort:{"count":-1}}], (err, result) => {
        if (err) {
            res.status(400)
        } else {
            //console.log( result )
            getTagInfo(result).then(finished=>{
                res.json(finished)
            })
            console.log("test")
            //console.log(ids)
            console.log("done ids")
            //res.json(result)

        }
    })
})

async function getTag(result) {
    console.log(result[0])
    let tag = []
    let foundTag

    for(let i=0; i<result.length; i++){

        foundTag = await db.Tag.find( { _id : result[i] }, (err, succTag)=>{
            if (err) {
                console.log(err)
            } else {
                return succTag
            }  
        })
        .catch((error) => {
            console.log(error);
        })

        tag.push({tag: foundTag})

    }
    console.log("sending off data")
    console.log(tag)
    return tag
}



async function getTagInfo(result) {
    console.log(result[0].count)
    let tag = []
    let foundTag

    for(let i=0; i<result.length; i++){

        foundTag = await db.Tag.find( { _id : result[i] }, (err, succTag)=>{
            if (err) {
                console.log(err)
            } else {
                return succTag
            }  
        })
        .catch((error) => {
            console.log(error);
        })

        tag.push({tag: foundTag, count: result[i].count})

    }
    console.log("sending off data")
    console.log(tag)
    return tag
}


app.get('/tags/:id', (req, res) =>{

    let id = req.params.id
    let userId;
    let user = {}
    let userIdArray = []
    //var url = "https://rmahal.com/projects/empdir/hr/superLOOKUP/"
    var url = "https://rmahal.com/projects/empdir/hr/employee/"
    db.Tag.findOne({_id: parseInt(id)}, (err, successTag) =>{
        if(err){
            res.status(400)
        }else if(successTag === null){
           res.status(404)
        }else{
            db.Tagjoin.find({tag: parseInt(successTag._id)}, (errTwo, successTagjoin) =>{
                for(let i = 0; i < successTagjoin.length; i++){
                    console.log(successTagjoin[i].user)
                    userId = successTagjoin[i].user
                    user = getUsersfromTags(url+userId)
                    console.log("USER")
                    console.log(user)
                    userIdArray.push(user)
                    url = "https://rmahal.com/projects/empdir/hr/employee/"
            }
            res.json({userIdArray})  
            })
        }
    })
})


async function getUsersfromTags(url) {
    return await fetch(url)
    .then(response => response.json())
    .then(function(response) {
    //console.log(response)
    return response;

    })
    .catch(function(error) {
        console.log(error);
    }); 



    // let smallArr = []
    // let user
    // let usid = userId
    // let path = url
    // console.log("URL")
    // console.log(path)

    // console.log("ID: ")
    // console.log(userId)
    // if(usid){
    //     console.log("If hit")
    //     path = path+usid
    //     user = await fetch(path, {
    //         method: 'GET',
    //         mode: 'no-cors',
    //         })
    //         .then(response => response.json())
    //         .then(response => {
    //             console.log("RESPONSE")
    //             console.log(response)
    //             return response
    //         })
    //         .catch(function(err) {
    //             console.log("user find for tags catch was hit")
    //             return Promise.reject(["rejected", err])
    //         })
    //         return user
    // }else{
    //     console.log("skipped cause null")
    //     return smallArr
    // }

}

app.post('/editProfile/:id', (req,res)=>{
    var id = req.params.id
    console.log("ID:")
    console.log(id)
    var image = req.body.image
    console.log("Image:")
    console.log(image)
    var fileName = "./public/img/profilepics/"+req.body.fileName
    console.log("fName:")
    console.log(fileName)
    var data = image.replace(/^data:image\/\w+;base64,/, '')
    console.log("data:")
    console.log(data)
    fs.writeFile(fileName, data, {encoding: 'base64'}, function(err){
        //Finished
        res.json({Success: "Image Uploaded"})
      });

})



app.put('/userext/:hrid', (req, res)=>{
    console.log(req.body)
    let updatedText = req.body.overview
    let updatedPhoto = req.body.profpic
    let hrID = req.params.hrid
    let updatedBackdrop = req.body.bdpic

    let savedInfo = {
        hrUID: hrID,
        PhotoURL: updatedPhoto,
        BackdropURL: updatedBackdrop,
        OverviewText: updatedText,
    }
    console.log(req.body)
    db.Userext.findOneAndUpdate({hrUID: req.params.hrid}, savedInfo,{new: true}, (err, succ)=>{
        if (err){
            return res.send(500, { error: err })
        }else{
            return res.send(succ);
        }
    })
})

app.get("/editProfile", (err, res)=>{
    res.sendFile('views/editProfile.html', {root: __dirname});
})



/*
app.post('/signup', (req,res)=>{
    console.log("email: "+req.body.email)
    var emailres = req.body.email;
    var password = req.body.password;
    fetch('http://localhost:3001/employee/email/'+emailres)
    .then(response => response.json())
    .then(response => {
    console.log("RESPONSE:")
    console.log(response)
    if(response === null){
        console.log("if was hit")
        return res.status(401).json({message: 'Username already used please try again'})
    }else{
        console.log("we moved on")
        db.User.find({email: emailres}, (err, users) =>{
            if(err){console.log(err);}
    
            if (users.length >= 1){
                console.log("users already existed")
                return res.status(401).json({message: 'Username already used please try again'})
            }else{
                console.log('creating user')
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                    if(err){ 
                    console.log("hashing error:", err);
                    
                    res.status(200).json({error: err})
                    } else {
                        let userToCreate = {
                            email: emailres,
                            password: hash,
                            hrID: response._id
                        }
                        db.User.create( userToCreate ,(err, users) => {
                            if(err){console.log(err);}
                            let uid = users._id
                            jwt.sign(
                                { email: emailres, _id: uid, hrID: response._id },
                                "vampires",
                                {
                                    expiresIn: "1h"
                                },
                                (err, signedJwt) => {
                                    if(err){console.log(err);}
                                    console.log(signedJwt);
                                    let uid =  users._id
                                    let email =  emailres
                                    let hrid = response._id
                                    console.log("USER ID WE ARE LOOKING FOR: "+hrid)
                                    res.status(200).json({
                                        message: 'User Created',
                                        email,
                                        uid,
                                        hrid,
                                        signedJwt
                                    })
                                })
                            })
                        }
                    })
                }
            })
        }
    })
});
app.post('/login', (req, res) => {
    console.log("LOGIN CALLED");
    var emailres = req.body.email;
    var password = req.body.password;
    console.log("emailres: "+emailres);
    console.log("Password: "+password);
    // FINDS THE USER IN THE DATABASE
    db.User.find({email: emailres}, (err, users) => {
        if(err){
            console.log(err);
        }else if (users.length < 1) {
            console.log("nope")
            return res.status(401).json({message: 'Email/Password incorrect'})
        }
        let passCheck = bcrypt.compare(password, users[0].password, (err, hash) => {
            console.log("Got to Hasing "+hash);
            if(err){ 
                console.log("hashing error:", err); 
                return res.status(401).json({message: 'Email/Password incorrect'})
            }else{
                let uid = users[0]._id
                let hrid = users[0].hrID
                if(hash){
                    console.log("email: ",emailres)
                    jwt.sign(
                        { email: emailres,  _id: uid, hrID: hrid},
                        "vampires",
                        {
                            expiresIn: "1h"
                        },
                        (err, signedJwt) => {
                            if(err){console.log(err);}
                            console.log(signedJwt);
                            res.status(200).json({
                                message: 'User Created',
                                emailres,
                                hrid,
                                signedJwt,
                                
                            })
                        });
                }else{
                    return res.status(401).json({message: 'Username/Password incorrect'})
                }
            }
        });
    })
});
*/

app.post('/verifyForProf', verifyToken, (req, res) => {
    let verified= jwt.verify(req.token, 'vampires')
    console.log({isVerified: verified})

    ejs.render("",{verified: verified})
})


app.post('/verify', verifyToken, (req, res) => {
    let verified= jwt.verify(req.token, 'vampires')
    res.json(verified)
})


function verifyToken(req, res, next) {
    // Get auth header value
    // when we send our token, we want to send it in our header
    const bearerHeader = req.headers['authorization'];
    // console.log(bearerHeader)
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    
    } else {
        // Forbidden
        res.sendStatus(403);
    }
}


function signJwt(){
    jwt.sign(
        { username },
        "vampires",
        {
            expiresIn: "1h"
        },
        (err, signedJwt) => {
            if(err){console.log(err);}
            console.log(signedJwt);
            res.status(200).json({
                message: 'User Created',
                username,
                signedJwt
            })
        });
}


async function getImages(arr) {
    let userimages = []
    let smallArr = []
    let userExtReportee
    let id
    let photo
    console.log("ARR: ")
    console.log(arr)

    if(arr.length > 0 && arr !== undefined ){
        //console.log("before loop")
    for(let i =0; i < arr.length; i++){
        //console.log("loop start")
        console.log("Iteration: "+i)
        console.log(arr[i]._id)
        id = parseInt(arr[i]._id)
        console.log("ID IN IMAGES: ")
        console.log(id)
        userExtReportee = await db.Userext.findOne({hrUID: parseInt(id)}, (err, succ)=>{
            if(err){
                console.log("Error was hit userext reportees: ")
                console.log(err)
                return {}
            }else{
                console.log("Success was hit userext reportees: ")
                console.log(succ)
                return succ
            }
        })
        // db.Userext.findOne({'hrUID': id})
        //     .then( value => {
        //         console.log("userext then hit")
        //         console.log(value)

        //         id = value._id
        //         photo = value.PhotoURL
        //         smallArr = [id, photo]
        //         userimages.push(smallArr)
        //         return "value"
        //           // here I choose if I want to resolve or reject.
        //     })
        //     .catch(function(err) {
        //         console.log("userext catch hit")
        //         return Promise.reject(["rejected", err])
        //     })


        // .then(function(value) {
        //     console.log("userext then hit")
        //     console.log(value)
        //     return value
        //       // here I choose if I want to resolve or reject.
        //   })
        //   .catch(function(err) {
        //     console.log("userext catch hit")
        //     return Promise.reject(["rejected", err])
        //   })
        //console.log("await done for userext ")
        //console.log(userExtReportee)
        if(userExtReportee === null){
            // sleep(500).then(() => {
            //     console.log("SLEEPING")
            //   })
            console.log("user is NULL")

        }
        id = userExtReportee._id
        photo = userExtReportee.PhotoURL
        smallArr = [id, photo]
        userimages.push(smallArr)
    }

    //manImg = await db.Userext.findOne({_id: manager._id})
    //smallArr = [man.id, manImg.PhotoURL]
    //userimages.push(smallArr)
    console.log("userimages done")

    return userimages;
    }else{
        console.log("no images")
        return userimages
    }
}


const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

async function getManagerImages(manager) {
    let smallArr = []
    let user
    let id
    let photo

    console.log("Response")
    console.log(manager)
    if(manager){
        console.log("If hit")
        id = parseInt(manager._id)
        user = await db.Userext.findOne({hrUID: parseInt(id)}, (err, succ)=>{
            if(err){
                console.log("Error was hit userext manager: ")
                console.log(err)
                return {}
            }else{
                console.log("Success was hit userext manager: ")
                console.log(succ)
                return succ
            }
        }).then(finish =>{

            console.log("user hit")
            console.log(finish)
            id = finish._id
            photo = finish.PhotoURL
            smallArr = [id, photo]

        })
        return smallArr
    }else{
        console.log("skipped cause null")
        return smallArr
    }
}


app.listen(3002, () => {
    console.log("Test Dirname")
    console.log(__dirname)
    console.log('Backend server listening on port 3002 ...')
})