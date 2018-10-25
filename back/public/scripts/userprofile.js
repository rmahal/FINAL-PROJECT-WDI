$( document ).ready(function() {
    checkForLogin()
    $('form').on('submit', e=>{
        //e.preventDefault();

            console.log($('form').serialize())
            let pageId = parseInt($("#editButton").data("id")[0])
            $.ajax({
                method: 'PUT',
                data: $('form').serialize(),
                url: "/userext/"+pageId ,
                success: titleSuccess,
                error: titleError
            
            });
    
    
            function titleSuccess (response) {
                console.log(response)
            }
            function titleError (response) {
                console.log(response)
            }
    })



    $('#logout').on('click', e=>{
        e.preventDefault();
        localStorage.clear();

        
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
        user = { email: response.email, hrid: response.hrID, _id: response._id }
        
        let url="/userprofile/"+hrid
        $("#profileLink").attr("href",url)
        if(response.email.length > 0){
            let welcome = "Welcome, "+response.email
            $("#welcome").html(welcome)
        }
        let userButton = parseInt($("#editButton").data("id")[0])
        let managerButton = parseInt($("#editButton").data("id")[1])
        if((response.hrID === userButton)||(response.hrID === managerButton)){
        $("#editButton").append("                                    <button type='button' class='btn btn-primary' data-toggle='modal' data-target='#exampleModal' data-whatever='@getbootstrap'>Edit Profile</button>")
        }
        const email = response.email
      }).fail(function (e1,e2,e3) {
          console.log(e2);
       
      });
    }
  }