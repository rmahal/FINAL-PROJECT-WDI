if(localStorage.getItem("name") === null){
    window.location.assign("/")
  }else{
    $("#fullname").text(localStorage.getItem("name"))
    let googleimg = localStorage.getItem("img")
    $(".googleImg").attr("src", googleimg)
}

$( document ).ready(function() {

    console.log("Val")
    console.log($("#timeZone").attr("data-id"))
    let zone = $("#timeZone").attr("data-id")
    $.ajax({
        method: 'GET',
        url: "https://api.timezonedb.com/v2.1/get-time-zone?key=LF4OCMBPWOOA&format=json&by=zone&zone="+zone ,
        success: apiSuccess,
        error: apiError
    })

    function getDayOfWeek(date) {
        var dayOfWeek = new Date(date).getDay();
        if(dayOfWeek === 6){
            dayOfWeek = 0
        }else{
            dayOfWeek += 1
        }    
        return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
      }
    
    function apiSuccess(response){
        console.log(response)
        console.log("first 2")
        let front = response.formatted.slice(11,13)
        console.log(front)
        let time = (front % 12 )+response.formatted.slice(13, (response.formatted.length-3))+" "+((front >= 12)? 'pm' : 'am')
        console.log("Testing"+ time)
        console.log(response.formatted.slice(0,10));
        let format = getDayOfWeek(response.formatted.slice(0,10))+" "+time
        $("#timeZone").text(format)
        //window.location = '/vcard'
    }
    function apiError(error){
        console.log(error)
    }




    //checkForLogin()
    if(localStorage.getItem("id") === null){
        window.location.assign("/")
      }

      let id = $("#id").attr("data-id")
      let firstName = $("#firstName").attr("data-id")
      let lastName = $("#lastName").attr("data-id")
      let jobTitle = $("#jobTitle").attr("data-id")
      let workPhone = $("#workPhone").attr("data-id")
      let organization = $("#organization").attr("data-id")
      let cellPhone = $("#cellPhone").attr("data-id")
      let email = $("#email").attr("data-id")
      let street = $("#street").attr("data-id")
      let city = $("#city").attr("data-id")
      let state = $("#state").attr("data-id")
      let zipCode = $("#zipCode").attr("data-id")
      let countryCode = $("#countryCode").attr("data-id")

      let jsonPayload = {
        payid: id,
        payfirstName: firstName,
        paylastName: lastName,
        payjobTitle: jobTitle,
        payworkPhone: workPhone,
        payorganization: organization,
        paycellPhone: cellPhone,
        paystreet: street,
        payemail: email,
        paycity: city,
        paystate: state,
        payzipCode: zipCode,
        paycountryCode: countryCode
      }



        $.ajax({
            method: 'POST',
            data: {
                payload: jsonPayload
            },
            url: "http://localhost:3002/vcard" ,
            success: cardSuccess,
            error: cardError
        })
        //https://rmahal.com/projects/empdir/back/vcard
        
        function cardSuccess(response){
            console.log(response)
            //window.location = '/vcard'
        }
        function cardError(error){
            console.log(error)
        }



    $("#searchBar").keypress((e)=>{
        if (e.keyCode === 13) {
                e.preventDefault();
                document.getElementById("searchButton").click();
            }
        })

        $("#searchButton").on("click", ()=>{
        let val = $("#searchBar").val()
        console.log(val)
        window.location.assign("../search?search="+val)
    })




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
        
        let url="userprofile/"+hrid
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