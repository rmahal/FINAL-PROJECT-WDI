$( document ).ready(function() {

    console.log("Document ready");

    $('#signUpBtn').on('click', (e) => {

        console.log("Button Clicked");
        e.preventDefault();
        console.log("Default prevented");

            $.ajax({
                method: 'POST',
                data: $('form').serialize(),
                success: signupSuccess,
                error: function onError() {
                    let p = `<p style="color:red; margin-top:0px;">Username already exists please try new username or go to login below</p>`
                    $('.signUpErrors').empty().append(p);
                }
            })
    })  

    function signupSuccess(json) {
        localStorage.clear();
        localStorage.setItem("token", json.signedJwt);

        let p = `<p style="color:green; margin-top:0px;">Account created sucessfully, redirecting...</p>`
        $('.signUpErrors').empty().append(p);
        sleep(2000).then(() => {
            window.location = "http://localhost:3000/login";
            console.log(json)
        })
    }

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
      }
});