# Employee Directory / Empdir
<table>
<tr>
<td>
EmpDir is an Employee Directory portal, which includes a mock HR system that is extended by this Employee Directory portal. This app is accessible by endusers via web and mobile. 
</td>
</tr>
</table>


## Demo
Here is the working live demo :  https://rmahal.com/projects/empdir/back/

Link to Trello:
* https://trello.com/b/hun8GhPX/final-project

## Site
![Landing Page Image](https://raw.githubusercontent.com/rmahal/FINAL-PROJECT-WDI/master/back/public/img/readmepics/indexPic.png?raw=true "Landing Page Image")

![UserProfile Page Image](https://raw.githubusercontent.com/rmahal/FINAL-PROJECT-WDI/master/back/public/img/readmepics/userProfilePic.png?raw=true "UserProfile Page Image")

![Edit Page Image](https://raw.githubusercontent.com/rmahal/FINAL-PROJECT-WDI/master/back/public/img/readmepics/editPic.png?raw=true "Edit Page Image")


## Technologies Used

* Node
* Express
* MongoDB
* REST
* EJS
* TimeZoneDB - Looks up current time for every employee profile page based on their timezone.
* Google Auth - Allows users to signin and use the site with their gmail account.


## Existing Features

* Ability to search through employees and veiw their profile
* JWT tokens generated to handle remembering user login
* Users can edit their profile as well as that of profiles of those who report to them
* User signup connects to the hr backend and uses a lookup to authenticate email as a valid one if they exist in the HR back end




## Planned Features

* Change the search to scale for a bigger set of users and be a true elastic search
* Add AWS Facial Recognition to the photo upload to help provide a better profile picture



##Contributors


[![Raj Mahal](https://avatars0.githubusercontent.com/u/15217218?s=460&v=4)](https://github.com/rmahal)

[Raj Mahal ](https://github.com/rmahal) 




## Favorite code Snippets


```javascript                       


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


```