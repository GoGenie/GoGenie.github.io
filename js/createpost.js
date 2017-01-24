$(document).ready(function() {

  $('.dropdown li a').click(function(e){
    e.preventDefault();
    $('.btn:first-child').text($(this).text());
    $('.btn:first-child').val($(this).text());
  })


  function init () {

  }

  init();
})