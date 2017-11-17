$(function() {


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
      console.log(save)
      var data = {
        _id: id,
        boolean: save,
      }
      // console.log(data);
      $.ajax({
        url:"/article/"+id,
        type:"POST",
        data: data
      }).done(function(result){
        console.log("Saved");
        location.reload();
      });

    })
});