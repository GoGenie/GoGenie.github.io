
$(document).ready(function() { init() });

function init () {
  eventHandlers();
  initStartTimePicker();
}

function eventHandlers () {
  $('.dropdown li a').off().on('click', selectJobCategoryHandler);
  $('label.radio-inline').eq(0).off().on('click', selectTempHandler);
  $('label.radio-inline').eq(1).off().on('click', selectPermHandler);
  $('label.radio-inline').eq(2).off().on('click', displayAddressInput);
  $('label.radio-inline').eq(3).off().on('click', displayDistricts);
  $('.post-job-btn').eq(0).on('click', handlePostSubmit);
  $('.modal-footer > a').eq(0).off().on('click', toggleAuthView);
  $('#authAndPostButton').off().on('click', authAndPostHandler)
}

function selectJobCategoryHandler (e) {
  $('#jobCategory').text($(this).text());
  $('#jobCategory').val($(this).text());
}

var jobType;

function selectTempHandler (e) {
  $('.date-and-times')
    .css('display', 'block');

  initStartDatePicker();
  jobType = 'temporary';
}

function selectPermHandler (e) {
  $('.date-and-times')
    .css('display', 'none');

  jobType = 'permanent';
}

function initStartDatePicker () {
  console.log('initialize date picker')
  $('.datepicker-here').eq(0).datepicker({
    minDate: new Date(),
    language: 'en',
    onSelect: function(fd, date) {
      initEndDatePicker(date);
    }
  })
}

function initEndDatePicker (startDate) {
  $('.datepicker-here').eq(1).prop('disabled', false);

  $('.datepicker-here').eq(1).datepicker({
    minDate: startDate,
    language: 'en'
  })
}

function initStartTimePicker () {
  var $startTimeSelector = $('.time-select').eq(0);

  $startTimeSelector.timepicker();
  $startTimeSelector.on('changeTime', function() {
    enableEndTimePicker($(this).val())
  })
}

function enableEndTimePicker (minTime) {
  var $endTimeSelector = $('.time-select').eq(1);

  $endTimeSelector.timepicker({
    minTime: minTime
  });
  $endTimeSelector.prop('disabled', false);
}

var locationType;
function displayAddressInput () {
  locationType = 'single';
  $('.districts').eq(0)
    .css('display', 'none');
  $('.address-input').eq(0)
    .css('display', 'block');
}

function displayDistricts () {
  locationType = 'multiple';
  $('.address-input').eq(0)
    .css('display', 'none');
  $('.districts').eq(0)
    .css('display', 'block');
}

var districts = {};

function toggleCheckbox (el) {
  districts[el.value] = !districts[el.value];
}

var formData;

function handlePostSubmit (e) {
  populatePreviewCard();
  formData = gatherPostingInfo();

  if (formData) {
    promptSignIn();
  }
  // postData
}

function populatePreviewCard () {
  $('.postInfoData > .postInfo').eq(0).text($('#jobPosition').val());
  $('.postInfoData > .postInfo').eq(1).text($('#jobCategory').val());
  $('.postInfoData > .postInfo').eq(2).text(jobType.toUpperCase());
  $('.postInfoData > .postInfo').eq(5).text($('#jobDescription').val());

  if (jobType === 'temporary') {
    $('.tempPostInfo').css('display', 'block');
    var dates = $('.datepicker-here').eq(0).val() + ' to ' + $('.datepicker-here').eq(1).val();
    var times = $('.time-select').eq(0).val() + ' to ' + $('.time-select').eq(1).val();

    $('.postInfoData > .postInfo').eq(3).text(dates);
    $('.postInfoData > .postInfo').eq(4).text(times);
  }

  if (locationType === 'multiple') {
    var textVal = ''
    for (var key in districts) textVal += key+' ';
    $('.postInfoData > .postInfo').eq(6).text(textVal);
  } else {
    $('.postInfoData > .postInfo').eq(6).text($('.address-input').eq(0).val());
  }

}

function gatherPostingInfo() {
  formData = {
    jobPosition: $('#jobPosition').val(),
    jobCategory: $('#jobCategory').val(),
    jobType: jobType,
    jobDescription: $('#jobDescription').val(),
    locationType: locationType
  };

  if (jobType === 'temporary') {
    formData.startDate = $('.datepicker-here').eq(0).val();
    formData.endDate = $('.datepicker-here').eq(1).val();
    formData.startTime = $('.time-select').eq(0).val();
    formData.endTime = $('.time-select').eq(1).val();
  }

  if (locationType === 'multiple') {
    formData.locations = districts;
  } else {
    formData.location = $('.address-input').eq(0).val();
  }

  // CHECK IF FORM HAS ERRORS
  for (var key in formData) {
    var unfilled = !formData[key] || (key === 'locations' && Object.keys(formData[key]).length === 0);

    if (unfilled) {
      return alertError(key, 'unfilled');
    }
  }

  console.log(formData);

  return formData
}

function alertError (field, reason) {
  console.log(reason+':', field);
  return false;
}

function promptSignIn () {
  // $('.form-card-2').eq(0).css('display', 'block');

  // close current modal and open new Sign In Modal without losing formData.


  // transition the modal to the left while the new sign in modal can transition in from the right
}

var signIn = true;

function toggleAuthView (e) {

  var $modalTitle = $('h4.modal-title').eq(1),
      $toggleMessage = $('.modal-footer > a').eq(0),
      $postButton = $('#authAndPostButton');

  if (signIn) {
    $modalTitle.text('Register and Post Job')
    $toggleMessage.text('Or sign in to post job!');
    $postButton.text('Register and post job')
    signIn = false;
  } else {
    $modalTitle.text('Sign in to post')
    $toggleMessage.text('Or register to post job')
    $postButton.text('Sign in and post job')
    signIn = true;
  }
}

function authAndPostHandler (e) {
  var authInfo = gatherAuthInfo();

  if (authInfo) {
    authAndPost(authInfo);
  }
}

function gatherAuthInfo () {
  var authInfo = {
    email: $('#inputEmail').val(),
    password: $('#inputPassword').val()
  }

  if (!signIn) {
    authInfo.phone = $('#inputPhone').val();
    authInfo.company = $('#inputCompanyName').val();
  }

  for (var key in authInfo) {
    var unfilled = !authInfo[key];

    if (unfilled) {
      return alertError(key, 'unfilled');
    }
  }
}

function authAndPost () {
  if (signIn) {

  } else {

  }
}