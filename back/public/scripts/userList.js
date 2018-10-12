$.ajax({
    method: "GET",
    url: 'http://localhost:3001/allemployees',
    success: appendUsers,
    error: errUsers

})

//this function appends a list of clickable links that have the name of all the usernames in the database
function appendUsers(e) {
    console.log(e)
    e.forEach(function(user) {
        $('.userList').append(`<a data-id="${user._id}" href="/userprofile/${user._id}">${user.FirstName} ${user.LastName}</a><br><br>`)
    })
}

function errUsers(err){
    console.log(err)
}






