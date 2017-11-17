$("#scrape").on("click",function(){
  
  $.get("/scrape",function(data){
    console.log("test");
    console.log(data.length);


  })
})

$('#myModal').on('shown.bs.modal', function () {
  $('#myInput').focus()
})

$(".save").on("click", function() {

  var id = $(this).attr("id");
  var save = $(this).attr("value");

  var data = {
    _id: id,
    boolean: save,
  }


  $.ajax("/articles/" + id, {
    type:"PUT",
    data: data
  }).done(function(result){
    console.log("Saved");
    location.reload();
  })

})