$(document).ready(function() { init() });

function init () {
  eventHandlers();
  initStartDatePicker();
  initStartTimePicker();
}

function eventHandlers () {
  $('.dropdown li a').off().on('click', selectJobCategoryHandler);
  $('label').eq(0).off().on('click', selectTempHandler);
  $('label').eq(1).off().on('click', selectPermHandler);
  $('label').eq(2).off().on('click', displayAddressInput);
  $('label').eq(3).off().on('click', displayDistricts);
  $('.post-job-btn').eq(0).on('click', handleSubmit);
}

function selectJobCategoryHandler (e) {
  $('.btn:first-child').text($(this).text());
  $('.btn:first-child').val($(this).text());
}

var jobType;

function selectTempHandler (e) {
  $('.date-and-times')
    .css('display', 'block');

  jobType = 'temporary';
}

function selectPermHandler (e) {
  $('.date-and-times')
    .css('display', 'none');

  jobType = 'permanent';
}

function initStartDatePicker () {
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
  console.log('meow');

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

function handleSubmit (e) {
  gatherData()
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

  for (var key in formData) {
    var unfilled = !formData[key] || (key === 'locations' && Object.keys(formData[key]).length === 0);

    if (unfilled) {
      return alertError(key, 'unfilled');
    }
  }

  console.log(formData);
}

function alertError (field, reason) {

  console.log(reason+':', field);
}