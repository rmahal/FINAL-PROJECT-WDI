# Employee Directory / Empdir
<table>
<tr>
<td>
EmpDir is an Employee Directory portal, which includes a mock HR system that is extended by this Employee Directory portal. EmpDir allows employees to find other employees and view their user profile information using the portal.
</td>
</tr>
</table>


## Demo
Here is the working live demo :  https://rmahal.com/projects/empdir/back/


## Site

Landing Page

![Landing Page Image](https://raw.githubusercontent.com/rmahal/FINAL-PROJECT-WDI/master/back/public/img/readmepics/indexPic.png?raw=true "Landing Page Image")

UserProfile Page

![UserProfile Page Image](https://raw.githubusercontent.com/rmahal/FINAL-PROJECT-WDI/master/back/public/img/readmepics/userProfilePic.png?raw=true "UserProfile Page Image")

Edit Page

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

* Ability to search for employees and view their profile pages
* Ability for employees to edit their profile page infromation/ profile picture
* Users can also look for employees via tags
* Timezone lookup allows users to see an employees current time based on their timezone on their profile pages
* Google Signin for users to be able to log in and view the site through their gmail account
* Demo account for users to navigate the site as an employee




## Planned Features

* Change the search to scale for a bigger set of users and be a true elastic search
* Add AWS Facial Recognition to the photo upload to help provide a better profile picture

## Planned Enhancements
* Improve JSDoc comments 
* Incorporate a bundler  - grunt / webback / gulp / or TBD
* Store config in environment (server-side) and in build profiles
* Improve logging 

## Contributors

<table>
<thead>
<tr>
<th>

[![Raj Mahal](https://avatars0.githubusercontent.com/u/15217218?s=460&v=4)](https://github.com/rmahal)
</th>
</tr>
</thead>
<tbody>
<tr>
<td>

[Raj Mahal ](https://github.com/rmahal) 
</td>
</tr>
</tbody>
</table>


## [License](https://github.com/rmahal/FINAL-PROJECT-WDI/blob/master/LICENSE.md)

MIT © [Raj Mahal ](https://github.com/rmahal)


## Favorite code Snippets

* This is an sync function that returns the employee and their manager all the way up to the board of directors

```javascript                       


async function getOneStepUp(id) {
    let listOfCommand = []; // Array for list of employee and managers
    let inLoop = true; // Boolean to stay in loop
    let user; // Var to set current employee
    
    while(inLoop){
        // Sets user to employee of id we passed in
        user = await db.Employee.findOne({_id: id});

        // Pushes employee to array
        listOfCommand.push(user)

        // Checks for manager
        if(user.manager === null || user.manager === undefined){
            // If no manager then break loop
            inLoop = false
        }else{
            // Sets id to manager id if manager exists
            id = user.manager
        }
    }

    // Returns Array
    return listOfCommand;
}


```