/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () { alert('hello');
  window.GOVUKFrontend.initAll()
  $('input[type="radio"]').click(function() {
      if($(this).attr('id') == 'spec-answer-2') {
           $('.bordered').show();
      }

      else {
           $('.bordered').hide();
      }
  });
  $('#uploadRegistrationsForm').submit(function () {
      $('#uploadRegistrationsButton').attr('disabled', 'disabled');
​
      // set screen-reader attributes
      $('#uploadRegistrationsContainer').attr('aria-hidden', 'true');
      $('#spinnerText').attr('role', 'true');
      $('#spinnerText').attr('aria-live', 'assertive');
​
      setTimeout(function () {
          $(window).scrollTop(0);
          $('#uploadRegistrationsContainer').toggleClass('tl-hide');
          $('#processingRegistrationsContainer').toggleClass('tl-hide');
      }, 500);
  });
});
