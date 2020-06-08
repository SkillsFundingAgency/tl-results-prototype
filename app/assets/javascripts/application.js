/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  window.GOVUKFrontend.initAll()
  $('input[type="radio"]').click(function() {
      if($(this).attr('id') == 'spec-answer-2') {
           $('.bordered').show();
      }

      else {
           $('.bordered').hide();
      }
  });
})
