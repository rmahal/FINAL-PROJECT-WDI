if(localStorage.getItem("name") === null){
    window.location.assign("/")
  }else{
    $("#fullname").text(localStorage.getItem("name"))
    let googleimg = "../"+localStorage.getItem("img")
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
          $("#editProfile").css({ "cursor": "not-allowed", "text-decoration": "none", "pointer-events": "none"})
        }
      },
      error: function err(err){
        console.log(err)
      }
    })
  
  })