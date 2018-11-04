$.ajax({
  method: "GET",
  url: 'http://localhost:3002/allTags',
  success: function success(succ) {
    console.log('success')
    console.log(succ)
    for(var i=0; i<succ.length;i++){
      console.log("appending")
      $("table tbody").append("<tr><th scope='row'>"+i+"</th><td>-</td><td><a href= 'tags/'"+succ[i].tag[0]._id>+">"+succ[i].tag[0].TagName+" </a></td><td>-</td><td># "+succ[i].count+"</td></tr>") 
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
        $(".list-unstyled li").filter(function() {
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