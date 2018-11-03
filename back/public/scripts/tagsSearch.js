$.ajax({
  method: "GET",
  url: 'https://rmahal.com/projects/empdir/back/allTags',
  success: function success(succ) {
      console.log('success')
      console.log(succ)
      for(var i=0; i<succ.length;i++){
        $(".results").append("<div class='borderround'><div class='cardrow'><a href='tags/"+succ[i]._id+"'><div class='container'><h4><b>"+succ[i].TagName+" </p></div></a></div></div>")
      }
  },
  error: function error(err){
    console.log(err)
  }
})

$( document ).ready(function() {

    //checkForLogin();

    console.log("Document ready");
    if(localStorage.getItem("id") === null){
      window.location.assign("/")
    }

      $("#myInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".results div").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      });


    //   $("#search").on("click", function(){
    //     let val = $("#myInput").val()
    //     console.log(val)

    //     $.ajax({
    //       method: "GET",
    //       url: 'http://localhost:3001/search/employees/'+val,
    //       success: function success(succ) {
    //           console.log('success')
    //           console.log(succ)
    //           if(succ.length > 0){
    //             $(".results").empty()
    //           for(var i=0; i<succ.length;i++){
    //             $(".results").append("<div class='borderround'><div class='cardrow'><a href='userprofile/"+succ[i]._id+"'><div class='container'><h4><b>"+succ[i].FirstName+" "+succ[i].LastName+"</b></h4><p>"+succ[i].JobTitle+" of "+succ[i].Org+"</p></div></a></div></div>")
    //           }
    //           }else{
    //             $(".results").empty()
    //             $(".results").append("<div class='borderround'><div class='cardrow'><div class='container'><h4><p>No results found please try again</p></h4></div></div>")
    //           }
    //       },
    //       error: function error(err){
    //         console.log(err)
    //       }
    //     })
        
      //})
  


  
      $('#logout').on('click', e=>{
        e.preventDefault();
        localStorage.clear();;
    });

    
  });
  
   function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  } 

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
      console.log("response: ")
      console.log(response)
      let hrid=response.hrID
      user = { email: response.email, hrid: response.hrid, _id: response._id }
      
      let url="userprofile/"+hrid
      console.log(url)
      $("#profileLink").attr("href",url)
      if(response.email.length > 0){
        let welcome = "Welcome, "+response.email
        console.log(welcome)
        $("#welcome").html(welcome)
      }
    }).fail(function (e1,e2,e3) {
        console.log(e2);
 
    });
  }
}

  
  
  //MEDIA QUERY FOR LANDING PAGE.
  
  if (window.matchMedia("(max-width: 725px)").matches) {
  
  
  } 