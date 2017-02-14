$(document).ready(function() { init() });

/*====================================
=            ALL SECTIONS            =
====================================*/
var formData     = {},
    // url          = 'http://localhost:3000',
    url          = 'http://api.gogenieapp.com',
    tinymceKey   = 'ikxy33vsl4armlnjjzymija5mimki9cl8tcx6rx1n9cjduef',
    venue_lat    = 0,
    venue_long   = 0,
    jobType,
    locationType,
    salaryUnit;

function combineDateTime (date, time) {
  return moment(date+' '+time, 'YYYY-MM-DD h:mma').toDate();
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

  /*----------  First Section  ----------*/

  formData = {
    // description: $('#jobDescription').val(),
    description: tinymce.activeEditor.getContent(),
    district: $('#district').val(),
    venue_lat: venue_lat,
    venue_long: venue_long
  }

  /*----------  Temp Section  ----------*/

  var days = $('#days').val();

  if (jobType === 'temporary') {
    formData.name = $('#jobPosition').val();
    formData.category_new = $('#jobCategory').val();

    if (isSecondSection) {
      formData.address_one    = $('.address-input').eq(0).val();
      formData.start_date     = $('.datepicker-here').eq(0).val();
      formData.start_time     = combineDateTime(formData.start_date, $('.time-select').eq(0).val());
      formData.end_time       = combineDateTime(formData.start_date, $('.time-select').eq(1).val());
      // Makes sure the end date is the next day for over-night jobs
      if (formData.end_time && formData.end_time - formData.start_time < 0)
        formData.end_time = addDays(formData.end_time, 1);

      formData.users_required = $('#positionsAvailable').val();
      formData.hourly_rates   = $('#hourlyRateInput').val();
      formData.payment_method = $('#paymentMethod').val();
      formData.duration       = getDuration(formData.start_time, formData.end_time);
      formData.rate           = getRate(formData.duration, formData.hourly_rates, days);
      formData.real_end_time  = addDays(formData.end_time, Number(days) - 1);
    }
  }

  /*----------  Perm Section  ----------*/

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
  /*----------  All Sections  ----------*/

  return checkInfoValidity(isSecondSection, jobType === 'temporary');
}

function checkInfoValidity (isSecondSection, isTemp) {
  var retVal = formData;
  for (var key in formData) {
    var unfilled = !formData[key] || (key === 'locations' && Object.keys(formData[key]).length === 0);

    if (unfilled) {
      console.log('is unfilled.', key);
      if (key === 'category') $('#jobCategory').addClass('has-error');
      if (key === 'category_new') $('#jobCategory').addClass('has-error');
      if (key === 'district') $('#district').addClass('has-error');
      if (key === 'description') {
        $('.jobtype-help').eq(0).css('color', '#a94442').text('請填寫工作描述');
      }
      if (key === 'payment_method') $('#paymentMethod').addClass('has-error');
      if (key === 'rate') $('#paymentMethod').addClass('has-error');
      retVal = false;
    }
  }

  if (isSecondSection) {
    if (isTemp) {
      if (!$('.time-select').eq(0).val() || !$('.time-select').eq(1).val() || $('.time-select').eq(0).val() === $('.time-select').eq(1).val()){
        retVal = false;
        $('.time-select-error').eq(0)
          .css('color', '#a94442')
          .text('工作時間必須至少一小時');
      }
      if (!$('#days').val() || $('#days').val() < 1) {
        retVal = false;
        $('.start-date-error').eq(0)
          .css('color', '#a94442')
          .text('工作日數必須至少有1天');
      }
      if ($('#positionsAvailable').val() < 1) {
        retVal = false;
        $('.positions-available-error').eq(0)
          .css('color', '#a94442')
          .text('工作人數必須至少有1個');
      }
      if ($('#hourlyRateInput').val() < 33) {
        retVal = false;
        $('.hourly-rate-error').eq(0)
          .css('color', '#a94442')
          .text('工作時薪必須$33或以上');
      }
      if (!$('.datepicker-here').val()) {
        retVal = false;
        $('.start-date-error').eq(0)
          .css('color', '#a94442')
          .text('請選擇開始時間');
      }
    } else {
      if (formData.salary_max && $('#salaryRange').val() < $('#salaryInput').val()) {
        retVal = false;
        $('.salary-range-error').eq(0)
          .css('color', '#a94442')
          .text('薪金範圍必須大過工作薪金');
      }
    }
  }

  return retVal;
}

function clearValidationFields () {
  $('.jobtype-help').eq(0).text('')
  $('.time-select-error').eq(0).text('')
  $('.positions-available-error').eq(0).text('')
  $('.start-date-error').eq(0).text('')
  $('.hourly-rate-error').eq(0).text('')
  $('.email-help').eq(0).text('')
  $('.salary-range-error').eq(0).text('')

  $('#jobCategory').removeClass('has-error');
  $('#jobCategory').removeClass('has-error');
  $('#district').removeClass('has-error');
  $('#paymentMethod').removeClass('has-error');
}

/*=====================================
=            FIRST SECTION            =
=====================================*/

function selectJobCategoryHandler (e) {
  $('#jobCategory').text($(this).text());
  $('#jobCategory').val($(this).text());
  $('#jobCategory').removeClass('has-error');
}

function jobDescriptionFormatter () {
  tinymce.init({
    selector: '#jobDescription',
    menubar: false,
    toolbar: 'bold italic | alignleft aligncenter alignright alignjustify | bullist numlist',
    statusbar: false,
    plugins: 'placeholder lists'
  });
}

function locationAutocomplete () {
  var input = document.getElementById('addressInput')
  var autocomplete = new google.maps.places.Autocomplete(input, {componentRestrictions: {country: 'HK'}});
  google.maps.event.addDomListener(window, 'load', autocomplete);
  google.maps.event.addDomListener(autocomplete, 'place_changed', saveLocation.bind(this, autocomplete, input));
}

function saveLocation (autocomplete, input) {
  var place = autocomplete.getPlace();
  venue_lat = place.geometry.location.lat();
  venue_long = place.geometry.location.lng();

  $('.location-help').eq(0)
    .css('color', '#a94442')
    .text('')
}

function selectDistrictHandler (e) {
  $('#district').text($(this).text());
  $('#district').val($(this).text());
  $('#district').removeClass('has-error');
}

function selectTempHandler (e) {
  jobType = 'temporary';
}

function selectPermHandler (e) {
  jobType = 'permanent';
}

function continueHandler (e) {
  e.preventDefault();
  clearValidationFields();
  if (gatherPostingInfo(false) && venue_lat !== 0 && venue_long !== 0 && jobType) {
    $('#createJobModal').modal('hide')
    if (jobType === 'temporary') $('#temporaryJobModal').modal('show')
    if (jobType === 'permanent') $('#permanentJobModal').modal('show')
  } else if (venue_lat === 0 && venue_long === 0){
    $('.location-help').eq(0)
      .css('color', '#a94442')
      .text('請從列表內選擇一個地址')
  } else if (!jobType) {
    $('.jobtype-help').eq(0)
      .css('color', '#a94442')
      .text('請選擇臨時工作或固定工作');
  }
}

 /*===================================================
 =            BOTH TEMP AND PERM SECTIONS            =
 ===================================================*/

function previewJobHandler (e) {
  e.preventDefault()
  clearValidationFields();

  if (gatherPostingInfo(true)) {
    populatePreviewCard();
    return promptSignIn(jobType === 'temporary');
  }
}


function populatePreviewCard () {
  $('.postInfo').eq(0).text($('#jobPosition').val());
  $('.postInfo').eq(1).text($('#jobCategory').val());
  $('.postInfo').eq(2).text(jobType.toUpperCase());
  $('.postInfo').eq(3).text($('.address-input').eq(0).val());
  $('.postInfo').eq(4).text(formData.district);

  if (jobType === 'temporary') {
    $('.tempPostInfo').css('display', 'block');
    $('.permPostInfo').css('display', 'none');

    var dates = formData.start_date + ' to ' + $('.datepicker-here').eq(1).val();
    var times = $('.time-select').eq(0).val() + ' to ' + $('.time-select').eq(1).val();

    $('.postInfo').eq(5).text('$'+formData.hourly_rates);
    $('.postInfo').eq(6).text($('#paymentMethod').val());
    $('.postInfo').eq(7).text(formData.users_required);
    $('.postInfo').eq(8).text(formData.start_date);
    $('.postInfo').eq(9).text($('#days').val());
    $('.postInfo').eq(10).text(times);
  }

  if (jobType === 'permanent') {
    $('.permPostInfo').css('display', 'block');
    $('.tempPostInfo').css('display', 'none');
    $('.postInfo').eq(11).text(formData.salary);
    if (formData.salary_max) {
      $('.postInfo').eq(12).text(formData.salary_max);
    }
    $('.postInfo').eq(13).text(salaryUnit.toUpperCase());
  }
  $('.postInfo').eq(14).html(tinymce.activeEditor.getContent());
}

function promptSignIn (tempSelected) {
  if (tempSelected) $('#temporaryJobModal').modal('hide');
  if (!tempSelected) $('#permanentJobModal').modal('hide');
  $('#signInModal').modal('show');
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
    var minEndTime = moment($(this).val(), 'h:mma').add(1, 'hours').format('h:mma');
    enableEndTimePicker(minEndTime);
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
  clearValidationFields();

  if (signIn) {
    $modalTitle.text('請注冊帳戶完成刊登工作')
    $toggleMessage.text('已有帳戶? 按此登入');
    $postButton.text('完成刊登工作');
    $("#registrationDetails").collapse('show')
    $companyInput.prop('required', true);
    $phoneInput.prop('required', true);
    signIn = false;
  } else {
    $modalTitle.text('請登入帳戶完成刊登工作');
    $toggleMessage.text('未有帳戶? 建立新帳戶');
    $postButton.text('完成刊登工作');
    $("#registrationDetails").collapse('hide')
    $companyInput.prop('required', false);
    $phoneInput.prop('required', false);
    signIn = true;
  }
}

function authAndPostClickHandler (e) {
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
    if (key === 'phone' && !($('#inputPhone').val()*1)) {
      unfilled = true;
      $('.phone-error').eq(0)
        .css('color', '#a94442')
        .text('請輸入有效的8位數香港電話號碼')
    }

    if (unfilled) {
      return;
    }
  }
  return authInfo;
}

function authenticate (authInfo) {

  $('#signInModal').modal('hide');
  $('#submittedModal').modal('show');

  var postUrl = url + (signIn ? '/master_auth/sign_in' : '/master_auth');

  axios.post(postUrl, authInfo)
  .then(function(response) {
    if (!signIn) {
      putBasicInfo(response, authInfo, function() {
        if (jobType === 'permanent') return postJob(response, true);
        if (jobType === 'temporary') return postJob(response, false);
      })
    } else {
      if (jobType === 'permanent') return postJob(response, true);
      if (jobType === 'temporary') return postJob(response, false);
    }
  })
  .catch(function(error) {
    var code = error.toString().slice(-3)
    return handleError(code, authInfo)
  })
}

function putBasicInfo (response, authInfo, callback) {
  var putUrl = url + '/master/v5/profile_infos/info',
      data   = {
        basic_info: {
          name: authInfo.name,
          phone: authInfo.phone,
          contact: '',
          website_url: '',
          bio: ''
        }
      };

  axios.put(putUrl, data, {
    headers: response.headers
  }).then(function(response) {
    callback();
  }).catch(function(error) {
    console.log('there was an error in putBasicInfo', error);
  })
}

function handleError (code, authInfo) {
  setTimeout(function(){
    $('#submittedModal').modal('hide');
    $('#signInModal').modal('show');
  }, 900)

  if (code === '403') {
    $('.email-help').eq(0)
      .css('color', '#a94442')
      .text('請填寫其他的電郵。')
  }
  if (code === '401') {
    $('.email-help').eq(0)
      .css('color', '#a94442')
      .text('你的電子郵件和密碼不正確。 請再試一次。')
  }
  if (code === 'postJob') {
    console.log('sign in/up successful but there was an error trying to post job..', err);
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
  $('#firstSecForm').validator('update');
  signIn = false;
  toggleAuthView();
  $('#instruction-carousel').carousel(0);
  $('#submittedModal').modal('hide');
  $('#signInModal').modal('hide');
  $('#afterPostModal').modal('show');
}

function clearAllFields () {
  // clear all the fields
  $('#jobPosition').val('');
  $('#jobCategory').text('請選擇工作類別').val('');
  $('.address-input').eq(0).val('');
  $('#district').text('請選擇地區').val('');
  tinymce.activeEditor.setContent('');
  // $('#jobDescription').val('');
  $('#positionsAvailable').val('');
  $('#hourlyRateInput').val('');
  $('#paymentMethod').text('請選擇出糧方式').val('');
  $('.datepicker-here').eq(0).val('');
  $('#days').val('');
  $('.time-select').eq(0).val('');
  $('.time-select').eq(1).val('');
  $('#salaryInput').val('');
  $('#salaryRange').val('');

  $('#inputEmail').val('');
  $('#inputPassword').val('');
  $('#inputCompanyName').val('');
  $('#inputPhone').val('');

  // clears all radio inputs
  $('.radio-inline > input').prop('checked', false);
}

function closeSubmittedModal () {
  $('#submittedModal').modal('hide');
  $('#signInModal').modal('show');
}

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
  $('#authAndPostButton').off().on('click', authAndPostClickHandler);
  $('#okayButton').off().on('click', closeSubmittedModal);
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
  jobDescriptionFormatter();
}