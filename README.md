# Project-HR / Human Rajsources

* Apllication for employees to sign up and find other employees and see their profile page for information like how to contact them as well as who is their boss and climb as clickable links to see their pages as well.

* Link to Heroku: WIP


* Link to Trello:
* https://trello.com/b/hun8GhPX/final-project

## Technologies Used

* MongoDB
* AJAX
* JQuery
* Node 
* Express
* EJS
* JWT
* async functions


## Existing Features

* Account creation and login with bcryption on passwords
* Ability to search through employees and veiw their profile
* JWT tokens generated to handle remembering user login
* Users can edit their profile as well as that of profiles of those who report to them
* User signup connects to the hr backend and uses a lookup to authenticate email as a valid one if they exist in the HR back end




## Planned Features

* Allow users to upload Profile pictures and save them to the backend
* Allow users to create and assign tags to themselves and their reportees
* Change the search to scale for a bigger set of users and be a true elastic search, searching through tags/emails/phone numbers/
* Show a little more information like who are people one level above you ex: same employee level as your boss.
* Fix back end bug where it hangs showing user profile info.



##Code Snippets


```javascript                       

//Raj


    db.User.find({userName: username}, (err, userFound) => {
        if(err){
            res.status(401);
        }
        if(userFound < 1){
            res.status(404).json({message: "USER NOT FOUND"})
        }else{
            let uid = userFound[0]._id;
            console.log("user found: ", uid)
            db.Like.find({_user: uid})
                .populate('_flix')
                .exec( (err, succ) => {
                    res.json(succ);
                })
        }
    })


```