$.ajax({
  method: "GET",
  url: 'http://localhost:3001/allemployees/',
  success: function success(succ) {
      console.log('success')
      console.log(succ)
      for(var i=0; i<succ.length;i++){
        $(".results").append("<div><p><a  href='/userprofile/"+succ[i]._id+"'>"+succ[i].FirstName+" "+succ[i].LastName+"</a></p><p>Position: "+succ[i].JobTitle+"</p><br><hr></div>")
      }
  },
  error: function error(err){
    console.log(err)
  }
})

$( document ).ready(function() {

    console.log("Document ready");


      $("#myInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".results div").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      });

  
  
  
    
  });
  
  
  
  
  //MEDIA QUERY FOR LANDING PAGE.
  
  if (window.matchMedia("(max-width: 725px)").matches) {
  
  
  } 