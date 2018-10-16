$( document ).ready(function() {
    checkForLogin()

    console.log("Document ready");
    console.log("Test Variable: ")

    $('form').on('submit', e=>{
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: '/verify',  
            beforeSend: function (xhr) {   
                xhr.setRequestHeader("Authorization", 'Bearer '+ localStorage.token);
            }
      
          }).done(function (response) {
            console.log($('form').serialize())
            let hrid=response.hrID
            $.ajax({
                method: 'PUT',
                data: $('form').serialize(),
                url: "/userext/"+hrid ,
                success: titleSuccess,
                error: titleError
            
            });
        })
    
    
            function titleSuccess (response) {
                console.log(response)
            }
            function titleError (response) {
                console.log(response)
            }
    })
})

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
        const email = response.email
      }).fail(function (e1,e2,e3) {
          console.log(e2);
          window.location = "/login"
      });
    }else{
      window.location = "/"
    }
  }