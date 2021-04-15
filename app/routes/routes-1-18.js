const e = require('express');
const { post } = require('../routes');

module.exports = function (router) {

    var postcodeRegex = "([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})";
    var whiteSpaceRegex = "[\\x20\\t\\r\\n\\f]"

    function loadProviderData(req) {

        var fs = require('fs')

        // Accounts
        req.session.data['user_info'] = []
        var filename = 'app/views/1-18/data/Accounts_v18.csv'
        fs.readFile(filename, function (err, buf) {
            data = buf.toString().split(/\r?\n/)
            for (idx = 0; idx < data.length; idx++) {
                line = data[idx].split('\t')
                req.session.data['user_info'].push(line)
            }
            req.session.save()
        })
    }

    function loadPostcodesData(req) {

        var fs = require('fs')

        // Accounts
        req.session.data['postcodes-data'] = []
        var filename = 'app/views/1-18/data/Postcodes.csv'
        fs.readFile(filename, function (err, buf) {
            data = buf.toString().split(/\r?\n/)
            for (idx = 0; idx < data.length; idx++) {
                line = data[idx].split('\t')
                req.session.data['postcodes-data'].push(line)
            }
            req.session.save()
        })
    }

    function clearOrgAddressSession(req) {
        req.session.data['errors'] = []
        req.session.data['selected-postcode-addresses'] = []
        req.session.data['selected-full-address'] = []
        req.session.data['address-postcode'] = null
        req.session.data['full-address'] = null
        req.session.data['cancel-address-answer'] = null

        req.session.data['dept-name'] = null
        req.session.data['manual-dept-name'] = null
        req.session.data['address-line-1'] = null
        req.session.data['address-line-2'] = null
        req.session.data['address-town'] = null
        req.session.data['address-manual-postcode'] = null
        req.session.data['address-manual-postcode-invalid'] = null
        req.session.data['is-entry-from-manual-address'] = null
    }

    function clearSession(req) {
        req.session.data['learner-uln'] = null
        req.session.data['learner-name'] = null
        req.session.data['date-of-birth'] = null
        req.session.data['send-answer'] = null

        req.session.data['result-answer'] = null
        req.session.data['has-lrs-data'] = true
        req.session.data['has-search-uln-added'] = true
        req.session.data['uln-already-added'] = false
        req.session.data['errors'] = []
        req.session.data['review-address'] = null
        req.session.data['review-em-address'] = null

        req.session.data['q1-answer'] = null
        req.session.data['q2-answer'] = null
        req.session.data['q3-answer'] = null
        req.session.data['q4-answer'] = null
    }

    function clearIPresult(req) {
        req.session.data['result-ip-answer'] = null
    }

    function setLearnerDetails(req) {
        req.session.data['learner-name'] = null
        req.session.data['date-of-birth'] = null

        var enteredUln = req.session.data['learner-uln']
        for (userInfo of req.session.data['user_info']) {

            if(enteredUln == userInfo[1]) {
            req.session.data['learner-name'] = userInfo[2] + ' ' + userInfo[3]
            req.session.data['date-of-birth'] = userInfo[4]
            }
        }
    }

    function checkUlnValidation(req, res) {

        var errors = []
        req.session.data['errors'] = []
        var learnerUln = req.session.data['learner-uln']
        if (learnerUln == null || learnerUln == '') {
            errors = ['#Uln', "Enter a ULN"]
            req.session.data['errors'].push(errors)
        } else {
            var isnum = /^\d+$/.test(learnerUln)
            if(learnerUln.length < 10 || learnerUln.length > 10 || isnum === false)
            {
                errors = ['#Uln', "Enter a ULN with 10 digits"]
                req.session.data['errors'].push(errors)
            } else{
                errors = []
            }
        }

        if(errors.length > 0) {
            return false
        } else {
            return true
        }
    }

    function addValidationError(req, res, errors, clearerrors = true)
    {
        if(clearerrors){
            req.session.data['errors'] = [];
        }

        if(errors != null || errors.length > 0)
        {
            req.session.data['errors'].push(errors)
        }
    }

    function clearValidationError(req)
    {
        req.session.data['errors'] = []
    }

    function removeSpaces(req, value)
    {
        var formatedValue = value.replace(new RegExp(whiteSpaceRegex, "g"), "").trim();
        return formatedValue;
    }

    function GetAddressesByPostcode(req, enteredPostcode) {
        var postcodesData = req.session.data['postcodes-data']

        if(postcodesData != null) {

            req.session.data['selected-postcode-addresses'] = []
            for (idx = 0; idx < postcodesData.length; idx++) {
                line = data[idx].split('\t')
                if (line[1].toLowerCase() === enteredPostcode.toLowerCase()) {
                    req.session.data['selected-postcode-addresses'].push(line)
                }
            }
        }
    }

    // Manage Postal Address Routes

    router.get('/1-18/dynamic/action-manage-organisation-postal-address', function (req, res) {

        loadPostcodesData(req);

        var postalAddress = req.session.data['added-org-postal-address']

        if(postalAddress == null || postalAddress == '') {
            res.redirect('/1-18/dynamic/org-address-missing')
        }
        else {
            res.redirect('/1-18/dynamic/org-address-present')
        }
    })

    router.get('/1-18/dynamic/action-add-address-postcode', function (req, res) {
        clearValidationError(req);
        clearOrgAddressSession(req);
        res.redirect('/1-18/dynamic/add-address-postcode')
    })

    router.post('/1-18/dynamic/action-add-address-select-address', function (req, res) {
        var enteredPostcode = req.session.data['address-postcode']

        if(enteredPostcode == null || enteredPostcode == '')
        {
            var sendErrors = ['#address-postcode', "Enter your postcode"]
            addValidationError(req,res,sendErrors)
            res.redirect('/1-18/dynamic/add-address-postcode')
        }
        else {
            var trimmedPostcode = enteredPostcode.replace(new RegExp(whiteSpaceRegex, "g"), "").trim();
            var isPostcodeValid = trimmedPostcode.match(new RegExp(postcodeRegex));

            if(isPostcodeValid == null || isPostcodeValid == '')
            {
                var sendErrors = ['#address-postcode', "Enter a valid UK postcode"]
                addValidationError(req,res,sendErrors)
                res.redirect('/1-18/dynamic/add-address-postcode')
            }
            else {
                clearValidationError(req)
                GetAddressesByPostcode(req, trimmedPostcode)

                var selectedPostcode = req.session.data['selected-postcode-addresses'];
                req.session.data['address-postcode'] = selectedPostcode[0][5]
                req.session.data['is-entry-from-manual-address'] = null
                res.redirect('/1-18/dynamic/add-address-select-address')
            }
        }
    })

    router.post('/1-18/dynamic/action-manually-add-address-confirm-address', function (req, res) {

        var enteredAddressLine1 = req.session.data['address-line-1']
        var enteredAddressTown = req.session.data['address-town']
        var enteredAddressPostcode = req.session.data['address-manual-postcode']
        var sendErrors = [];

        clearValidationError(req)
        req.session.data['address-manual-postcode-invalid'] = null;

        if(enteredAddressLine1 == null || enteredAddressLine1 == '')
        {
            sendErrors = ['#address-line-1', "Enter your building and street"];
            addValidationError(req,res,sendErrors, false)
        }

        if(enteredAddressTown == null || enteredAddressTown == '')
        {
            sendErrors = ['#address-town', "Enter your town or city"]
            addValidationError(req,res,sendErrors, false)
        }

        if(enteredAddressPostcode == null || enteredAddressPostcode == '')
        {
            sendErrors = ['#address-manual-postcode', "Enter your postcode"]
            addValidationError(req,res,sendErrors, false)
        }
        else {
            var trimmedPostcode = enteredAddressPostcode.replace(new RegExp(whiteSpaceRegex, "g"), "").trim();

            req.session.data['address-manual-postcode'] = trimmedPostcode

            var isPostcodeValid = trimmedPostcode.match(new RegExp(postcodeRegex));

            if(isPostcodeValid == null || isPostcodeValid == '')
            {
                req.session.data['address-manual-postcode-invalid'] = "invalid";
                sendErrors = ['#address-manual-postcode', "Enter a valid UK postcode"]
                addValidationError(req,res,sendErrors, false)
            }
            else{
                req.session.data['address-manual-postcode-invalid'] = null;
            }
        }

        if(sendErrors.length > 0)
        {
            res.redirect('/1-18/dynamic/add-address-manually')
        }
        else{
            var formattedPostcode = removeSpaces(req, req.session.data['address-manual-postcode'])
            var formattedAddress = ["100000" + "\t" + formattedPostcode + "\t"
            + req.session.data['address-line-1'] + "\t" + req.session.data['address-line-2'] + "\t"
            + req.session.data['address-town'] + "\t" + formattedPostcode]

            address = formattedAddress[0].split('\t')
            req.session.data['selected-full-address'] = []
            req.session.data['selected-full-address'].push(address)

            req.session.data['is-entry-from-manual-address'] = "true";
            res.redirect('/1-18/dynamic/add-address-confirm-address')
        }
    })


    router.post('/1-18/dynamic/action-add-address-confirm-address', function (req, res) {

        var selectedAddress = req.session.data['full-address']

        if(selectedAddress == null || selectedAddress == '')
        {
            var sendErrors = ['#full-address', "Select your address from the list"]
            addValidationError(req,res,sendErrors)
            res.redirect('/1-18/dynamic/add-address-select-address')
        }
        else {
            req.session.data['selected-full-address'] = []
            var postcodesData = req.session.data['postcodes-data'];

            for (idx = 0; idx < postcodesData.length; idx++) {
                line = data[idx].split('\t')
                if (line[0] === selectedAddress) {
                    req.session.data['selected-full-address'].push(line)
                }
            }

            res.redirect('/1-18/dynamic/add-address-confirm-address')
        }
    })

    router.get('/1-18/dynamic/action-add-address-confirmation', function (req, res) {
        req.session.data['added-org-postal-address'] = req.session.data['selected-full-address']

        if(req.session.data['is-entry-from-manual-address'] != null) {
            req.session.data['added-org-postal-address-dept-name'] = req.session.data['manual-dept-name']
        }
        else {
            req.session.data['added-org-postal-address-dept-name'] = req.session.data['dept-name']
        }
        clearOrgAddressSession(req);
        res.redirect('/1-18/dynamic/add-address-confirmation')
    })

    router.get('/1-18/dynamic/action-cancel-address', function (req, res) {
        var cancelAnswer = req.session.data['cancel-address-answer']
        if(cancelAnswer == 'Yes'){
            clearOrgAddressSession(req);
            res.redirect('/1-18/dynamic/tlevels-dashboard')
        } else {
            res.redirect('/1-18/dynamic/add-address-confirm-address')
        }
    })

    router.get('/1-18/dynamic/action-add-address-select-address', function (req, res) {
        clearValidationError(req);
        clearOrgAddressSession(req);
        res.redirect('/1-18/dynamic/add-address-select-address')
    })

    router.get('/1-18/dynamic/action-add-address-manually', function (req, res) {
        clearValidationError(req);
        clearOrgAddressSession(req);
        res.redirect('/1-18/dynamic/add-address-manually')
    })

    // Manage Address Back Link Actions
    router.get('/1-18/dynamic/action-back-add-address-journey', function (req, res) {
        clearValidationError(req);
        var postalAddress = req.session.data['added-org-postal-address']

        if(postalAddress == null || postalAddress == '') {
            res.redirect('/1-18/dynamic/org-address-missing')
        }
        else {
            res.redirect('/1-18/dynamic/org-address-present')
        }
    })

    router.get('/1-18/dynamic/action-back-add-address-postcode', function (req, res) {
        clearValidationError(req);
        res.redirect('/1-18/dynamic/add-address-postcode')
    })

    router.get('/1-18/dynamic/action-back-add-address-select-address', function (req, res) {
        clearValidationError(req);
        var isManualAddressEntry = req.session.data['is-entry-from-manual-address'];

        if(isManualAddressEntry == null || isManualAddressEntry == '')
        {
            res.redirect('/1-18/dynamic/add-address-select-address')
        }
        else {
            res.redirect('/1-18/dynamic/add-address-manually')
        }
    })



    router.post('/1-18/Research/action-review-address', function (req, res) {

        var hasReultAnswerSelected = req.session.data['review-address']

        if(hasReultAnswerSelected == null || hasReultAnswerSelected == '')
        {
            var sendErrors = ['#review-address-1', "Select 'yes' if this is the correct address"]
            addValidationError(req,res,sendErrors)
            res.redirect('/1-18/Research/review-address')
        } else if (hasReultAnswerSelected == 'Yes')
        {
            clearValidationError(req)
            res.redirect('/1-18/Research/check-submit')
        } else {
            clearValidationError(req)
            res.redirect('/1-18/Research/review-address')
        }
    })


      router.post('/1-18/Research/action-add-learner', function (req, res) {

          var isValid = checkUlnValidation(req, res)

          if(isValid) {
              var enteredUln = req.session.data['learner-uln']
              var userInfo = req.session.data['user_info']

              if(enteredUln == userInfo[3][1])
              {
                setLearnerDetails(req)
                res.redirect('/1-18/Research/add-learner-q1-ulnAlreadyAdded')
              }
              else if(enteredUln == userInfo[1][1])
              {
                  setLearnerDetails(req)
                  res.redirect('/1-18/Research/add-learner-q1-ulnAlreadyAdded')
              }
              else if(enteredUln == userInfo[4][1])
              {
                  setLearnerDetails(req)
                  res.redirect('/1-18/Research/add-learner-q3-ip')
              }
              else if(enteredUln == userInfo[5][1])
              {
                  setLearnerDetails(req)
                  res.redirect('/1-18/Research/add-learner-q1-ulnAlreadyAdded')
              }
              else if(enteredUln == userInfo[2][1])
              {
                  setLearnerDetails(req)
                  res.redirect('/1-18/Research/add-learner-q3-ip')
              }
              else
              {
                  res.redirect('/1-18/Research/add-learner-q1-ulnNotExist')
              }
          }
          else {
              res.redirect('/1-18/Research/add-learner-q1-uln')
          }
      })

      router.post('/1-18/Research/action-add-learner-q4-check', function (req, res) {

          var hasIpSelected = req.session.data['result-ip-answer']

          if(hasIpSelected == null || hasIpSelected == '')
          {
              var sendErrors = ['#result-ip-answer-1', "Select if the learner has completed their industry placement"]
              addValidationError(req,res,sendErrors)
              res.redirect('/1-18/Research/add-learner-q3-ip')
          } else {
              clearValidationError(req)
              res.redirect('/1-18/Research/add-learner-q4-check')
          }
      })


      router.get('/1-18/Research/action-select-add-learner', function (req, res) {
          clearSession(req);
          res.redirect('/1-18/Research/add-learner-q1-uln')
      })

      router.get('/1-18/Research/action-select-search-learner', function (req, res) {
          clearSession(req);
          res.redirect('/1-18/Research/search-learner-record')
      })

      router.get('/1-18/Research/action-tlevels-dashboard', function (req, res) {
          clearIPresult(req);
          res.redirect('/1-18/Research/tlevels-dashboard')
      })

    // Back Action routes

    router.get('/1-18/Research/action-back-to-address', function (req, res) {
        clearValidationError(req);
        res.redirect('/1-18/Research/review-address')
    })

    // Search Learner

    router.get('/1-18/Research/action-agree-to-statement', function (req, res) {
        clearSession(req);
        res.redirect('/1-18/Research/q0-search-learner')
    })

    router.get('/1-18/dynamic/action-agree-to-statement', function (req, res) {
        clearSession(req);
        res.redirect('/1-18/dynamic/q0-search-learner')
    })

    router.get('/1-18/Research/action-search-again', function (req, res) {
        clearSession(req);
        res.redirect('/1-18/Research/q0-search-learner')
    })

    router.get('/1-18/Research/action-search-another-record', function (req, res) {
        clearSession(req);
        clearIPresult(req);
        res.redirect('/1-18/Research/search-learner-record')
    })

    router.get('/1-18/dynamic/action-search-learner', function (req, res) {

        var isValid = checkUlnValidation(req, res)

        if(isValid) {
            var enteredUln = req.session.data['learner-uln']
            var userInfo = req.session.data['user_info']

            if(enteredUln == userInfo[0][1])
            {
                res.redirect('/1-18/dynamic/learner-ulnNotExist')
            }
            else if(enteredUln == userInfo[1][1])
            {
                setLearnerDetails(req)
                res.redirect('/1-18/dynamic/learner-details-requestpending')
            }
            else if(enteredUln == userInfo[2][1])
            {
                setLearnerDetails(req)
                res.redirect('/1-18/dynamic/learner-details-noresults')
            }
            else if(enteredUln == userInfo[3][1])
            {
                setLearnerDetails(req)
                res.redirect('/1-18/dynamic/notify-ao')
            }
            else if(enteredUln == userInfo[4][1])
            {
                setLearnerDetails(req)
                res.redirect('/1-18/dynamic/q1-learners-details')
            }
            else if(enteredUln == userInfo[5][1])
            {
                setLearnerDetails(req)
                res.redirect('/1-18/dynamic/learner-details')
            }
            else
            {
                res.redirect('/1-18/dynamic/learner-ulnNotExist')
            }
        }
        else {
            res.redirect('/1-18/dynamic/search-learner')
        }
    })

    router.get('/1-18/Research/action-search-learner', function (req, res) {

        var isValid = checkUlnValidation(req, res)

        if(isValid) {
            var enteredUln = req.session.data['learner-uln']
            var userInfo = req.session.data['user_info']

            if(enteredUln == userInfo[0][1])
            {
                res.redirect('/1-18/Research/learner-ulnNotExist')
            }
            else if(enteredUln == userInfo[1][1])
            {
                setLearnerDetails(req)
                res.redirect('/1-18/Research/learner-details-requestpending')
            }
            else if(enteredUln == userInfo[2][1])
            {
                setLearnerDetails(req)
                res.redirect('/1-18/Research/learner-details-noresults')
            }
            else if(enteredUln == userInfo[3][1])
            {
                setLearnerDetails(req)
                res.redirect('/1-18/Research/notify-ao')
            }
            else if(enteredUln == userInfo[4][1])
            {
                setLearnerDetails(req)
                res.redirect('/1-18/Research/q1-learners-details')
            }
            else if(enteredUln == userInfo[5][1])
            {
                setLearnerDetails(req)
                res.redirect('/1-18/Research/learner-details')
            }
            else
            {
                res.redirect('/1-18/Research/learner-ulnNotExist')
            }
        }
        else {
            res.redirect('/1-18/Research/search-learner')
        }
    })

    router.get('/1-18/Research/action-search-learner-record', function (req, res) {

      var isValid = checkUlnValidation(req, res)

      if(isValid) {
          var enteredUln = req.session.data['learner-uln']
          var userInfo = req.session.data['user_info']

          if(enteredUln == userInfo[3][1])
          {
              setLearnerDetails(req)
              res.redirect('/1-18/Research/record-entries')
          }
          else if(enteredUln == userInfo[1][1])
          {
              setLearnerDetails(req)
              res.redirect('/1-18/Research/record-entries')
          }
          else if(enteredUln == userInfo[4][1])
          {
              setLearnerDetails(req)
              res.redirect('/1-18/Research/search-failed-notadded')
          }
          else if(enteredUln == userInfo[2][1])
          {
              setLearnerDetails(req)
              res.redirect('/1-18/Research/search-failed-notadded')
          }
          else if(enteredUln == userInfo[5][1])
          {
              setLearnerDetails(req)
              res.redirect('/1-18/Research/record-entries')
          }
          else
          {
              res.redirect('/1-18/Research/learner-ulnNotExist')
          }
      }
      else {
          res.redirect('/1-18/Research/search-learner-record')
      }
    })

    router.post('/1-18/Research/action-check-q1-answer', function (req, res) {

        var hasReultAnswerSelected = req.session.data['q1-answer']

        if(hasReultAnswerSelected == null || hasReultAnswerSelected == '')
        {
            var sendErrors = ['#q1-answer-1', "Select if the learner's details are correct"]
            addValidationError(req,res,sendErrors)
            res.redirect('/1-18/Research/q1-learners-details')
        }   else if(hasReultAnswerSelected === 'Yes') {
            clearValidationError(req)
            res.redirect('/1-18/Research/q2-quals')
        }   else {
              res.redirect('q1-learners-details-no')
        }

    })

    router.post('/1-18/Research/action-check-q2-answer', function (req, res) {

        var hasReultAnswerSelected = req.session.data['q2-answer']

        if(hasReultAnswerSelected == null || hasReultAnswerSelected == '')
        {
            var sendErrors = ['#q2-answer-1', "Select if the learner's achievements are correct"]
            addValidationError(req,res,sendErrors)
            res.redirect('/1-18/Research/q2-quals')
        }   else if(hasReultAnswerSelected === 'Yes') {
            clearValidationError(req)
            res.redirect('/1-18/Research/q3-tq-components')
        }   else {
              res.redirect('q2-quals-no')
        }

    })

    router.post('/1-18/Research/action-check-q3-answer', function (req, res) {

        var hasReultAnswerSelected = req.session.data['q3-answer']

        if(hasReultAnswerSelected == null || hasReultAnswerSelected == '')
        {
            var sendErrors = ['#q3-answer-1', "Select if the learner's technical qualifications are correct"]
            addValidationError(req,res,sendErrors)
            res.redirect('/1-18/Research/q3-tq-components')
        }   else if(hasReultAnswerSelected === 'Yes') {
            clearValidationError(req)
            res.redirect('/1-18/Research/q4-address')
        }   else {
              res.redirect('q3-tq-components-no')
        }

    })

    router.post('/1-18/Research/action-check-q4-answer', function (req, res) {

        var hasReultAnswerSelected = req.session.data['q4-answer']

        if(hasReultAnswerSelected == null || hasReultAnswerSelected == '')
        {
            var sendErrors = ['#q4-answer-1', "Select if the organisation's postal address is correct"]
            addValidationError(req,res,sendErrors)
            res.redirect('/1-18/Research/q4-address')
        }   else if(hasReultAnswerSelected === 'Yes') {
            clearValidationError(req)
            res.redirect('/1-18/Research/q5-check')
        }   else {
              res.redirect('q4-address-no')
        }

    })

    router.post('/1-18/Research/action-cancel-request', function (req, res) {

        var hasReultAnswerSelected = req.session.data['cancel-answer']

        if(hasReultAnswerSelected === 'Yes') {
            clearValidationError(req)
            res.redirect('/1-18/Research/tlevels-dashboard')
        }   else {
              res.redirect('q5-check')
        }

    })

    router.post('/1-18/dynamic/action-check-q1-answer', function (req, res) {

        var hasReultAnswerSelected = req.session.data['q1-answer']

        if(hasReultAnswerSelected == null || hasReultAnswerSelected == '')
        {
            var sendErrors = ['#q1-answer-1', "Select if the learner's details are correct"]
            addValidationError(req,res,sendErrors)
            res.redirect('/1-18/dynamic/q1-learners-details')
        }   else if(hasReultAnswerSelected === 'Yes') {
            clearValidationError(req)
            res.redirect('/1-18/dynamic/q2-quals')
        }   else {
              res.redirect('q1-learners-details-no')
        }

    })

    router.post('/1-18/dynamic/action-check-q2-answer', function (req, res) {

        var hasReultAnswerSelected = req.session.data['q2-answer']

        if(hasReultAnswerSelected == null || hasReultAnswerSelected == '')
        {
            var sendErrors = ['#q2-answer-1', "Select if the learner's achievements are correct"]
            addValidationError(req,res,sendErrors)
            res.redirect('/1-18/dynamic/q2-quals')
        }   else if(hasReultAnswerSelected === 'Yes') {
            clearValidationError(req)
            res.redirect('/1-18/dynamic/q3-tq-components')
        }   else {
              res.redirect('q2-quals-no')
        }

    })

    router.post('/1-18/dynamic/action-check-q3-answer', function (req, res) {

        var hasReultAnswerSelected = req.session.data['q3-answer']

        if(hasReultAnswerSelected == null || hasReultAnswerSelected == '')
        {
            var sendErrors = ['#q3-answer-1', "Select if the learner's technical qualifications are correct"]
            addValidationError(req,res,sendErrors)
            res.redirect('/1-18/dynamic/q3-tq-components')
        }   else if(hasReultAnswerSelected === 'Yes') {
            clearValidationError(req)
            res.redirect('/1-18/dynamic/q4-address')
        }   else {
              res.redirect('q3-tq-components-no')
        }

    })

    router.post('/1-18/dynamic/action-check-q4-answer', function (req, res) {

        var hasReultAnswerSelected = req.session.data['q4-answer']

        if(hasReultAnswerSelected == null || hasReultAnswerSelected == '')
        {
            var sendErrors = ['#q4-answer-1', "Select if the organisation's postal address is correct"]
            addValidationError(req,res,sendErrors)
            res.redirect('/1-18/dynamic/q4-address')
        }   else if(hasReultAnswerSelected === 'Yes') {
            clearValidationError(req)
            res.redirect('/1-18/dynamic/q5-check')
        }   else {
              res.redirect('q4-address-no')
        }

    })

    router.post('/1-18/dynamic/action-cancel-request', function (req, res) {

        var hasReultAnswerSelected = req.session.data['cancel-answer']

        if(hasReultAnswerSelected === 'Yes') {
            clearValidationError(req)
            res.redirect('/1-18/dynamic/tlevels-dashboard')
        }   else {
              res.redirect('q5-check')
        }

    })

}
