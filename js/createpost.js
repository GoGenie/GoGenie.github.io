$(document).ready(function() { init() });

function init () {
  eventHandlers();
  initDatePicker();
}

function eventHandlers () {
  $('.dropdown li a').off().on('click', selectJobCategoryHandler);
  $('label').eq(0).off().on('click', selectTempHandler);
  $('label').eq(1).off().on('click', selectPermHandler);
}

function selectJobCategoryHandler (e) {
  $('.btn:first-child').text($(this).text());
  $('.btn:first-child').val($(this).text());
}

function selectTempHandler (e) {
  $('.date-and-times')
    .css('visibility', 'visible')
    .css('max-height', '1000px')
    .css('margin-bottom', '15px');
}

function selectPermHandler (e) {
  $('.date-and-times')
    .css('visibility', 'hidden')
    .css('max-height', '0px')
    .css('margin-bottom', '0px');
}

function initDatePicker () {
  $('.datepicker-here').eq(0).datepicker({
    minDate: new Date(),
    language: 'en'
  })
}