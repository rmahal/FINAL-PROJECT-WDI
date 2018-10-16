$.ajax({
  method: "GET",
  url: 'http://localhost:3001/allemployees/',
  success: function success(succ) {
      console.log('success')
      console.log(succ)
      for(var i=0; i<succ.length;i++){
        $(".results").append("<div class='cardrow'><a href='/userprofile/"+succ[i]._id+"'><div class='container'><h4><b>"+succ[i].FirstName+" "+succ[i].LastName+"</b></h4><p>"+succ[i].JobTitle+" of "+succ[i].Org+"</p></div></a></div>")
      }
  },
  error: function error(err){
    console.log(err)
  }
})

$( document ).ready(function() {

    checkForLogin();

    console.log("Document ready");


      $("#myInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".results div").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      });

  
  
  
    
  });
  
  

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
      
      let url="/userprofile/"+hrid
      console.log(url)
      $("#profileLink").attr("href",url)
      if(response.email.length > 0){
        let welcome = "Welcome, "+response.email
        console.log(welcome)
        $("#welcome").html(welcome)
      }
    }).fail(function (e1,e2,e3) {
        console.log(e2);
        window.location = "/login"
    });
  }else{
    window.location = "/"
  }
}

  
  
  //MEDIA QUERY FOR LANDING PAGE.
  
  if (window.matchMedia("(max-width: 725px)").matches) {
  
  
  } 