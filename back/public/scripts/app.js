$( document ).ready(function() {

  console.log("Document ready");

  $("#form").on('submit', (e) => {
    e.preventDefault();
    let p = $(".form-control").val();
    if(p.length <=0 ){
      alert("PLEASE FILL FORM BEFORE SUBMITTING")
    }else{
      $.ajax({
        method: "GET",
        url: 'http://localhost:3001/allemployees/',
        success: function success(succ) {
            console.log('success')
            console.log(succ)
            for(var i=0; i<succ.length;i++){
              $(".results").append("<p><a  href='/userprofile/"+succ[i]._id+"'>"+succ[i].FirstName+" "+succ[i].LastName+"</a></p><p>Postion: "+succ[i].JobTitle+"</p><br><hr>")
            }
        },
        error: function error(err){
          console.log(err)
        }
      })


      
    }




    console.log(p);
  })
  
});




//MEDIA QUERY FOR LANDING PAGE.

if (window.matchMedia("(max-width: 725px)").matches) {


} 
