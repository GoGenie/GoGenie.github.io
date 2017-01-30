
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

function locationAutocomplete () {
  var input = document.getElementById('addressInput')
  var autocomplete = new google.maps.places.Autocomplete(input);
  google.maps.event.addDomListener(window, 'load', autocomplete);
}

var locationType;
function displayAddressInput () {
  locationType = 'single';
  $('.districts').eq(0).css('display', 'none');
  $('.address-input').eq(0)
    .val('')
    .css('display', 'block')
    .attr('data-validate', 'true')
    .prop('required', true);
  $('#jobPostForm').validator('update');
  locationAutocomplete();
}

function displayDistricts () {
  locationType = 'multiple';
  $('.address-input').eq(0)
    .css('display', 'none')
    .prop('required', false)
    .attr('data-validate', 'false');
  $('.districts').eq(0)
    .css('display', 'block');
  $('#jobPostForm').validator('update');
}

var districts = {};

function toggleCheckbox (el) {
  districts[el.value] = !districts[el.value];
  $('.address-input').eq(0).val('hi');
}

var formData;

function handlePostSubmit (e) {
  e.preventDefault();
  populatePreviewCard();
  formData = gatherPostingInfo();

  if (formData) {
    console.log('there is form data.');
    return promptSignIn();
  }
  console.log('unfilled form data.');
  // postData
}

function populatePreviewCard () {
  $('.postInfoData > .postInfo').eq(0).text($('#jobPosition').val());
  $('.postInfoData > .postInfo').eq(1).text($('#jobCategory').val());
  if (jobType) {
    $('.postInfoData > .postInfo').eq(2).text(jobType.toUpperCase());
  }
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
      console.log('there is an unfilled ', key)
      return false;
    }
  }

  console.log(formData);

  return formData
}

function promptSignIn () {
  $('.post-job-btn').eq(0).attr('data-dismiss', 'modal');
  $('.post-job-btn').eq(0).attr('data-toggle', 'modal');
  $('.post-job-btn').eq(0).attr('data-target', '#signInModal');
}

var signIn = true;

function toggleAuthView (e) {

  var $modalTitle = $('h4.modal-title').eq(1),
      $toggleMessage = $('.modal-footer > a').eq(0),
      $postButton = $('#authAndPostButton'),
      $emailInput = $('#inputEmail'),
      $passwordInput = $('#inputPassword'),
      $companyInput = $('#inputCompanyName'),
      $phoneInput = $('#inputPhone');

  $emailInput.val('');
  $passwordInput.val('');
  $phoneInput.val('');
  $companyInput.val('');
  $postButton.addClass('disabled');

  if (signIn) {
    $modalTitle.text('Register and Post Job')
    $toggleMessage.text('Or sign in to post job!');
    $postButton.text('Register and post job');
    $companyInput.prop('required', true);
    $phoneInput.prop('required', true);
    signIn = false;
  } else {
    $modalTitle.text('Sign in to post');
    $toggleMessage.text('Or register to post job');
    $postButton.text('Sign in and post job');
    $companyInput.removeProp('required');
    $phoneInput.removeProp('required');
    signIn = true;
  }
}

function authAndPostHandler (e) {
  e.preventDefault();

  var authInfo = gatherAuthInfo();

  if (authInfo) {
    console.log('there is auth info')
    return authAndPost(authInfo);
  }
  console.log('no auth info.')
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
      return;
    }
  }
  return authInfo;
}

function authAndPost () {
  console.log('posted!');
  if (signIn) {

  } else {

  }
}