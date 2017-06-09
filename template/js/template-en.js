window.jQuery || document.write('<script src="/template/js/jquery.min.js"><\/script>')

$("#share").jsSocials({
  shares: [ "linkedin", "facebook", "twitter", "googleplus"],
  url: "http://gogenieapp.com/free-excel-template-for-employee-scheduling-en.html",
    text: "Free Excel Template for Employee Scheduling",
    showLabel: false,
    showCount: true,
    showCount: "inside",
    shareIn: "popup",
    on: {
      click: function(e) {},
      mouseenter: function(e) {},
      mouseleave: function(e) {}
    }
});

var testEmail = function(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
};

var checkValidation = function(data) {
  console.log(data);
  var validEmail = testEmail(data.email);
  var validName = data.name != "";
  var validEmployees = data.employees > 0;
  if (!validEmail) {
    $("#email-container").addClass("validation-error");
    $("#email-container .error-icon").removeClass("hide-icon");
  } else {
    $("#email-container").removeClass("validation-error");
    $("#email-container .error-icon").addClass("hide-icon");
  };
  if (!validName) {
    $("#name-container").addClass("validation-error");
    $("#name-container .error-icon").removeClass("hide-icon");
  } else {
    $("#name-container").removeClass("validation-error");
    $("#name-container .error-icon").addClass("hide-icon");
  };
  if (!validEmployees) {
    $("#employees-container").addClass("validation-error");
    $("#employees-container .error-icon").removeClass("hide-icon");
  } else {
    $("#employees-container").removeClass("validation-error");
    $("#employees-container .error-icon").addClass("hide-icon");
  };
  return validEmail && validName && validEmployees;
};

$( "#submit" ).click(function(e) {
  e.stopPropagation();
  e.preventDefault();
  var data = {
    data: {
      email: $('#email').val(),
      name: $('#name').val(),
      employees: $('#employees').val()
    }
  };
  if (checkValidation(data.data)) {
    // var url = "http://localhost:3000/template_download";
    var url = "http://gogenie-mailer.herokuapp.com/template_download_en";
    $.post(url, data, function(data, status){
      console.log("Data: " + data + "\nStatus: " + status);
      console.log(data);
    });
    setTimeout(function(){ $('#myModal').modal('toggle'); }, 500);
    setTimeout(function(){ window.location.href = "/free-excel-template-for-employee-scheduling-sent-en.html"; }, 1000);
  };
});
