/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  window.GOVUKFrontend.initAll();


  var dlSelectedAddress = $('#full-address')

  if(dlSelectedAddress !== null)
  {
    var selectedValue = dlSelectedAddress.val();

    if(selectedValue != null && selectedValue != '')
    {
      $('#divDepartment').show();
    }
    else{
      $('#divDepartment').hide();
    }
  }

  dlSelectedAddress.click(function() {
    var selectedValue = $(this).val();
    if(selectedValue != null && selectedValue != '')
    {
      $('#divDepartment').show();
    }
    else{
      $('#divDepartment').hide();
    }
  });

  var selectedRadio = $('input[type="radio"]:checked');

  if(selectedRadio.attr('id') == 'result-answer-1')  {
    $('#sendDeclaration').show();
  }else {
    $('#sendDeclaration').hide();
  }

  $('input[type="radio"]').click(function() {
    if($(this).attr('id') == 'result-answer-3') {
      $('#btnUpdate').text('Continue');
      $('#sendDeclaration').hide();
    }
    else {
      $('#btnUpdate').text('Update');

      if($(this).attr('id') == 'result-answer-1') {
        $('#sendDeclaration').show();
      } else {
        $('#sendDeclaration').hide();
      }
    }
});

  $('input[type="radio"]').click(function() {
      if($(this).attr('id') == 'spec-answer-2') {
           $('.bordered').show();
      }
      else {
           $('.bordered').hide();
      }
  });
});
