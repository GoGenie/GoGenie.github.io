$(document).ready(function() { init() });

/*====================================
=            ALL SECTIONS            =
====================================*/
var formData     = {},
    url          = 'http://api-dev.gogenieapp.com',
    venue_lat    = 0,
    venue_long   = 0,
    jobType,
    locationType,
    salaryUnit;

function combineDateTime (date, time) {
  console.log('date:', date, 'time:', time);
  console.log('moment conversion:', moment(date+' '+time, 'YYYY-MM-DD h:mmA').toDate())
  return moment(date+' '+time, 'YYYY-MM-DD h:mmA').toDate();
}

function getDuration (start, end) {
  console.log('start, end', start, end)
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
  console.log('gatherposting')
  formData = {
    description: $('#jobDescription').val(),
    district: $('#district').val(),
    venue_lat: venue_lat,
    venue_long: venue_long
  }

  var days = $('#days').val();

  if (jobType === 'temporary') {
    formData.name = $('#jobPosition').val();
    formData.category_new = $('#jobCategory').val();

    if (isSecondSection) {
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
  }

  if (jobType === 'permanent') {
    formData.position    = $('#jobPosition').val();
    formData.category    = $('#jobCategory').val();

    if (isSecondSection) {
      formData.salary      = $('#salaryInput').val();
      formData.salary_unit = salaryUnit;
      formData.address     = $('.address-input').eq(0).val();

      if ($('#salaryRange').val() !== '') {
        formData.salary_max = $('#salaryRange').val();
      }
    }
  }
  return checkInfoValidity();
}

function checkInfoValidity () {
  var retVal = formData;
  for (var key in formData) {
    var unfilled = !formData[key] || (key === 'locations' && Object.keys(formData[key]).length === 0);


    if (unfilled) {
      console.log('is unfilled.', key);
      if (key === 'category') $('#jobCategory').addClass('has-error');
      if (key === 'category_new') $('#jobCategory').addClass('has-error');
      if (key === 'district') $('#district').addClass('has-error');
      if (key === 'payment_method') $('#paymentMethod').addClass('has-error');
      retVal = false;
    }
  }

  console.log('is not unfilled,', retVal, formData)

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
  var autocomplete = new google.maps.places.Autocomplete(input, {componentRestrictions: {country: 'HK'}});
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
    promptContinue(true);
  } else {
    promptContinue(false);
  }
}

function promptContinue (proceed) {
  if (proceed) {
    $('#continueButton')
      .attr('data-dismiss', `modal`)
      .attr('data-toggle', `modal`);
  } else {
    $('#continueButton')
      .removeAttr('data-dismiss')
      .removeAttr('data-toggle');
  }
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
}


function populatePreviewCard () {
  $('.postInfo').eq(0).text($('#jobPosition').val());
  $('.postInfo').eq(1).text($('#jobCategory').val());
  $('.postInfo').eq(2).text(jobType.toUpperCase());
  $('.postInfo').eq(3).text(formData.description);
  $('.postInfo').eq(4).text($('.address-input').eq(0).val());
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
    $('.postInfo').eq(10).text($('#days').val());
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
  $('.datepicker-here').eq(0).datepicker({
    minDate: new Date(),
    language: 'ch'
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
  salaryUnit = '月薪';
}
function selectWeeklyHandler (e) {
  salaryUnit = '週薪';
}
function selectDailyHandler (e) {
  salaryUnit = '日薪';
}
function selectHourlyHandler (e) {
  salaryUnit = '時薪';
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
    $modalTitle.text('請注冊帳戶完成刊登工作')
    $toggleMessage.text('已有帳戶? 按此登入');
    $postButton.text('完成刊登工作');
    $companyInput.prop('required', true);
    $phoneInput.prop('required', true);
    signIn = false;
  } else {
    $modalTitle.text('請登入帳戶完成刊登工作');
    $toggleMessage.text('未有帳戶? 建立新帳戶');
    $postButton.text('完成刊登工作');
    $companyInput.prop('required', false);
    $phoneInput.prop('required', false);
    signIn = true;
  }
}

function authAndPostHandler (e) {
  e.preventDefault();

  var authInfo = gatherAuthInfo();

  if (authInfo) {
    return authenticate(authInfo);
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
      return;
    }
  }
  return authInfo;
}

function authenticate (authInfo) {
  postUrl = url + (signIn ? '/master_auth/sign_in' : '/master_auth');

  axios.post(postUrl, authInfo)
  .then(function(response) {
    if (jobType === 'permanent') return postJob(response, true)
    if (jobType === 'temporary') return postJob(response, false)
  })
  .catch(function(error) {
    var code = error.toString().slice(-3)
    return handleError(code, authInfo)
  })
}

function handleError (code, authInfo) {
  if (code === '403') {
    $('.email-help').eq(0)
      .css('color', '#a94442')
      .text('That e-mail exists. Please try again.')
  }
}

function postJob (response, isPermJob) {
  postUrl = url + (isPermJob ? '/master/v5/parttime_jobs' : '/master/v5/jobs');

  axios.post(postUrl, formData, {
    headers: response.headers
  }).then(function(response) {
    promptAfterPost(response)
  }).catch(function(error) {
  })
}

function promptAfterPost (response) {

  clearAllFields();

  $('#signInModal').modal('toggle');
  $('#afterPostModal').modal('toggle');
}

function clearAllFields () {
  // clear all the fields
}


/*==========================================
=            AFTER POST SECTION            =
==========================================*/





 /*============================
 =            INIT            =
 ============================*/
function firstEvents () {
  $('[data-toggle="tooltip"]').tooltip();
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