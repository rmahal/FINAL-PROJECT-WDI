const express = require('express')
const db = require('./models')
const ejs = require('ejs')
const cors = require('cors')
const axios = require('axios')
const fetch = require("node-fetch")
const jwt = require('jsonwebtoken')
const multer = require('multer')
let vCard = require('vcards-js')
var fs = require('file-system')
const app = express()
const bodyParser = require('body-parser');
const favicon = require('serve-favicon')
const path = require('path')
var atob = require('atob');

app.use(
    bodyParser.json(
        {
            limit: '50mb'
        }
    )
)

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
                next(null, true);
            }else{
                return next();
            }
    }
}



app.get("/", (req, res) => {
    res.render('index')
})



app.post("/vcard", (req,res)=>{

vCardret = vCard();
//console.log("CARD HIT")
//console.log("DATA")
//console.log(req.body)
if(req.query === null || req.body === ""){
    res.status(404)
}
//console.log("VCARD INFO:")
//console.log(req.query)
let photoPath = "http://localhost:3002/"+req.body.payload.photo
console.log("IMG PATH TO ATTACH FOR VCARD:")
console.log(photoPath)
//set properties
vCardret.firstName = req.body.payload.firstName
vCardret.lastName = req.body.payload.lastName
vCardret.title = req.body.payload.jobTitle
vCardret.workPhone = req.body.payload.workPhone
vCardret.organization = req.body.payload.organization
vCardret.photo.attachFromUrl(photoPath, 'JPEG')
//vCardret.photo.embedFromFile(photoPath);
//console.log(req.body.payload.photo)
vCardret.workEmail = req.body.payload.email
vCardret.cellPhone = req.body.payload.cellPhone
vCardret.workAddress.label = 'Work Address';
vCardret.workAddress.street = req.body.payload.street;
vCardret.workAddress.city = req.body.payload.city;
vCardret.workAddress.stateProvince = req.body.payload.state;
vCardret.workAddress.postalCode = req.body.payload.zipCode;
vCardret.workAddress.countryRegion = req.body.payload.countryCode;
//console.log("Vcardret variable after values added: ")
//console.log(vCardret)
//set content-type and disposition including desired filename
res.set('Content-Type', 'text/vcard; name="profile.vcf"');
res.set('Content-Disposition', 'inline; filename="profile.vcf"');

let name = __dirname+"/public/vcf/"+req.body.payload.id+".vcf"
//console.log(name)
//console.log("Routing")

vCardret.version = '3.0';

vCardret.saveToFile(name);

//send the response
res.sendFile(name);


})

app.get("/user/:id", (req,res) =>{
    let userID = req.params.id
    var url = "https://rmahal.com/projects/empdir/hr/employee/"+userID
    fetch(url)
    .then(response => response.json())
    .then(response => {
        res.json(response)
    })
})

app.post("/getImages", (req, res) =>{
    getImages(req.body.employees).then(empResults =>{
        res.json({
            userInfo: empResults,
        })
    }).catch((error) => {
        res.status(404)
    })

    res.status(200)
})


app.get("/search", (req,res)=>{
    let value= ""

    if(req.query.search !== undefined || req.query.search !== "" ){
        value = req.query.search
    }else{
        value = ""
    }
    res.render('search', {search: value})
})

app.get("/org", (req,res)=>{
    res.sendFile('views/orgchart.html', {root: __dirname});
})

app.post('/upload',multer(multerConfig).single('photo'),function(req,res){
    res.send('Complete!');
})

app.get('/userprofile/:id', (req, res) => {
    var id = req.params.id;
    var url = "https://rmahal.com/projects/empdir/hr/superLOOKUP/"+id
    let userMap
    fetch(url)
    .then(response => response.json())
    .then(response => {

    
        db.Contact.find({userID: id}, (err, successContacts)=>{
            if(err){
                console.log(err)
                res.status(404)
            }
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

                    let tagIds = successTags.map(tagId =>{
                        return tagId.tag
                    })

                    let allTags = getTag(tagIds)
                    // db.Userext.find({}, (errallUEXT, succUserExt)=>{
                        // if(errallUEXT){
                        //     res.status(404)
                        // }else{
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
            getTagInfo(result).then(finished=>{
                res.json(finished)
            })
        }
    })
})

async function getTag(result) {
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
    //console.log("sending off data")
    //console.log(tag)
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


function resolveAfter2Seconds() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('resolved');
      }, 2000);
    });
  }

  
app.get('/tags/:id', (req, res) =>{

    let id = req.params.id
    var resp
    //var url = "https://rmahal.com/projects/empdir/hr/superLOOKUP/"
    var url = "https://rmahal.com/projects/empdir/hr/employee/"
    db.Tag.findOne({_id: parseInt(id)}, (err, successTag) =>{
        if(err){
            res.status(400)
        }else if(successTag === null){
           res.status(404)
        }else{
            db.Tagjoin.find({tag: parseInt(id)}, (errTwo, successTagjoin) =>{
                if(errTwo){
                    res.json(400, {error: "Error"})
                }else{
                    getUsersfromTags(successTagjoin)
                    .then(response => {
                        console.log("Response")
                        console.log(response)
                        res.render('tagPage',{
                            tag: successTag,
                            response: response
                        })
                        //return response
                    })
                    .catch(function(err) {
                        console.log("user find for tags catch was hit")
                        return Promise.reject(["rejected", err])
                    })
                }

            
                })
            }
        })
    })


async function getUsersfromTags(people) {

    var url = "https://rmahal.com/projects/empdir/hr/employee/"
    var person
    var personExt
    var peopleList = []
    for(let i = 0; i < people.length; i++){
        person = await fetch(url+people[i].user).catch(err=> {console.log(err)})
        person = await person.json()
        console.log("P E R S O N:")
        console.log(person)
        personExt = await db.Userext.findOne({hrUID: parseInt(people[i].user)}).catch(err=> {console.log(err)})
        console.log("P E R S O N E X T:")
        console.log(personExt)

        peopleList.push({
            user: person[0],
            userExt: personExt
        })
        url = "https://rmahal.com/projects/empdir/hr/employee/"
        }

        return await peopleList
        
    }





function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var response = {};

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}


app.patch('/editProfile/:id', (req,res)=>{
    var id = req.params.id
    var image = req.body.image
    if(image === undefined){
        res.json(400, {error: "image is undefined"} )
    }
    var imageName = id+"."+req.body.fileExt
    var fileName = "./public/img/profilepics/"+imageName
    var data = image.replace(/^data:image\/\w+;base64,/, '')

    
    fs.writeFile(fileName, data, {encoding: 'base64'}, function(err){
        //Finished
        var newImg = "img/profilepics/"+imageName
        db.Userext.findOneAndUpdate({hrUID: parseInt(req.params.id)}, {PhotoURL: newImg},(err, succ)=>{
            if (err){
                return res.send(500, { error: err })
            }else if(succ === null){
                return res.send(400, {error: "user not found"})
            }else{
                return res.json({Success: "Image Uploaded"})
            }
        })
      });

})




app.get("/userext/:id", (req,res)=>{
    console.log(req.params.id)
    let info={}
    let id = req.params.id
    db.Userext.findOne({hrUID: parseInt(id)}, (err, successFind)=>{
        if(err){
            res.status(500)
        }else if(successFind === null){
            res.json(404, {error: "no results"})
        }else{
            id= id.toString()
            db.Contact.find({userID: id}, (err, successContact)=>{
                if(err){
                    res.status(500)
                }else if(successContact === null){
                    res.json(404, {error: "no results"})
                }else{
                    db.Tagjoin.find({user: parseInt(id)})
                    .populate('tag')
                    .exec( (err, successTags) => {
                    if(err){
                        console.log(errTwo)
                        res.status(404)
                    
                    }
                    console.log("TAGS:")
                    let tagIds = successTags.map(tagId =>{
                        return tagId.tag.TagName
                    })
                    info ={
                        userext: successFind,
                        contact: successContact,
                        tags: tagIds
                    }
                    res.json(info)
                    })
                }
            })
        }
    })
})


/**
 * Lookup from user ext table by id.
 * @constructor
 * @param {number} id - The id to look up.
 */


app.put('/userext/:hrid', (req, res)=>{
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


/* Self created signup and login routes to create users */
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

    if(arr.length > 0 && arr !== undefined ){

    for(let i =0; i < arr.length; i++){
        id = parseInt(arr[i]._id)
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

        if(userExtReportee === null){
            console.log("user is NULL")
        }
        id = userExtReportee._id
        photo = userExtReportee.PhotoURL
        smallArr = [id, photo]
        userimages.push(smallArr)
    }
    console.log("userimages done")

    return userimages;
    }else{
        //console.log("no images")
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

    //console.log("Response")
    //console.log(manager)
    if(manager){
        //console.log("If hit")
        id = parseInt(manager._id)
        user = await db.Userext.findOne({hrUID: parseInt(id)}, (err, succ)=>{
            if(err){
                console.log("Error was hit userext manager: ")
                console.log(err)
                return {}
            }else{
                //console.log("Success was hit userext manager: ")
                //console.log(succ)
                return succ
            }
        }).then(finish =>{
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

app.get('/allInfo/:id', (req,res)=>{
    let id = req.params.id
    db.Userext.findOne({hrUID: parseInt(id)} , (err, succExt)=>{
        if(err){
            console.log("Error was hit userext: ")
            console.log(err)
            return {}
        }else{
            console.log("no error in userEXT")
            db.Contact.find({userID: id} , (errTwo, succCont)=>{
                if(errTwo){
                    console.log("Error was hit contact: ")
                    console.log(errTwo)
                    return {}
                }else{
                    console.log("no error in contacts")
                    db.Tagjoin.find({user: parseInt(id)})
                    .populate('tag')
                    .exec( (successTags) => {
                        console.log("no error in tags")
                        res.json({id: req.params.id , allcontacts: succCont, allext: succExt, alltags: successTags})
                    
                    })
                }
            })         
        }
    })
})

/* TAGS CRUD: Create Read Update Delete */
app.get("/alltags", (req,res)=>{
    db.Tag.find({}, (err, succ)=>{
        if(err){
            console.log(err)
        }else{
            res.json(succ)
        }
    })
})

app.post("/addtag", (req,res)=>{
    db.Tag.create({}, (err, succ)=>{
        if(err){
            console.log(err)
        }else{
            res.json(succ)
        }
    })
})

/* Contacts CRUD: Create Read Update Delete */
app.get("/allcontacts", (req,res)=>{
    db.Contact.find({}, (err, succ)=>{
        if(err){
            console.log(err)
        }else{
            res.json(succ)
        }
    })
})

/* UserExts CRUD: Create Read Update Delete */
app.get("/alluserexts", (req,res)=>{
    db.Userext.find({}, (err, succ)=>{
        if(err){
            console.log(err)
        }else{
            res.json(succ)
        }
    })
})



app.listen(3002, () => {
    console.log("Test Dirname")
    console.log(__dirname)
    console.log('Backend server listening on port 3002 ...')
})