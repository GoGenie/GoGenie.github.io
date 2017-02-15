$(document).ready(function() {

/*=================================
=            API Calls            =
=================================*/

  var url = 'http://localhost:3000'
  // var url = 'http://api-dev.gogenieapp.com'

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
    var putUrl  = url + '/master/v5/profile_infos/info',
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
      responseHeaders = response.headers
      console.log('here is the response:', response)
      renderUpdateValidationModal(response.data.master)
    }).catch(function(error) {
      console.error('there was an error in putCompanyProfile', error);
    })
  }

  function putCompanyImage() {
    var putUrl = url + '/master/v5/profile_infos/upload_image',
          data = {
            upload_image: {
              key: 'profile_image',
              data: document.getElementById('profileImage').src,
            }
          }

    axios.put(putUrl, data, { headers: responseHeaders })
    .then(function(response) {
      responseHeaders = response.headers;
      putCompanyProfile();
    }).catch(function(error) {
      console.log('there was an error in putCompanyImage', error);
    })
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
    $('#imagePreview').attr('src', info.profile_image)
    promptUpdateValidationModal()
  }

  function renderCompanyProfileModal(info) {
    console.log('rendering companyProfileModal, line 80: ', info)
    // populate the modal with company info
    $('#editCompanyName').val(info.name)
    $('#editCompanyContact').val(info.contact)
    $('#editCompanyPhone').val(info.phone)
    $('#editCompanyWebsite').val(info.website_url)
    $('#editCompanyDescription').val(info.bio)
    $('#profileImage').attr('src', info.profile_image)
    promptCompanyProfileModal();
  }

/*======================================
=            Event Handlers            =
======================================*/

  var imageChanged = false;

  function editCompanyProfileHandler(e) {
    e.preventDefault();
    promptLoadingModal()
    getCompanyProfile(renderCompanyProfileModal)
  }

  function updateCompanyProfileHandler(e) {
    e.preventDefault();
    promptLoadingModal();
    if (imageChanged) return putCompanyImage();
    return putCompanyProfile();
  }

  function readImage () {
    if (this.files && this.files[0]) {
      var FR = new FileReader();

      FR.addEventListener('load', function(e) {
        document.getElementById('profileImage').src = e.target.result;
        imageChanged = true;
      })

      FR.readAsDataURL(this.files[0]);
    }
  }

  function triggerInputClick (e) {
    console.log('clicked')
    $('#imageInput').trigger('click');
  }

/*===================================
=            Initializers            =
===================================*/
  function eventListeners() {
    $('#editCompanyProfileButton').off().on('click', editCompanyProfileHandler)
    $('#updateCompanyProfile').off().on('click', updateCompanyProfileHandler)
    $('#imageInput').on('change', readImage)
    $('#imageInputWrapper').on('click', triggerInputClick)
  }

  function init() {
    eventListeners()
  }

  init()

}())