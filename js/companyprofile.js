$(document).ready(function() {

  /*=================================
  =            API Calls            =
  =================================*/

  var url = 'http://api.gogenieapp.com'

  function renderCompanyProfileModal(companyInfo) {
    // populate the modal with company info
  }

  function promptCompanyProfileModal() {
    $('#loadProfileModal').modal('hide')
    $('#companyProfileModal').modal('show')
  }

  function promptLoadingModal() {
    $('#afterPostModal').modal('hide')
    $('#loadProfileModal').modal('show')
  }

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

  function editCompanyProfileHandler() {
    promptLoadingModal()
    getCompanyProfile(renderCompanyProfileModal)
    promptCompanyProfileModal();
  }

  function eventHandlers() {
    $('#editCompanyProfileButton').off().on('click', editCompanyProfileHandler)
  }

  function init() {
    eventHandlers()
  }

  init()

})()