// $.ajax({
//   method: "GET",
//   url: 'https://rmahal.com/projects/empdir/hr/allemployees',
//   success: function success(succ) {
//       console.log('success')
//       console.log(succ)
//       for(var i=0; i<succ.length;i++){
//         $(".results").append("<div class='borderround'><div class='cardrow'><a href='userprofile/"+succ[i]._id+"'><div class='container'><h4><b>"+succ[i].FirstName+" "+succ[i].LastName+"</b></h4><p>"+succ[i].JobTitle+" of "+succ[i].Org+"</p></div></a></div></div>")
//       }
//   },
//   error: function error(err){
//     console.log(err)
//   }
// })

if(localStorage.getItem("name") === null){
  window.location.assign("/")
}else{
  $("#fullname").text(localStorage.getItem("name"))
  let googleimg = localStorage.getItem("img")
  $(".googleImg").attr("src", googleimg)
}

$( document ).ready(function() {

    //checkForLogin();
    console.log("Document ready");
    if(localStorage.getItem("id") === null){
      window.location.assign("/")
    }


    $.ajax({
      method: "GET",
      url: 'https://rmahal.com/projects/empdir/hr/employee/'+localStorage.getItem("id"),
      success: function succ(succ) {
        console.log("SUCC")
        console.log(succ)
        if(succ.length < 1){
          console.log("LESS THAN 1 WAS HIT")
          $("#editProfile").css({ "cursor": "not-allowed", "text-decoration": "none", "pointer-events": "none", "color": "#D8D8D8"})
        }
      },
      error: function err(err){
        console.log(err)
      }
    })



      // $("#myInput").on("keyup", function() {
      //   var value = $(this).val().toLowerCase();
      //   $(".results div").filter(function() {
      //     $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      //   });
      // });

      // let input = document.getElementById("myInput");
      // input.addEventListener("keydown", (event) => {
      //   event.preventDefault();
      //   if (event.keyCode === 13) {
      //     document.getElementById("search").click();
      //   }
      //   return ""
      // })

      $("#myInput").keypress((e)=>{
        if (e.keyCode === 13) {
              e.preventDefault();
              document.getElementById("search").click();
            }
      })

      $("#search").on("click", ()=>{
        
        let val = $("#myInput").val()
        console.log(val)

        $.ajax({
          method: "GET",
          url: 'https://rmahal.com/projects/empdir/hr/search/employees/'+val,
          success: function success(succ) {
            //console.log(succ)
            $.ajax({
              method: "POST",
              url: 'https://rmahal.com/projects/empdir/back/getImages',
              data: {
                employees: succ
              }
              ,
              success: function successTwo(succTwo) {
                console.log('success')
                console.log(succ.length)
                console.log('second success')
                console.log(succTwo.userInfo[0])
                if(succ.length > 0 && succTwo.userInfo.length > 0){
                  console.log("if was hit")
                $(".list-unstyled").empty()
                for(var i=0; i<succ.length;i++){
                  $(".list-unstyled").append('<li class="media"><a href="userprofile/'+succ[i]._id+'"><img class="mr-3 rounded-circle" src="'+succTwo.userInfo[i][1]+'" alt="Generic placeholder image"></a><div class="media-body"><a href="userprofile/'+succ[i]._id+'" class="mt-0 mb-1 name"><span class="first_name">'+succ[i].FirstName+'</span><span class="last_name"> '+succ[i].LastName+'</span></a><div class="more-info"><span class="desigation"><a href="userprofile/'+succ[i]._id+'">'+succ[i].JobTitle+'</a></span>,<span class="company_name"><a href="userprofile/'+succ[i]._id+'">'+succ[i].Org+'</a></span></div><div class="contact-info"><span class="country"><a href="userprofile/'+succ[i]._id+'"><span><img src="img/united-states.svg"></span>'+succ[i].CountryCode+'</a></span><span class="email"><a href="mailto:'+succ[i].Email+'"><span><img src="img/email.svg"></span>'+succ[i].Email+'</a></span><span class="phone"><a href="tel:1'+succ[i].Phone+'"><span><img src="img/phone.svg"></span>+1 '+succ[i].Phone+'</a></span></div></div><a href="userprofile/'+succ[i]._id+'" class="visit_profile_button"><img src="img/next.svg"></a></li>')

                }
                }else{
                  $(".list-unstyled").empty()
                  $(".list-unstyled").append("<li><h4><p>No results found please try again</p></h4></li>")
                }
                
              },
                  error: function errorTwo(errorTwo) {
                    console.log(errorTwo)
                  }
            })
          },
          error: function error(err){
            console.log(err)
          }
        })
        
      })
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