if(localStorage.getItem("name") === null){
    window.location.assign("/")
  }else{
    let googleimg = ""
    $("#fullname").text(localStorage.getItem("name"))
    if(localStorage.getItem("type") == "google"){
      googleimg = localStorage.getItem("img")
    }else{
      googleimg = "../"+localStorage.getItem("img")
    }
    $(".googleImg").attr("src", googleimg)
}

$( document ).ready(function() {
    console.log("Document ready")
    
  
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
  
  })