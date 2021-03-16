const e = require('express')

module.exports = function (router) {

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

    function addValidationError(req, res, errors)
    {
        req.session.data['errors'] = [];

        if(errors != null || errors.length > 0)
        {
            req.session.data['errors'].push(errors)
        }
    }

    function clearValidationError(req)
    {
        req.session.data['errors'] = []
    }

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
              else if(enteredUln == userInfo[4][1])
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
        res.redirect('/1-18/Research/search-learner')
    })

    router.get('/1-18/Research/action-search-again', function (req, res) {
        clearSession(req);
        res.redirect('/1-18/Research/search-learner')
    })

    router.get('/1-18/Research/action-search-another-record', function (req, res) {
        clearSession(req);
        clearIPresult(req);
        res.redirect('/1-18/Research/search-learner-record')
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
            else if(enteredUln == userInfo[3][1] && req.session.data['result-ip-answer'] == null)
            {
                setLearnerDetails(req)
                res.redirect('/1-18/Research/learner-details')
            }
            else if(enteredUln == userInfo[3][1])
            {
                setLearnerDetails(req)
                res.redirect('/1-18/Research/learner-details')
            }
            else if(enteredUln == userInfo[4][1] && req.session.data['result-ip-answer'] == null )
            {
                setLearnerDetails(req)
                res.redirect('/1-18/Research/learner-details')
            }
            else if(enteredUln == userInfo[4][1])
            {
                setLearnerDetails(req)
                res.redirect('/1-18/Research/learner-details')
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
          else if(enteredUln == userInfo[4][1])
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
          res.redirect('/1-18/Research/search-learner')
      }
    })

}
