$(document).ready(function() {

/*=================================
=            API Calls            =
=================================*/

  var url = 'http://localhost:3000'
  // var url = 'http://api.gogenieapp.com'

  function getCompanyProfile(callback) {
    var getUrl = url + '/master/v5/profile_infos/current_info'
    var data = { headers: responseHeaders }

    axios.get(getUrl, data)
    .then(function(response) {
      var currentInfo = response.data.master
      responseHeaders = response.headers
      callback(currentInfo)
    })
    .catch(function(error) {
      console.error('there was an error!', error)
    })
  }

  function putCompanyProfile() {
    var authUrl = url + '/'
        putUrl  = url + '/master/v5/profile_infos/info',
          data  = {
            basic_info: {
              name: $('#editCompanyName').val(),
              contact: $('#editCompanyContact').val(),
              phone: $('#editCompanyPhone').val(),
              website_url: $('#editCompanyWebsite').val(),
              bio: $('#editCompanyDescription').val(),
            }
          }

    axios.put(putUrl, data, { headers: responseHeaders })
    .then(function(response) {
      renderUpdateValidationModal(response.data.master)
    }).catch(function(error) {
      console.error('there was an error in putCompanyProfile', error);
    })
  }

  function putCompanyImage() {
    var putUrl = url + '/master/v5/profile_infos/upload_image'

  }

/*======================================
=            Modal Handlers            =
======================================*/
  function promptUpdateValidationModal() {
    $('#loadProfileModal').modal('hide')
    $('#updateValidationModal').modal('show')
  }

  function promptCompanyProfileModal() {
    $('#loadProfileModal').modal('hide')
    $('#companyProfileModal').modal('show')
  }

  function promptLoadingModal() {
    $('#companyProfileModal').modal('hide')
    $('#afterPostModal').modal('hide')
    $('#loadProfileModal').modal('show')
  }

  function renderUpdateValidationModal(info) {
    $('.companyInfo').eq(0).text(info.name)
    $('.companyInfo').eq(1).text(info.contact)
    $('.companyInfo').eq(2).text(info.phone)
    $('.companyInfo').eq(3).text(info.website_url)
    $('.companyInfo').eq(4).html(info.bio.replace(/\n\r?/g, '<br />'))
    promptUpdateValidationModal()
  }

  function renderCompanyProfileModal(info) {
    // populate the modal with company info
    $('#editCompanyName').val(info.name)
    $('#editCompanyContact').val(info.contact)
    $('#editCompanyPhone').val(info.phone)
    $('#editCompanyWebsite').val(info.website_url)
    $('#editCompanyDescription').val(info.bio)
    promptCompanyProfileModal();
  }

/*======================================
=            Event Handlers            =
======================================*/

  function editCompanyProfileHandler(e) {
    e.preventDefault();
    promptLoadingModal()
    getCompanyProfile(renderCompanyProfileModal)
  }

  function updateCompanyProfileHandler(e) {
    e.preventDefault();
    promptLoadingModal();
    putCompanyProfile();
  }

/*===================================
=            Initializers            =
===================================*/
  function eventListeners() {
    $('#editCompanyProfileButton').off().on('click', editCompanyProfileHandler)
    $('#updateCompanyProfile').off().on('click', updateCompanyProfileHandler)
  }

  function init() {
    eventListeners()
  }

  init()

}())