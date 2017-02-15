$(document).ready(function() {

/*=================================
=            API Calls            =
=================================*/

  var url = 'http://api.gogenieapp.com'

  function getCompanyProfile(callback) {
    var getUrl = url + '/master/v5/profile_infos/current_info'
    var data = { headers: responseHeaders }

    axios.get(getUrl, data)
    .then(function(response) {
      var currentInfo = response.data.master
      callback(currentInfo)
    })
    .catch(function(error) {
      console.error('there was an error!', error)
    })
  }

  function putCompanyProfile() {
    var putUrl = url + '/master/v5/profile_infos/info',
          data = {
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
      console.log('submitted basic info!', response)
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
  function promptCompanyProfileModal() {
    $('#loadProfileModal').modal('hide')
    $('#companyProfileModal').modal('show')
  }

  function promptLoadingModal() {
    $('#afterPostModal').modal('hide')
    $('#loadProfileModal').modal('show')
  }


  function renderCompanyProfileModal(companyInfo) {
    // populate the modal with company info
    $('#editCompanyName').val(companyInfo.name)
    $('#editCompanyContact').val(companyInfo.contact)
    $('#editCompanyPhone').val(companyInfo.phone)
    $('#editCompanyWebsite').val(companyInfo.website_url)
    $('#editCompanyDescription').val(companyInfo.bio)
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