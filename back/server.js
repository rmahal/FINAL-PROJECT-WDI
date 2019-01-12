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
var atob = require('atob');
//alet salt = bcrypt.genSaltSync();

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

app.get("/allcontacts/:id", (req, res) => {
    var id = ""+req.params.id;
    //console.log("ID: "+id)
    //console.log(typeof id)
    db.Contact.find({userID: id}, (err, successContacts)=>{
        if(err){
            console.log(err)
            res.status(404)
        }else{
            res.json(successContacts)
        }
    })
})


app.get("/allcontacts", (req, res) => {

    db.Contact.find({}, (err, successContacts)=>{
        if(err){
            console.log(err)
            res.status(404)
        }else{
            res.json(successContacts)
        }
    })
})

app.get('/userprofile/:id', (req, res) => {
    var id = req.params.id;
    //console.log("ID: "+id)
    var url = "https://rmahal.com/projects/empdir/hr/superLOOKUP/"+id
    //console.log("URL: "+url)
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
                    //console.log(tagIds)

                    console.log("SUCCESS TAG")
                    //console.log(successTags)
                    let allTags = getTag(tagIds)
                    //console.log(getTag(tagIds))

                    console.log("\n\nUSER EXT: \n")
                    //console.log(successUserext)
                    // db.Userext.find({}, (errallUEXT, succUserExt)=>{
                        // if(errallUEXT){
                        //     res.status(404)
                        // }else{
                            console.log("ALL TAGS")
                            //console.log(allTags)
                            console.log("RESPONSE")
                            //console.log(response)
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


// app.get("/testTag/:tagname", (req, res)=>{
//     let id = 106
//     let sentTag = req.params.tagname
//     console.log(typeof sentTag)
//     db.Tag.find({TagName: sentTag}, (err, succ)=>{
//         if(err){
//             console.log("error finding tag")
//             res.send(500)
//         }else if(succ.length < 1){
//             db.Tag.find({}, (err,succFind)=>{
//                 if(err){
//                     console.log("error finding all tags")
//                     res.send(500)
//                 }else{
//                     console.log(succFind)
//                     let highest = 1
//                     for(var k=0; k<succFind.length; k++){
//                         if(highest < succFind[k]._id){
//                             highest = succFind[k]._id
//                             console.log(highest)
//                         }
//                     }
//                     highest = highest+1
//                     var tagToCreate = {
//                         _id: highest, 
//                         TagName: req.params.tagname
//                     }
//                     db.Tag.create(tagToCreate, (err, succCreated)=>{
//                         if(err){
//                             console.log(err)
//                             console.log("error creating tag")
//                             res.send(500, {error: "Could not create tag"})
//                         }else{
//                             let tagJoinToAdd = {
//                                 tag: succCreated._id,
//                                 user: id,
//                             }
//                             db.Tagjoin.create(tagJoinToAdd,(err, succTagJoin) =>{
//                                 if(err){
//                                     console.log(err)
//                                     console.log("error creating tagjoin")
//                                     res.send(500, {error: "Could not create tagjoin"})
//                                 }
//                             })
//                         }
//                     })
//                 }
//             })
//         }else{
//             res.json(succ)
//         }
//     })
// })

app.get("/userext/:id", (req,res)=>{
    console.log(req.params.id)
    let id = req.params.id
    db.Userext.findOne({hrUID: parseInt(id)}, (err, successFind)=>{
        if(err){
            res.status(500)
        }else if(successFind === null){
            res.json(404, {error: "no results"})
        }else{
            res.json(successFind)
        }
    })
})



app.get("/user/:id", (req,res)=>{
    var url = "https://rmahal.com/projects/empdir/hr/superLOOKUP/"+req.params.id
    fetch(url)
    .then(response => response.json())
    .then(response => {
        db.Userext.find({hrUID: req.params.id}, (err, successImg)=>{
            if(err){
                res.status(400)
            }else{
                console.log(successImg)        
                res.json({
                    id: response.user[0]._id,
                    name: response.user[0].FirstName+" "+response.user[0].LastName,
                    image: successImg[0].PhotoURL,
                    email: response.user[0].Email,
                })
            }
        })
    })
})


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
                        //userIdArray.push(response[0])
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
                    // console.log("R E S P")
                    // console.log(resp)
                    // res.json({resp})
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

  if (matches.length !== 3){
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}




/*
app.patch('/editProfile/:id', (req,res)=>{
    var id = req.params.id
    console.log("ID:")
    console.log(id)
    var image = req.body.image
    console.log("Image:")
    console.log(image)
    console.log("IMAGE TYPE")
    console.log(typeof image)
    var fileName = "./public/img/profilepics/"+req.body.fileName
    console.log("fName:")
    console.log(fileName)
    var data = image.replace(/^data:image\/\w+;base64,/, '')
   // var data = atob(image)
    console.log("data:")
    console.log(data)
    fs.writeFile(fileName, data, {encoding: 'base64'}, function(err){
        //Finished
        res.json({Success: "Image Uploaded"})
      });

})*/



app.patch('/editProfile/:id', (req,res)=>{
    var id = req.params.id
    console.log("ID:")
    console.log(id)
    var image = req.body.image
    console.log("Image:")
    console.log(image)
    if(image === undefined){
        res.json(400, {error: "image is undefined"} )
    }
    var imageName = id+"."+req.body.fileExt
    console.log(imageName)
    var fileName = "./public/img/profilepics/"+imageName
    console.log("fName:")
    console.log(fileName)
    var data = image.replace(/^data:image\/\w+;base64,/, '')
    console.log("data:")
    console.log(data)

    
    fs.writeFile(fileName, data, {encoding: 'base64'}, function(err){
        //Finished
        var newImg = "img/profilepics/"+imageName
        console.log("ID IN WRITE")
        console.log(id)
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

app.get("/editProfile", (req, res)=>{
    res.sendFile('views/editProfile.html', {root: __dirname});
})


// app.post("/editInfo/:id", (req, res)=>{
//     let id = req.params.id
// //    req.body.payload.length
//     let userExtInfo = req.body.payload[0]
//     let contacts = req.body.payload.slice(1, req.body.payload.length)
//     let tags = req.body.tags
//     console.log("TAGS")
//     console.log(tags)
//     //let tags = req.body.payload.tags

//     let overviewText = userExtInfo["overview-text"]
//     let mobilePhone = userExtInfo["mobile-phone"]
//     db.Userext.findOneAndUpdate({hrUID: id}, {OverviewText: overviewText, MobilePhone: mobilePhone}, (err, succ)=>{
//         if(err){
//             res.status(400)
//         }else if(succ){
//             res.status(200)
//         }
//     })

//     db.Contact.deleteMany({userID: id}, (err, succ)=>{
//         if(err){
//             console.log(err)
//         }
//     })

//     for(var i=0; i<contacts.length; i++){
//         if(contacts[i].name !== "" && contacts[i].val !== ""){
//             contactToAdd = {
//                 userID: id,
//                 Label: contacts[i].name,
//                 Value: "<a>"+contacts[i].val+"</a>",
//             }
//             db.Contact.create(contactToAdd, (err, succ)=>{
//                 if(err){
//                     console.log(err)
//                 }
//             })
//         }
//     }


//     let sentTag = tags
//     for(let v=0; v< sentTag.length; v++){
//         db.Tag.find({TagName: sentTag[v]}, (err, succFoundOne)=>{
//         if(err){
//             console.log("error finding tag")
//             res.send(500)
//         }else if(succFoundOne.length < 1){
//             db.Tag.find({}, (err,succFind)=>{
//                 if(err){
//                     console.log("error finding all tags")
//                     res.send(500)
//                 }else{
//                     console.log(succFind)
//                     let highest = 1
//                     for(var k=0; k<succFind.length; k++){
//                         if(highest < succFind[k]._id){
//                             highest = succFind[k]._id
//                             console.log(highest)
//                         }
//                     }
//                     highest = highest+1
//                     var tagToCreate = {
//                         _id: highest, 
//                         TagName: sentTag[v]
//                     }
//                     db.Tag.create(tagToCreate, (err, succCreated)=>{
//                         if(err){
//                             console.log(err)
//                             console.log("error creating tag")
//                             res.send(500, {error: "Could not create tag"})
//                         }else{
//                             let tagJoinToAdd = {
//                                 tag: succCreated._id,
//                                 user: id,
//                             }
//                             db.Tagjoin.create(tagJoinToAdd,(err, succTagJoin) =>{
//                                 if(err){
//                                     console.log(err)
//                                     console.log("error creating tagjoin")
//                                     res.send(500, {error: "Could not create tagjoin"})
//                                 }
//                             })
//                         }
//                     })
//                 }
//             })
//             // res.json({Name: "Less than 1 was hit"})
//             }else{
//                 let tagJoinToAdd = {
//                     tag: succFoundOne._id,
//                     user: id,
//                 }
//                 db.Tagjoin.create(tagJoinToAdd,(err, succTagJoin) =>{
//                     if(err){
//                         console.log(err)
//                         console.log("error creating tagjoin")
//                         res.send(500, {error: "Could not create tagjoin"})
//                     }
//                 })
//             }
//         })
//     }
//     res.send(200)
// })





app.get("/testTag/:tagname", (req, res)=>{
    let id = 106
    let sentTag = req.params.tagname
    console.log(typeof sentTag)

    addTag(req, res, id, sentTag);
})

function addTag(req, res, id, sentTag){
    db.Tag.find({TagName: sentTag}, (err, succ)=>{
        if(err){
            console.log("error finding tag")
            res.send(500)
        }else if(succ.length < 1){
            db.Tag.find({}, (err,succFind)=>{
                if(err){
                    console.log("error finding all tags")
                    res.send(500)
                }else{
                    console.log(succFind)
                    let highest = 1
                    for(var k=0; k<succFind.length; k++){
                        if(highest < succFind[k]._id){
                            highest = succFind[k]._id
                            console.log(highest)
                        }
                    }
                    highest = highest+1
                    var tagToCreate = {
                        _id: highest, 
                        TagName: sentTag
                    }
                    db.Tag.create(tagToCreate, (err, succCreated)=>{
                        if(err){
                            console.log(err)
                            console.log("error creating tag")
                            res.send(500, {error: "Could not create tag"})
                        }else{
                            let tagJoinToAdd = {
                                tag: succCreated._id,
                                user: id,
                            }
                            db.Tagjoin.create(tagJoinToAdd,(err, succTagJoin) =>{
                                if(err){
                                    console.log(err)
                                    console.log("error creating tagjoin")
                                    res.send(500, {error: "Could not create tagjoin"})
                                }
                            })
                        }
                    })
                }
            })
        }else{
            //res.json(succ)
            return
        }
    })
}


app.post("/editInfo/:id", (req, res)=>{
    let id = req.params.id
//    req.body.payload.length
    let userExtInfo = req.body.payload[0]
    let contacts = req.body.payload.slice(1, req.body.payload.length)
    let tags = req.body.tags
    console.log("TAGS")
    console.log(tags)
    //let tags = req.body.payload.tags

    let overviewText = userExtInfo["overview-text"]
    let mobilePhone = userExtInfo["mobile-phone"]
    db.Userext.findOneAndUpdate({hrUID: id}, {OverviewText: overviewText, MobilePhone: mobilePhone}, (err, succ)=>{
        if(err){
            res.status(400)
        }else if(succ){
            res.status(200)
        }
    })

    db.Contact.deleteMany({userID: id}, (err, succ)=>{
        if(err){
            console.log(err)
        }
    })

    for(var i=0; i<contacts.length; i++){
        if(contacts[i].name !== "" && contacts[i].val !== ""){
            contactToAdd = {
                userID: id,
                Label: contacts[i].name,
                Value: "<a>"+contacts[i].val+"</a>",
            }
            db.Contact.create(contactToAdd, (err, succ)=>{
                if(err){
                    console.log(err)
                }
            })
        }
    }


    let tag
    for(let v = 0; v < tags.length; v++){
        tag = tags[v];
        addTag(req, res, id, tag);
    }

    res.send(200)
})












app.get("/getEditInfo/:id", (req, res)=>{
    let id = req.params.id

    db.Userext.find({hrUID: id}, (err, succ) =>{
        if(err){
            console.log(err)
            res.send(404)
        }else if(succ){
            db.Contact.find({userID: id}, (errTwo, succTwo)=>{
                if(errTwo){
                    console.log(errTwo)
                    res.send(404)
                }else if(succTwo){

                    db.Tagjoin.find({user: parseInt(id)})
                    .populate('tag')
                    .exec( (errThree, succThree) => {
                        if(errThree){
                            console.log(errTwo)
                            res.send(404)
                        
                        }else{
                            res.json({
                                userExt: succ,
                                contacts: succTwo,
                                tags: succThree,
                            })
                        }
                    })
                }
            })
        }
    })

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
    //console.log("ARR: ")
    //console.log(arr)

    if(arr.length > 0 && arr !== undefined ){
        //console.log("before loop")
    for(let i =0; i < arr.length; i++){
        //console.log("loop start")
        //console.log("Iteration: "+i)
        //console.log(arr[i]._id)
        id = parseInt(arr[i]._id)
        //console.log("ID IN IMAGES: ")
        //console.log(id)
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
    //console.log(manager)
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
            //console.log(finish)
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
