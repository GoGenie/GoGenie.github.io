$(document).ready(function() { init() });

/*====================================
=            ALL SECTIONS            =
====================================*/
var jobType,
    locationType,
    formData,
    salaryUnit,
    url = 'http://localhost:3000';

function gatherPostingInfo(isSecondSection) {
  formData = {
    name: $('#jobPosition').val(),
    category: $('#jobCategory').val(),
    jobType: jobType,
    description: $('#jobDescription').val(),
    address_one: $('.address-input').eq(0).val(),
    district: $('#district').val()
  };

  if (jobType === 'temporary' && isSecondSection) {
    formData.start_date = $('.datepicker-here').eq(0).val();
    formData.endDate = $('.datepicker-here').eq(1).val();
    formData.start_time = $('.time-select').eq(0).val();
    formData.end_time = $('.time-select').eq(1).val();
    formData.users_required = $('#positionsAvailable').val();
    formData.hourly_rates = $('#hourlyRateInput').val();
    formData.payment_method = $('#paymentMethod').val();
  }

  if (jobType === 'permanent' && isSecondSection) {
    formData.salary = $('#salaryInput').val();
    if ($('#salaryRange').val() !== (undefined || '')) {
      formData.salary_max = $('#salaryRange').val();
    }
    formData.salary_unit = salaryUnit;
  }

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
      console.log('this key:', key);
      retVal = false;
    }
  }

  if (formData.salary_max && formData.salary_max < formData.salary) {
    retVal = false;
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
  $('.postInfo').eq(0).text($('#jobPosition').val());
  $('.postInfo').eq(1).text($('#jobCategory').val());
  $('.postInfo').eq(2).text(jobType.toUpperCase());
  $('.postInfo').eq(3).text($('#jobDescription').val());
  $('.postInfo').eq(4).text($('.address-input').eq(0).val());
  $('.postInfo').eq(5).text($('#district').val());

  if (jobType === 'temporary') {
    $('.tempPostInfo').css('display', 'block');

    var dates = $('.datepicker-here').eq(0).val() + ' to ' + $('.datepicker-here').eq(1).val();
    var times = $('.time-select').eq(0).val() + ' to ' + $('.time-select').eq(1).val();

    $('.postInfo').eq(6).text('$'+$('#hourlyRateInput').val());
    $('.postInfo').eq(7).text($('#paymentMethod').val());
    $('.postInfo').eq(8).text($('#positionsAvailable').val());
    $('.postInfo').eq(9).text(dates);
    $('.postInfo').eq(10).text(times);
  }

  if (jobType === 'permanent') {
    $('.permPostInfo').css('display', 'block');
    $('.postInfo').eq(11).text($('#salaryInput').val());
    if (formData.salary_max) {
      $('.postInfo').eq(12).text($('#salaryRange').val());
    }
    $('.postInfo').eq(13).text(salaryUnit.toUpperCase());
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

  $startTimeSelector.timepicker({
    minTime: "9:00am"
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

function authAndPost (authInfo) {

  if (signIn) {
    axios.post(url+'/master_auth/sign_in', authInfo)
    .then(function(response) {
      postJob(response.headers)
      console.log('response', response);
    })
    .catch(function(error) {
      console.log('error signing in', error);
    })
  } else {
    // if sign up.
    axios.post(url+'/master_auth', authInfo)
    .then(function(response) {
      if (jobType === 'permanent') {
        postJob(response.headers, true)
      } else if (jobType === 'temporary') {
        postJob(response.headers, false)
      } else {
        console.log('jobType is not permanent nor temporary: ', jobType);
      }
      postJob(response.headers)
    })
    .catch(function(error) {
      console.log('error signing up', error);
    })
  }
}

function postJob (responseHeaders, isPermJob) {
  url += isPermJob ? '/master/v5/jobs' : '/master/v5/parttime_jobs';

  axios.post(url, formData)
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