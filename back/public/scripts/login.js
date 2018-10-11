$( document ).ready(function() {

    $('#submitBtn').on('click', (e) => {
  
        e.preventDefault();


        //ajax call to posting to the database with the information from the login form
            $.ajax({
              method: 'POST',
              data: $('form').serialize(),
              success: loginSuccess,
              error: function onError() {
                let p = `<p style="color:red; margin-top:0px;">Username/Password incorrect please try again</p>`
                $('.loginErrors').empty().append(p);
              }
            });

            function loginSuccess(json) {
              localStorage.clear();
              localStorage.setItem("token", json.signedJwt);
              window.location.assign('http://localhost:3000/search');
              console.log('YOU SHOULD LEAVE THIS PAGE!');
                
            }

    });
    checkForLogin()
});


//validates the user and returns it to the console.
    
function checkForLogin(){
  if(localStorage.length > 0){

    let jwt = localStorage.token
    $.ajax({
      type: "POST",
      url: '/verify',  
      beforeSend: function (xhr) {   
          xhr.setRequestHeader("Authorization", 'Bearer '+ localStorage.token);
      }

    }).done(function (response) {
      console.log(response)
      user = { username: response.username, _id: response._id }
      console.log("you can access variable user: " , user)
        $('#message').text(`Welcome, ${ response.username || response.result.username } `);
        sleep(500).then(() => {
          window.location = "http://localhost:3000/search";
          
        })
    }).fail(function (err) {
        console.log(err);
    });
  }
}
  
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
  
  
