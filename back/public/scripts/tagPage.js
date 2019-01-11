if(localStorage.getItem("name") === null){
    window.location.assign("/")
  }else{
    $("#fullname").text(localStorage.getItem("name"))
    let googleimg = "../"+localStorage.getItem("img")
    $(".googleImg").attr("src", googleimg)
}

$( document ).ready(function() {
    console.log("Document ready")
    
  

  
  })