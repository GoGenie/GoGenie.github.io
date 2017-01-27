
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
}

function selectJobCategoryHandler (e) {
  $('.btn:first-child').text($(this).text());
  $('.btn:first-child').val($(this).text());
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
  formData = gatherData();

  if (formData) {
    promptSignIn();
  }
  // postData
}

function gatherData() {
  var formData = {
    jobPosition: $('#jobPosition').val(),
    jobCategory: $('.btn:first-child').val(),
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
  $('.form-card-2').eq(0).css('display', 'block');
}