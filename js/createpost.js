$(document).ready(function() { init() });

/*====================================
=            ALL SECTIONS            =
====================================*/
var formData     = {},
    url          = 'http://localhost:3000',
    venue_lat    = 0,
    venue_long   = 0,
    jobType,
    locationType,
    salaryUnit;

function combineDateTime (date, time) {
  return moment(date+' '+time, 'MM/DD/YYYY h:mmA').toDate();
}

function getDuration (start, end) {
  var timeDiff = Math.abs(start - end);
  return Math.ceil(timeDiff / (1000 * 60));
}

function getRate (duration, hourly, days) {
  return (Math.ceil(duration / 60) * hourly).toFixed(0) * Number(days);
}

function addDays (date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function gatherPostingInfo(isSecondSection) {
  formData = {
    category: $('#jobCategory').val(),
    description: $('#jobDescription').val(),
    district: $('#district').val(),
    venue_lat: venue_lat,
    venue_long: venue_long
  }

  var days = $('.date-and-times .inline').eq(1).val();

  if (jobType === 'temporary' && isSecondSection) {
    formData.name           = $('#jobPosition').val();
    formData.address_one    = $('.address-input').eq(0).val();
    formData.start_date     = $('.datepicker-here').eq(0).val();
    formData.start_time     = combineDateTime(formData.start_date, $('.time-select').eq(0).val());
    formData.end_time       = combineDateTime(formData.start_date, $('.time-select').eq(1).val());
    formData.users_required = $('#positionsAvailable').val();
    formData.hourly_rates   = $('#hourlyRateInput').val();
    formData.payment_method = $('#paymentMethod').val();
    formData.duration       = getDuration(formData.start_time, formData.end_time);
    formData.rate           = getRate(formData.duration, formData.hourly_rates, days);
    formData.real_end_time  = addDays(formData.end_time, Number(days) - 1);
  }

  if (jobType === 'permanent' && isSecondSection) {
    formData.position    = $('#jobPosition').val();
    formData.salary      = $('#salaryInput').val();
    formData.salary_unit = salaryUnit;
    formData.address     = $('.address-input').eq(0).val();

    if ($('#salaryRange').val() !== undefined || $('#salaryRange').val() !== '') {
      formData.salary_max = $('#salaryRange').val();
    }
  }
  console.log('this is the form data!', formData);

  return checkInfoValidity();
}

function checkInfoValidity () {
  var retVal = formData;
  for (var key in formData) {
    var unfilled = !formData[key] || (key === 'locations' && Object.keys(formData[key]).length === 0);

    if (unfilled) {
      if (key === 'category') $('#jobCategory').addClass('has-error');
      if (key === 'district') $('#district').addClass('has-error');
      if (key === 'payment_method') $('#paymentMethod').addClass('has-error');
      retVal = false;
    }
  }

  return retVal;
}

/*=====================================
=            FIRST SECTION            =
=====================================*/

function selectJobCategoryHandler (e) {
  $('#jobCategory').text($(this).text());
  $('#jobCategory').val($(this).text());
  $('#jobCategory').removeClass('has-error');
}

function locationAutocomplete () {
  var input = document.getElementById('addressInput')
  var autocomplete = new google.maps.places.Autocomplete(input);
  google.maps.event.addDomListener(window, 'load', autocomplete);
  google.maps.event.addDomListener(autocomplete, 'place_changed', saveLocation.bind(this, autocomplete));
}

function saveLocation (autocomplete) {
  var place = autocomplete.getPlace();
  venue_lat = place.geometry.location.lat();
  venue_long = place.geometry.location.lng();
}

function selectDistrictHandler (e) {
  $('#district').text($(this).text());
  $('#district').val($(this).text());
  $('#district').removeClass('has-error');
}

function selectTempHandler (e) {
  jobType = 'temporary';
  $('#continueButton').eq(0).attr('data-target', `#temporaryJobModal`)
}

function selectPermHandler (e) {
  jobType = 'permanent';
  $('#continueButton').eq(0).attr('data-target', `#permanentJobModal`)
}

function continueHandler (e) {
  e.preventDefault();
  if (gatherPostingInfo(false)) {
    promptContinue();
  }
}
function promptContinue () {
  $('#continueButton').eq(0)
    .attr('data-dismiss', `modal`)
    .attr('data-toggle', `modal`)

}

 /*===================================================
 =            BOTH TEMP AND PERM SECTIONS            =
 ===================================================*/

function previewJobHandler (e) {
  e.preventDefault()

  if (gatherPostingInfo(true)) {
    populatePreviewCard();
    var num = jobType === 'temporary' ? 0 : 1;
    return promptSignIn(num);
  }
  console.log('unfilled form data.');
}


function populatePreviewCard () {
  $('.postInfo').eq(0).text(formData.name);
  $('.postInfo').eq(1).text(formData.category);
  $('.postInfo').eq(2).text(jobType.toUpperCase());
  $('.postInfo').eq(3).text(formData.description);
  $('.postInfo').eq(4).text(formData.address_one);
  $('.postInfo').eq(5).text(formData.district);

  if (jobType === 'temporary') {
    $('.tempPostInfo').css('display', 'block');
    $('.permPostInfo').css('display', 'none');

    var dates = formData.start_date + ' to ' + $('.datepicker-here').eq(1).val();
    var times = $('.time-select').eq(0).val() + ' to ' + $('.time-select').eq(1).val();

    $('.postInfo').eq(6).text('$'+formData.hourly_rates);
    $('.postInfo').eq(7).text(formData.payment_method);
    $('.postInfo').eq(8).text(formData.users_required);
    $('.postInfo').eq(9).text(formData.start_date);
    $('.postInfo').eq(10).text($('.date-and-times .inline').eq(1).val());
    $('.postInfo').eq(11).text(times);
  }

  if (jobType === 'permanent') {
    $('.permPostInfo').css('display', 'block');
    $('.tempPostInfo').css('display', 'none');
    $('.postInfo').eq(12).text(formData.salary);
    if (formData.salary_max) {
      $('.postInfo').eq(13).text(formData.salary_max);
    }
    $('.postInfo').eq(14).text(salaryUnit.toUpperCase());
  }
}

function promptSignIn (num) {
  $('.preview-job-btn').eq(num).attr('data-dismiss', 'modal');
  $('.preview-job-btn').eq(num).attr('data-toggle', 'modal');
  $('.preview-job-btn').eq(num).attr('data-target', '#signInModal');

}

 /*========================================
 =            TEMP JOB SECTION            =
 ========================================*/
function selectPaymentHandler (e) {
  $('#paymentMethod').text($(this).text());
  $('#paymentMethod').val($(this).text());
  $('#paymentMethod').removeClass('has-error');
}

function initStartDatePicker () {
  console.log('initialize date picker')
  $('.datepicker-here').eq(0).datepicker({
    minDate: new Date(),
    language: 'en'
  })
}

function initStartTimePicker () {
  var $startTimeSelector = $('.time-select').eq(0);

  $startTimeSelector.timepicker({
    minTime: '9:00am'
  });

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

/*========================================
=            PERM JOB SECTION            =
========================================*/
function selectMonthlyHandler (e) {
  salaryUnit = 'Monthly';
}
function selectWeeklyHandler (e) {
  salaryUnit = 'Weekly';
}
function selectDailyHandler (e) {
  salaryUnit = 'Daily';
}
function selectHourlyHandler (e) {
  salaryUnit = 'Hourly';
}

 /*====================================
 =            AUTH SECTION            =
 ====================================*/
var signIn = true;

function toggleAuthView (e) {

  var $modalTitle    = $('h4.modal-title').eq(3),
      $toggleMessage = $('.modal-footer > a').eq(0),
      $postButton    = $('#authAndPostButton'),
      $emailInput    = $('#inputEmail'),
      $passwordInput = $('#inputPassword'),
      $companyInput  = $('#inputCompanyName'),
      $phoneInput    = $('#inputPhone');

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
    $companyInput.prop('required', false);
    $phoneInput.prop('required', false);
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

function authAndPost (authInfo) {

  postUrl = url + (signIn ? '/master_auth/sign_in' : 'master_auth');

  axios.post(postUrl, authInfo)
  .then(function(response) {
    if (jobType === 'permanent') postJob(response, true)
    if (jobType === 'temporary') postJob(response, false)
  })
  .catch(function(error) {
    console.log((signIn ? 'error signing in' : 'error signing up'));
  })
}

function postJob (response, isPermJob) {
  postUrl = url + (isPermJob ? '/master/v5/parttime_jobs' : '/master/v5/jobs');

  axios.post(postUrl, formData, {
    headers: response.headers
  })
  .then(function(response) {
    console.log('success posting.', response);
  })
  .catch(function(error) {
    console.log('error posting.', error)
  })
}

 /*============================
 =            INIT            =
 ============================*/
function firstEvents () {
  $('.jobCategoryDropdown li a').off().on('click', selectJobCategoryHandler);
  $('.districtsDropdown li a').off().on('click', selectDistrictHandler);
  $('label.radio-inline').eq(0).off().on('click', selectTempHandler);
  $('label.radio-inline').eq(1).off().on('click', selectPermHandler);
}

function tempEvents () {
  $('.paymentMethodDropdown li a').off().on('click', selectPaymentHandler);
  initStartDatePicker();
  initStartTimePicker();
}

function permEvents() {
  $('label.radio-inline').eq(2).off().on('click', selectMonthlyHandler);
  $('label.radio-inline').eq(3).off().on('click', selectWeeklyHandler);
  $('label.radio-inline').eq(4).off().on('click', selectDailyHandler);
  $('label.radio-inline').eq(5).off().on('click', selectHourlyHandler);
}

function authEvents() {
  $('.modal-footer > a').eq(0).off().on('click', toggleAuthView);
}

function btnEvents() {
  $('.btn-wide').off().on('click', function(e){ e.preventDefault(); })
  $('#continueButton').off().on('click', continueHandler);
  $('.preview-job-btn').off().on('click', previewJobHandler);
  $('#authAndPostButton').off().on('click', authAndPostHandler);
}

function eventHandlers () {
  firstEvents();
  tempEvents();
  permEvents();
  authEvents();
  btnEvents();
}

function init () {
  eventHandlers();
  locationAutocomplete();
}