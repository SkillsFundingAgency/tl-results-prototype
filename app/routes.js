const express = require('express')
const session = require('express-session')
const router = express.Router()

// Add your routes here - above the module.exports line

function initialiseVariables(req) {
    console.log("Initialising")
    /*
    Sets up variables for the session
    */

   //req.session.data['Uln'] = null
   req.session.data['has-lrs-data'] = true
   req.session.data['has-search-uln-added'] = true
   req.session.data['uln-already-added'] = false

    // T Levels
    req.session.data['tLevels'] = []
    req.session.data['tLevels-ao'] = []
    req.session.data['tLevels-list'] = []
    req.session.data['errors'] = []
    req.session.data['permissions'] = [true, true, true, true, true, true, true, true]
    /* Permissions defines access to various functions
    0 = Can view T Levels
    1 = Can view and verify T Levels
    2 = Can view providers/centres
    3 = Can view/add/edit/delete providers/centres
    4 = Can view learners
    5 = Can view/add/edit/delete learners
    6 = Can view assessment results
    7 = Can view/add/edit/delete results
    */

    req.session.data['tasks'] = [
        ['You need to verify your T Level TQ titles', '/1-4/AO/ao-t-levels', '0', '1']
    ]
    req.session.data['urgent-tasks'] = 0
    for (task in req.session.data['tasks']) {
        if (req.session.data['tasks'][task][3] === '1') {
            req.session.data['urgent-tasks']++
        }
    }
    var fs = require('fs')
    var filename = 'app/views/1-2/AO/data/TLevels_v1.3.csv'
    fs.readFile(filename, function (err, buf) {
        data = buf.toString().split(/\r?\n/)
        for (idx = 0; idx < data.length; idx++) {
            line = data[idx].split('\t')
            req.session.data['tLevels'].push(line)
            if (line[5] == req.session.data['ao']) {
                req.session.data['tLevels-ao'].push(line)
                req.session.data['tLevels-list'].push(line[7])
            }
        }
        req.session.save()
    })

    // Specialisms
    req.session.data['specialisms'] = []
    req.session.data['specialisms-ao'] = []
    var filename = 'app/views/1-2/AO/data/specialisms_v1.3.csv'
    fs.readFile(filename, function (err, buf) {
        data = buf.toString().split(/\r?\n/)
        var group = []
        for (idx = 0; idx < data.length; idx++) {
            line = data[idx].split('\t')
            req.session.data['specialisms'].push(line)
            if (line[6] == req.session.data['ao']) {
                req.session.data['specialisms-ao'].push(line)
            }
        }
        req.session.save()
    })

    // Providers
    req.session.data['providers'] = []
    var filename = 'app/views/1-2/AO/data/Providers_v1.5.csv'
    fs.readFile(filename, function (err, buf) {
        data = buf.toString().split(/\r?\n/)
        for (idx = 0; idx < data.length; idx++) {
            line = data[idx].split('\t')
            if (line[2] == 'X' || line[3] == 'X') {
                if (req.session.data['ao'] == 'Pearson') {
                    req.session.data['providers'].push(line)
                }
            }
            if (line[4] == 'X' && req.session.data['ao'] == 'NCFE') {
                req.session.data['providers'].push(line)
            }
        }
        req.session.data['providers-tmp'] = req.session.data['providers']
        req.session.save()
    })

    // Providers - to be added
    req.session.data['providers-added'] = []
    var filename = 'app/views/1-2/AO/data/providers-added.csv'
    fs.readFile(filename, function (err, buf) {
        data = buf.toString().split(/\r?\n/)
        for (idx = 0; idx < data.length; idx++) {
            line = data[idx].split('\t')
            req.session.data['providers-added'].push(line)
        }
        req.session.save()
    })

    // Students - enrolled
    req.session.data['students'] = []
    req.session.data['students-ao'] = []
    var filename = 'app/views/1-2/AO/data/Students_v1.5.csv'
    fs.readFile(filename, function (err, buf) {
        data = buf.toString().split(/\r?\n/)
        for (idx = 0; idx < data.length; idx++) {
            line = data[idx].split('\t')
            req.session.data['students'].push(line)
            if (req.session.data['tLevels-list'].indexOf(line[13]) != -1) {
                req.session.data['students-ao'].push(line)
            }
        }
        req.session.data['students-ao-tmp'] = req.session.data['students-ao']
        req.session.save()
    })

    // Students - to be added
    req.session.data['students-added'] = []
    var filename = 'app/views/1-2/AO/data/Students_added_v1.2.csv'
    fs.readFile(filename, function (err, buf) {
        data = buf.toString().split(/\r?\n/)
        for (idx = 0; idx < data.length; idx++) {
            // Add check to record if the T level specialism matches 'specialisms'. Also get provider from this
            line = data[idx].split('\t')
            req.session.data['students-added'].push(line)
        }
        req.session.save()
    })

    // Accounts
    req.session.data['accounts'] = []
    var filename = 'app/views/1-2/AO/data/Accounts_v1.5.csv'
    fs.readFile(filename, function (err, buf) {
        data = buf.toString().split(/\r?\n/)
        for (idx = 0; idx < data.length; idx++) {
            line = data[idx].split('\t')
            if (line[1] === req.session.data['ao']) {
                req.session.data['accounts'].push(line)
            }
        }
        req.session.save()
    })

    // User Info
    req.session.data['user_info'] = []
        var filename = 'app/views/1-17/data/Accounts_v17.csv'
        fs.readFile(filename, function (err, buf) {
            data = buf.toString().split(/\r?\n/)
            for (idx = 0; idx < data.length; idx++) {
                line = data[idx].split('\t')
                req.session.data['user_info'].push(line)
            }
            req.session.save()
        })

    req.session.data['activeFlag'] = true
    req.session.save()
    return
}

router.get('/1-17/dynamic/action-select-student-results', function (req, res) {
  require('./routes/routes-1-17.js')(router)
  checkIfActive(req)
  res.redirect('/1-17/dynamic/student-results')
})

router.get('/1-18/dynamic/action-manage-postal-address', function (req, res) {
  require('./routes/routes-1-18.js')(router)
  checkIfActive(req)
  res.redirect('/1-18/dynamic/action-manage-organisation-postal-address')
})

router.get('/1-18/Research/action-select-learner-records', function (req, res) {
  require('./routes/routes-1-18.js')(router)
  checkIfActive(req)
  res.redirect('/1-18/Research/learner-records')
})

router.get('/1-18/Research/action-select-statement', function (req, res) {
  require('./routes/routes-1-18.js')(router)
  checkIfActive(req)
  res.redirect('/1-18/Research/statement')
})

router.get('/1-18/dynamic/action-select-statement', function (req, res) {
  require('./routes/routes-1-18.js')(router)
  checkIfActive(req)

  var address = req.session.data['added-org-postal-address']

  if(address == null || address == '')
  {
    setProviderDefaultAddress(req);
  }

  res.redirect('/1-18/dynamic/statement')
})

router.get('/1-18/dynamic/action-missing-address', function (req, res) {
  require('./routes/routes-1-18.js')(router)
  checkIfActive(req)

  req.session.data['added-org-postal-address'] = []
  req.session.data['added-org-postal-address-dept-name'] = null
  res.redirect('/1-18/dynamic/missing-address')
})


function setProviderDefaultAddress(req)
{
  var departmentName = "Exams Office"
  var postCode = "HU17 8QG"
  var addressLine1 = "Pippins Cottage, Bishop Burton College"
  var addressLine2 = "York Road, Bishop Burton"
  var town = "Beverley"  

  var formattedAddress = ["100001" + "\t" + postCode + "\t" + addressLine1 + "\t" + addressLine2 + "\t" + town + "\t" + postCode]

  address = formattedAddress[0].split('\t')
  req.session.data['added-org-postal-address'] = []
  req.session.data['added-org-postal-address'].push(address)
  req.session.data['added-org-postal-address-dept-name'] = departmentName
}

// function clearSession(req) {
//   req.session.data['Uln'] = null
// }

// router.get('/1-17/dynamic/action-select-add-learner', function (req, res) {
//   clearSession(req);
//   //loadProviderData(req)
//   res.redirect('/1-17/dynamic/add-learner-q1-uln')
// })

// router.post('/1-17/dynamic/action-add-learner', function (req, res) {

//   var enteredUln = req.session.data['ULN']
//   var userInfo = req.session.data['user_info']

//   if(enteredUln == userInfo[0][1])
//   {
//       res.redirect('/1-17/dynamic/add-learner-q1-ulnNotExist')
//   }
//   else if(enteredUln == userInfo[1][1])
//   {
//       res.redirect('/1-17/dynamic/add-learner-q2-em')
//   }
// })


router.get('/1-5/AO/act-ao-view-providers', function (req, res) {
  require('./routes/routes-1-5.js')(router)
  req.session.data['ao-long'] = "Pearson (RN5133)"
  req.session.data['ao-long'] = "NCFE (RN5156)"
  req.session.data['ao'] = "NCFE"
  checkIfActive(req)
  req.session.save()
  res.render('1-5/AO/ao-view-providers')
})


router.post('/1-7/AO/confirm-answer', function (req, res) {

  let tLevelVerified = req.session.data['tLevel-verified']

  if (tLevelVerified === 'Verified') {
    res.redirect('confirmation-not-finished-confirmed')
  } else {
    res.redirect('report-tlevel-issue')
  }
})

router.post('/1-8/AO/confirm-answer', function (req, res) {

  let tLevelVerified = req.session.data['tLevel-verified']

  if (tLevelVerified === 'Verified') {
    res.redirect('confirmation-not-finished-confirmed')
  } else {
    res.redirect('report-tlevel-issue')
  }
})

router.post('/1-9/AO/confirm-answer', function (req, res) {

  let tLevelVerified = req.session.data['tLevel-verified']

  if (tLevelVerified === 'Verified') {
    res.redirect('confirmation-not-finished-confirmed')
  } else {
    res.redirect('report-tlevel-issue')
  }
})

router.post('/1-10/AO/confirm-answer', function (req, res) {

  let tLevelVerified = req.session.data['tLevel-verified']

  if (tLevelVerified === 'Verified') {
    res.redirect('confirmation-not-finished-confirmed')
  } else {
    res.redirect('report-tlevel-issue')
  }
})

router.post('/1-11/AO/confirm-answer', function (req, res) {

  let tLevelVerified = req.session.data['tLevel-verified']

  if (tLevelVerified === 'Verified') {
    res.redirect('confirmation-not-finished-confirmed')
  } else {
    res.redirect('report-tlevel-issue')
  }
})

router.post('/1-12/AO/confirm-answer', function (req, res) {

  let tLevelVerified = req.session.data['tLevel-verified']

  if (tLevelVerified === 'Verified') {
    res.redirect('confirmation-not-finished-confirmed')
  } else {
    res.redirect('report-tlevel-issue')
  }
})

router.post('/1-7/AO/which-details-to-show', function (req, res) {

  let tLevelName = req.session.data['tLevel-name']

  if (tLevelName === 'Construction: Design, Surveying and Planning') {
    res.redirect('verify-tlevel-details-construction')
  } else {
    res.redirect('verify-tlevel-details-digital')
  }
})

router.post('/1-8/AO/which-details-to-show', function (req, res) {

  let tLevelName = req.session.data['tLevel-name']

  if (tLevelName === 'Construction: Design, Surveying and Planning') {
    res.redirect('verify-tlevel-details-construction')
  } else {
    res.redirect('verify-tlevel-details-digital')
  }
})

router.post('/1-9/AO/which-details-to-show', function (req, res) {

  let tLevelName = req.session.data['tLevel-name']

  if (tLevelName === 'Construction: Design, Surveying and Planning') {
    res.redirect('verify-tlevel-details-construction')
  } else {
    res.redirect('verify-tlevel-details-digital')
  }
})

router.post('/1-10/AO/which-details-to-show', function (req, res) {

  let tLevelName = req.session.data['tLevel-name']

  if (tLevelName === 'Construction: Design, Surveying and Planning') {
    res.redirect('verify-tlevel-details-construction')
  } else {
    res.redirect('verify-tlevel-details-digital')
  }
})

router.post('/1-11/AO/which-details-to-show', function (req, res) {

  let tLevelName = req.session.data['tLevel-name']

  if (tLevelName === 'Construction: Design, Surveying and Planning') {
    res.redirect('verify-tlevel-details-construction')
  } else {
    res.redirect('verify-tlevel-details-digital')
  }
})

router.post('/1-12/AO/which-details-to-show', function (req, res) {

  let tLevelName = req.session.data['tLevel-name']

  if (tLevelName === 'Construction: Design, Surveying and Planning') {
    res.redirect('verify-tlevel-details-construction')
  } else {
    res.redirect('verify-tlevel-details-digital')
  }
})

router.post('/1-9/AO/confirm-removal-answer', function (req, res) {

  let tLevelAnswer = req.session.data['tLevel-answer']

  if (tLevelAnswer === 'Yes') {
    res.redirect('confirmation-tlevel-removed')
  } else {
    res.redirect('centre-details-existing')
  }
})

router.post('/1-10/AO/confirm-removal-answer', function (req, res) {

  let tLevelAnswer = req.session.data['tLevel-answer']

  if (tLevelAnswer === 'Yes') {
    res.redirect('confirmation-tlevel-removed')
  } else {
    res.redirect('centre-details-existing')
  }
})

router.post('/1-11/AO/confirm-removal-answer', function (req, res) {

  let tLevelAnswer = req.session.data['tLevel-answer']

  if (tLevelAnswer === 'Yes') {
    res.redirect('confirmation-tlevel-removed')
  } else {
    res.redirect('centre-details-existing')
  }
})

router.post('/1-12/AO/confirm-removal-answer', function (req, res) {

  let tLevelAnswer = req.session.data['tLevel-answer']

  if (tLevelAnswer === 'Yes') {
    res.redirect('confirmation-tlevel-removed')
  } else {
    res.redirect('centre-details-existing')
  }
})

router.post('/1-13/AO/confirm-cancel-answer', function (req, res) {

  let regAnswer = req.session.data['reg-answer']

  if (regAnswer === 'Yes') {
    res.redirect('confirmation-reg-cancelled')
  } else {
    res.redirect('registration-details-amend-options-active')
  }
})

router.post('/1-13/AO/confirm-withdraw-answer', function (req, res) {

  let regAnswer = req.session.data['withdraw-answer']

  if (regAnswer === 'Yes') {
    res.redirect('confirmation-reg-withdraw')
  } else {
    res.redirect('registration-details')
  }
})

router.post('/1-13/AO/confirm-spec-answer', function (req, res) {

  let regAnswer = req.session.data['spec-answer']

  if (regAnswer === 'Yes') {
    res.redirect('add-registration-q7b-specialism')
  } else {
    res.redirect('add-registration-q5a-year')
  }
})

router.post('/1-13/AO/confirm-spec-change', function (req, res) {

  let regAnswer = req.session.data['spec-answer']

  if (regAnswer === 'Yes') {
    res.redirect('change-specialism-b')
  } else {
    res.redirect('change-successful')
  }
})

router.post('/1-13/AO/change-spec-answer', function (req, res) {

  let regAnswer = req.session.data['spec-answer']

  if (regAnswer === 'Yes') {
    res.redirect('change-registration-q7b-specialism')
  } else {
    res.redirect('add-registration-q8-check')
  }
})

router.post('/1-13/AO/change-spec-value', function (req, res) {

  let regAnswer = req.session.data['spec-answer']

  if (regAnswer === 'Yes') {
    res.redirect('change-successful')
  } else {
    res.redirect('change-specialism-b')
  }
})

router.post('/1-13/AO/change-spec-value2', function (req, res) {

  let regAnswer = req.session.data['spec-answer']

  if (regAnswer === 'Yes') {
    res.redirect('add-registration-q8-check')
  } else {
    res.redirect('change-registration-q7b-specialism')
  }
})

router.post('/1-13/AO/confirm-rejoin-answer', function (req, res) {

  let regAnswer = req.session.data['rejoin-answer']

  if (regAnswer === 'Yes') {
    res.redirect('confirmation-reg-rejoin')
  } else {
    res.redirect('registration-details')
  }
})

router.post('/1-14/AO/confirm-delete-answer', function (req, res) {

  let regAnswer = req.session.data['reg-answer']

  if (regAnswer === 'Yes') {
    res.redirect('confirmation-reg-deleted')
  } else {
    res.redirect('registration-details-amend-options-active')
  }
})

router.post('/1-14/AO/confirm-withdraw-answer', function (req, res) {

  let regAnswer = req.session.data['withdraw-answer']

  if (regAnswer === 'Yes') {
    res.redirect('/1-14/AO/confirmation-reg-withdraw')
  } else {
    res.redirect('/1-14/AO/registration-details-amend-options-active')
  }
})

router.post('/1-15/AO/confirm-withdraw-answer', function (req, res) {

  let regAnswer = req.session.data['withdraw-answer']

  if (regAnswer === 'Yes') {
    res.redirect('/1-15/AO/confirmation-reg-withdraw')
  } else {
    res.redirect('/1-15/AO/registration-details-amend-options-active')
  }
})

router.post('/1-14/Research/confirm-rejoin-answer', function (req, res) {

  let regAnswer = req.session.data['rejoin-answer']

  if (regAnswer === 'Yes') {
    res.redirect('/1-14/Research/confirmation-reg-rejoin')
  } else {
    res.redirect('/1-14/Research/registration-details')
  }
})

router.post('/1-15/AO/confirm-rejoin-answer', function (req, res) {

  let regAnswer = req.session.data['rejoin-answer']

  if (regAnswer === 'Yes') {
    res.redirect('/1-15/AO/confirmation-reg-rejoin')
  } else {
    res.redirect('/1-15/AO/registration-details')
  }
})

router.post('/1-14/AO/confirm-spec-answer', function (req, res) {

  let regAnswer = req.session.data['spec-answer']

  if (regAnswer === 'Yes') {
    res.redirect('add-registration-q7b-specialism')
  } else {
    res.redirect('add-registration-q5a-year')
  }
})

router.post('/1-14/Research/confirm-spec-answer', function (req, res) {

  let regAnswer = req.session.data['spec-answer']

  if (regAnswer === 'Yes') {
    res.redirect('re-registration-q4-specialism')
  } else {
    res.redirect('re-registration-q5-year')
  }
})

router.post('/1-14/AO/rereg-confirm-spec-answer', function (req, res) {

  let regAnswer = req.session.data['spec-answer']

  if (regAnswer === 'Yes') {
    res.redirect('re-registration-q4-specialism')
  } else {
    res.redirect('re-registration-q5-year')
  }
})

router.post('/1-14/AO/rereg-change-spec-answer', function (req, res) {

  let regAnswer = req.session.data['spec-answer']

  if (regAnswer === 'Yes') {
    res.redirect('re-registration-change-q4-specialism')
  } else {
    res.redirect('re-registration-q6-check')
  }
})

router.post('/1-14/AO/confirm-spec-change', function (req, res) {

  let regAnswer = req.session.data['spec-answer']

  if (regAnswer === 'Yes') {
    res.redirect('change-specialism-b')
  } else {
    res.redirect('change-successful')
  }
})

router.post('/1-14/AO/change-spec-answer', function (req, res) {

  let regAnswer = req.session.data['spec-answer']

  if (regAnswer === 'Yes') {
    res.redirect('change-registration-q7b-specialism')
  } else {
    res.redirect('add-registration-q8-check')
  }
})

router.post('/1-14/AO/change-spec-value', function (req, res) {

  let regAnswer = req.session.data['spec-answer']

  if (regAnswer === 'Yes') {
    res.redirect('change-successful')
  } else {
    res.redirect('change-specialism-b')
  }
})

router.post('/1-14/AO/change-spec-value2', function (req, res) {

  let regAnswer = req.session.data['spec-answer']

  if (regAnswer === 'Yes') {
    res.redirect('add-registration-q8-check')
  } else {
    res.redirect('change-registration-q7b-specialism')
  }
})

router.post('/1-14/AO/confirm-rejoin-answer', function (req, res) {

  let regAnswer = req.session.data['rejoin-answer']

  if (regAnswer === 'Yes') {
    res.redirect('confirmation-reg-rejoin')
  } else {
    res.redirect('registration-details-amend-options-withdrawn')
  }
})

router.post('/1-14/Research/integrated/confirm-spec-answer', function (req, res) {

  let regAnswer = req.session.data['spec-answer']

  if (regAnswer === 'Yes') {
    res.redirect('add-registration-q7b-specialism')
  } else {
    res.redirect('add-registration-q9-add-entries')
  }
})

router.post('/1-14/Research/integrated/confirm-entry-answer', function (req, res) {

  let regAnswer = req.session.data['entry-answer']

  if (regAnswer === 'Yes') {
    res.redirect('add-registration-q10-core-entry')
  } else {
    res.redirect('add-registration-q5a-year')
  }
})

router.post('/1-14/Research/confirm-provider-answer', function (req, res) {

  let regAnswer = req.session.data['provider-answer']

  if (regAnswer === 'Yes') {
    res.redirect('change-provider-withdraw')
  } else {
    res.redirect('change-provider-pe')
  }
})

router.post('/1-14/AO/confirm-provider-answer', function (req, res) {

  let regAnswer = req.session.data['provider-answer']

  if (regAnswer === 'Yes') {
    res.redirect('change-provider-withdraw')
  } else {
    res.redirect('change-provider-pe')
  }
})

router.post('/1-14/AO/active-what-to-do', function (req, res) {

  let regAnswer = req.session.data['what-answer']

  if (regAnswer === 'withdraw') {
    res.redirect('withdraw-registration')
  } else {
    res.redirect('delete-registration')
  }
})

router.post('/1-15/AO/active-what-to-do', function (req, res) {

  let regAnswer = req.session.data['what-answer']

  if (regAnswer === 'withdraw') {
    res.redirect('withdraw-registration')
  } else {
    res.redirect('delete-registration')
  }
})

router.post('/1-14/AO/withdrawn-what-to-do', function (req, res) {

  let regAnswer = req.session.data['what-answer']

  if (regAnswer === 'rejoin') {
    res.redirect('rejoin-registration')
  }  if (regAnswer === 'reregister') {
      res.redirect('re-registration-q1-provider')
    } else {
    res.redirect('delete-registration')
  }
})

router.post('/1-15/AO/withdrawn-what-to-do', function (req, res) {

  let regAnswer = req.session.data['what-answer']

  if (regAnswer === 'rejoin') {
    res.redirect('rejoin-registration')
  }  if (regAnswer === 'reregister') {
      res.redirect('re-registration-q1-provider')
    } else {
    res.redirect('delete-registration')
  }
})

function checkIfActive(req) {
    if (req.session.data['activeFlag'] == undefined || req.session.data['activeFlag'] == false) {
        initialiseVariables(req)
    }
    return
}

router.get('/1-5/AO/act-ao-view-providers', function (req, res) {
    require('./routes/routes-1-5.js')(router)
    req.session.data['ao-long'] = "Pearson (RN5133)"
    req.session.data['ao-long'] = "NCFE (RN5156)"
    req.session.data['ao'] = "NCFE"
    checkIfActive(req)
    req.session.save()
    res.render('1-5/AO/ao-view-providers')
})

router.get('/1-5/AO/goto-random-provider-add', function (req, res) {
    require('./routes/routes-1-5.js')(router)
    req.session.data['ao-long'] = "Pearson (RN5133)"
    req.session.data['ao'] = "Pearson"
    checkIfActive(req)
    res.redirect('/1-5/AO/action-ao-providers')
})

router.get('/1-4/AO/act-ao-view-providers', function (req, res) {
    require('./routes/routes-1-4.js')(router)
    req.session.data['ao-long'] = "Pearson (RN5133)"
    req.session.data['ao-long'] = "NCFE (RN5156)"
    req.session.data['ao'] = "NCFE"
    checkIfActive(req)
    req.session.save()
    res.render('1-4/AO/ao-view-providers')
})

router.get('/1-4/AO/goto-random-provider-add', function (req, res) {
    require('./routes/routes-1-4.js')(router)
    req.session.data['ao-long'] = "Pearson (RN5133)"
    req.session.data['ao'] = "Pearson"
    checkIfActive(req)
    res.redirect('/1-4/AO/action-ao-providers')
})

router.get('/1-3/AO/act-ao-view-providers', function (req, res) {
    require('./routes/routes-1-3.js')(router)
    req.session.data['ao-long'] = "Pearson (RN5133)"
    req.session.data['ao'] = "Pearson"
    checkIfActive(req)
    req.session.save()
    res.render('1-3/AO/ao-view-providers')
})

router.get('/1-3/AO/goto-random-provider-add', function (req, res) {
    require('./routes/routes-1-3.js')(router)
    req.session.data['ao-long'] = "Pearson (RN5133)"
    req.session.data['ao'] = "Pearson"
    checkIfActive(req)
    res.redirect('/1-3/AO/action-ao-providers')
})

router.get('/1-0/Verification/sign-in', function (req, res) {
    require('./routes/routes-1-0.js')(router)
    checkIfActive(req)
    res.render('1-0/Verification/sign-in')
})

router.get('/1-1/Verification/sign-in', function (req, res) {
    require('./routes/routes-1-1.js')(router)
    checkIfActive(req)
    res.render('1-1/Verification/sign-in')
})

router.get('/1-2/Verification/sign-in', function (req, res) {
    require('./routes/routes-1-2.js')(router)
    // req.session.data['ao-long'] = "Pearson (RN5133)"
    req.session.data['ao-long'] = "NCFE (RN5156)"
    //req.session.data['ao-long'] = "City and Guilds (RN5217)"
    req.session.data['ao'] = req.session.data['ao-long'].split(' (')[0]
    checkIfActive(req)
    res.render('1-2/Verification/sign-in')
})

router.get('/1-3/Verification/sign-in', function (req, res) {
    require('./routes/routes-1-3.js')(router)
    var AO = req.query['ao']
    if (AO === 'ncfe') {
        req.session.data['ao-long'] = "NCFE (RN5156)"
        req.session.data['ao'] = "NCFE"
    } else if (AO === 'pearson') {
        req.session.data['ao-long'] = "Pearson (RN5133)"
        req.session.data['ao'] = "Pearson"
    } else if (AO === 'cg') {
        req.session.data['ao-long'] = "City and Guilds (RN5217)"
        req.session.data['ao'] = "City and Guilds"
    }
    checkIfActive(req)
    res.render('1-3/Verification/sign-in')
})

router.get('/1-4/Verification/sign-in', function (req, res) {
    require('./routes/routes-1-4.js')(router)
    var AO = req.query['ao']
    if (AO === 'ncfe') {
        req.session.data['ao-long'] = "NCFE (RN5156)"
        req.session.data['ao'] = "NCFE"
    } else if (AO === 'pearson') {
        req.session.data['ao-long'] = "Pearson (RN5133)"
        req.session.data['ao'] = "Pearson"
    } else if (AO === 'cg') {
        req.session.data['ao-long'] = "City and Guilds (RN5217)"
        req.session.data['ao'] = "City and Guilds"
    }
    checkIfActive(req)
    res.render('1-4/Verification/sign-in')
})

router.get('/1-5/Verification/sign-in', function (req, res) {
    require('./routes/routes-1-5.js')(router)
    var AO = req.query['ao']
    if (AO === 'ncfe') {
        req.session.data['ao-long'] = "NCFE (RN5156)"
        req.session.data['ao'] = "NCFE"
    } else if (AO === 'pearson') {
        req.session.data['ao-long'] = "Pearson (RN5133)"
        req.session.data['ao'] = "Pearson"
    } else if (AO === 'cg') {
        req.session.data['ao-long'] = "City and Guilds (RN5217)"
        req.session.data['ao'] = "City and Guilds"
    }
    checkIfActive(req)
    res.render('1-5/Verification/sign-in')
})

router.get('/1-6/AO/tlevels-prototype-setup', function (req, res) {
    require('./routes/routes-1-6.js')(router)
    req.session.data['ao'] = null
    req.session.data['selected_organisation'] = null
    req.session.data['selected_role'] = null
    checkIfActive(req)
    res.render('1-6/AO/tlevels-prototype-setup')
})

router.get('/1-3/Verification/google-home', function (req, res) {
    require('./routes/routes-1-3.js')(router)
    var AO = req.query['ao']
    if (AO === 'ncfe') {
        req.session.data['ao-long'] = "NCFE (RN5156)"
        req.session.data['ao'] = "NCFE"
    } else if (AO === 'pearson') {
        req.session.data['ao-long'] = "Pearson (RN5133)"
        req.session.data['ao'] = "Pearson"
    } else if (AO === 'cg') {
        req.session.data['ao-long'] = "City and Guilds (RN5217)"
        req.session.data['ao'] = "City and Guilds"
    }
    checkIfActive(req)
    res.render('1-3/Verification/google-home')
})

router.get('/1-4/Verification/google-home', function (req, res) {
    require('./routes/routes-1-4.js')(router)
    var AO = req.query['ao']
    if (AO === 'ncfe') {
        req.session.data['ao-long'] = "NCFE (RN5156)"
        req.session.data['ao'] = "NCFE"
    } else if (AO === 'pearson') {
        req.session.data['ao-long'] = "Pearson (RN5133)"
        req.session.data['ao'] = "Pearson"
    } else if (AO === 'cg') {
        req.session.data['ao-long'] = "City and Guilds (RN5217)"
        req.session.data['ao'] = "City and Guilds"
    }
    checkIfActive(req)
    res.render('1-4/Verification/google-home')
})

router.get('/1-5/Verification/google-home', function (req, res) {
    require('./routes/routes-1-5.js')(router)
    var AO = req.query['ao']
    if (AO === 'ncfe') {
        req.session.data['ao-long'] = "NCFE (RN5156)"
        req.session.data['ao'] = "NCFE"
    } else if (AO === 'pearson') {
        req.session.data['ao-long'] = "Pearson (RN5133)"
        req.session.data['ao'] = "Pearson"
    } else if (AO === 'cg') {
        req.session.data['ao-long'] = "City and Guilds (RN5217)"
        req.session.data['ao'] = "City and Guilds"
    }
    checkIfActive(req)
    res.render('1-5/Verification/google-home')
})

router.post('/1-3/Verification/action-verify-code', function (req, res) {
    if (req.session.data['verification-code'] != '9191') {
        // Mark up errors
        res.redirect('/1-3/Verification/verify-confirm-email')
    } else {
        res.redirect('/1-3/Verification/create-password')
    }
})

router.post('/1-4/Verification/action-verify-code', function (req, res) {
    if (req.session.data['verification-code'] != '9191') {
        // Mark up errors
        res.redirect('/1-4/Verification/verify-confirm-email')
    } else {
        res.redirect('/1-4/Verification/create-password')
    }
})

router.post('/1-5/Verification/action-verify-code', function (req, res) {
    if (req.session.data['verification-code'] != '9191') {
        // Mark up errors
        res.redirect('/1-5/Verification/verify-confirm-email')
    } else {
        res.redirect('/1-5/Verification/create-password')
    }
})

router.post('/1-2/AO/hub', function (req, res) {
    if (req.session.data['Signin-username'] === 'admin') {
        req.session.data['staff-role'] = 'admin'
    } else {
        req.session.data['staff-role'] = 'staff'
    }
    checkIfActive(req)
    res.redirect('/1-2/AO/hub')
})

router.post('/1-3/AO/hub', function (req, res) {
    if (req.session.data['Signin-username'] === 'admin') {
        req.session.data['staff-role'] = 'admin'
    } else {
        req.session.data['staff-role'] = 'staff'
    }
    checkIfActive(req)
    res.redirect('/1-3/AO/hub')
})

router.post('/1-4/AO/hub', function (req, res) {
    if (req.session.data['Signin-username'] === 'admin') {
        req.session.data['staff-role'] = 'admin'
    } else {
        req.session.data['staff-role'] = 'staff'
    }
    checkIfActive(req)
    res.redirect('/1-4/AO/hub')
})

router.post('/1-5/AO/hub', function (req, res) {
    if (req.session.data['Signin-username'] === 'admin') {
        req.session.data['staff-role'] = 'admin'
    } else {
        req.session.data['staff-role'] = 'staff'
    }
    checkIfActive(req)
    res.redirect('/1-5/AO/hub')
})

router.get('/1-2/Verification/action-view-account', function (req, res) {
    id = req.query.id
    // Ensure service removal panel isn't show
    req.session.data['show-removal-confirm'] = false
    req.session.data['delete-service'] = ""
    // Ensure service addition panel isn't show
    req.session.data['show-addition-confirm'] = false
    req.session.data['add-service'] = ""
    for (account in req.session.data['accounts']) {
        if (req.session.data['accounts'][account][0] === id) {
            req.session.data['accountHolder'] = req.session.data['accounts'][account]
        }
    }
    res.redirect('/1-2/Verification/view-account')
})

router.post('/1-2/Verification/action-view-account', function (req, res) {
    id = req.query.id

    if (req.session.data['delete-service'] == "delete") {
        req.session.data['delete-service'] = ""
        req.session.data['show-removal-confirm'] = true
        req.session.data['show-addition-confirm'] = false
    } else {
        req.session.data['show-removal-confirm'] = false
        req.session.data['delete-service'] = ""
    }

    if (req.session.data['add-service'] == "add") {
        req.session.data['add-service'] = ""
        req.session.data['show-addition-confirm'] = true
        req.session.data['show-removal-confirm'] = false
    } else {
        req.session.data['show-addition-confirm'] = false
        req.session.data['add-service'] = ""
    }

    for (account in req.session.data['accounts']) {
        if (req.session.data['accounts'][account][0] === id) {
            req.session.data['accountHolder'] = req.session.data['accounts'][account]
        }
    }
    req.session.data['first-name'] = undefined
    req.session.data['last-name'] = undefined
    req.session.data['email-address'] = undefined
    res.redirect('/1-2/Verification/view-account')
})

router.get('/1-2/Verification/my-profile', function (req, res) {
    req.session.data['profile-details-flag'] = false
    req.session.data['profile-email-flag'] = false
    req.session.data['profile-password-flag'] = false
    res.render('1-2/Verification/my-profile')
})

router.post('/1-2/Verification/my-profile', function (req, res) {
    req.session.data['profile-details-flag'] = false
    req.session.data['profile-email-flag'] = false
    req.session.data['profile-password-flag'] = false
    res.render('1-2/Verification/my-profile')
})

router.post('/1-2/Verification/action-my-profile', function (req, res) {
    if (req.session.data['profile-details'] == 'change') {
        req.session.data['profile-details'] = ""
        req.session.data['profile-email'] = ""
        req.session.data['profile-password'] = ""
        req.session.data['profile-details-flag'] = true
    } else {
        req.session.data['profile-details'] = ""
        req.session.data['profile-details-flag'] = false
    }

    if (req.session.data['profile-email'] == 'change') {
        req.session.data['profile-details'] = ""
        req.session.data['profile-email'] = ""
        req.session.data['profile-password'] = ""
        req.session.data['profile-email-flag'] = true
    } else {
        req.session.data['profile-email'] = ""
        req.session.data['profile-email-flag'] = false
    }

    if (req.session.data['profile-password'] == 'change') {
        req.session.data['profile-details'] = ""
        req.session.data['profile-email'] = ""
        req.session.data['profile-password'] = ""
        req.session.data['profile-password-flag'] = true
    } else {
        req.session.data['profile-password'] = ""
        req.session.data['profile-password-flag'] = false
    }

    res.redirect('/1-2/Verification/my-profile')
})

router.post('/1-18/Research/action-q1-check', function (req, res) {

  let detAnswer = req.session.data['q1-answer']

  if (detAnswer === 'Yes') {
    res.redirect('q2-quals')
  } else {
    res.redirect('q1-learners-details-no')
  }
})

router.post('/1-18/Research/action-q2-check', function (req, res) {

  let detAnswer = req.session.data['q2-answer']

  if (detAnswer === 'Yes') {
    res.redirect('q3-tq-components')
  } else {
    res.redirect('q2-quals-no')
  }
})

router.post('/1-18/Research/action-q3-check', function (req, res) {

  let detAnswer = req.session.data['q3-answer']

  if (detAnswer === 'Yes') {
    res.redirect('q4-address')
  } else {
    res.redirect('q3-tq-components-no')
  }
})

router.post('/1-18/Research/action-q4-check', function (req, res) {

  let detAnswer = req.session.data['q4-answer']

  if (detAnswer === 'Yes') {
    res.redirect('q5-check')
  } else {
    res.redirect('q4-address-no')
  }
})


// 1-19 routes

// full results - reviews and appeals 2022 onwards
router.get('/1-19/dynamic/record-entries-routes', function(req, res) {

  let uln = req.session.data['uln-search']

  if (uln === '1234567890') {
    res.render('1-19/dynamic/record-entries-routes', 
    {
    'uln' : uln,
    'name' : 'John Smith',
    'dob' : '12 December 2005',
    'provider' : 'Barnsley College (10000536)',
    'tlevelTitle' : 'Design, Surveying and Planning for Construction',
    'coreGrade' : 'C',
    'core' : 'Design, Surveying and Planning (60358300)',
    'coreOnHold' : req.session.data['core-place-on-hold'],
    'coreResult' : "Winter 2021",
    'coreUpdate' : "4 May 2021",
    'specialism' : 'Building Services Design (ZTLOS003)',
    'specialismResults' : "Winter 2021",       
    'specialismGrade' : 'Merit',
    'specialismUpdate' : "4 May 2021",

    'specialismOnHold' : req.session.data['specialism-place-on-hold'],
  })
    req.session.data['name'] = 'John Smith'
    req.session.data['provider'] = 'Barnsley College (10000536)'
    req.session.data['dob'] = '12 December 2004'
    req.session.data['tlevelTitle'] = 'Design, Surveying and Planning for Construction'
    req.session.data['coreGrade'] = "C"
    req.session.data['uln'] = uln
    req.session.data['core'] = "Design, Surveying and Planning (60358300)"
    req.session.data['coreResult'] = "Winter 2021"
    req.session.data['coreOnHold'] = ""
    req.session.data['specialism'] = "Building Services Design (ZTLOS003)"
    req.session.data['specialismOnHold'] = ""
    req.session.data['specialismResults'] = "Winter 2021"
    req.session.data['showBanner'] = "no"
    req.session.data['specialismGrade'] = 'Merit'
  ;

// full results - appeals process only (2021)  
} else if (uln === '0987654321') {
  res.render('1-19/dynamic/record-entries-routes', 
  { 
    'uln' : uln,
    'name' : 'Ted Hastings',
    'dob' : '24 December 2002',
    'provider' : 'Barnsley College (10000536)',
    'tlevelTitle' : 'Design, Surveying and Planning for Construction',
    'coreGrade' : 'C',
    'core' : 'Design, Surveying and Planning (60358300)',
    'coreOnHold' : req.session.data['core-place-on-hold'],
    'coreResult' : "Winter 2021",
    'coreUpdate' : "4 May 2021",
    'coreReviewed' : req.session.data['coreReviewed'],
    'specialism' : 'Building Services Design (ZTLOS003)',
    'specialismResults' : "Winter 2021",       
    'specialismGrade' : 'Merit',
    'specialismUpdate' : "4 May 2021",
    'specialismReviewed' : req.session.data['specialismReviewed'],
    'specialismOnHold' : req.session.data['specialism-place-on-hold'],
  })
    req.session.data['name'] = 'Ted Hastings'
    req.session.data['provider'] = 'Barnsley College (10000536)'
    req.session.data['dob'] = '24 December 2002'
    req.session.data['tlevelTitle'] = 'Design, Surveying and Planning for Construction'
    req.session.data['coreGrade'] = 'C'
    req.session.data['uln'] = uln
    req.session.data['core'] = "Design, Surveying and Planning (60358300)"
    req.session.data['coreResult'] = "Winter 2021"
    req.session.data['coreOnHold'] = ""
    req.session.data['coreReviewed'] = ""
    req.session.data['specialism'] = "Building Services Design (ZTLOS003)"
    req.session.data['specialismOnHold'] = ""
    req.session.data['specialismResults'] = "Winter 2021"
    req.session.data['specialismReviewed'] = ""
    req.session.data['specialismGrade'] = 'Merit'
    req.session.data['showBanner'] = "no"
  ;

  // core and specialism specified but no grades yet
  } else if (uln === '5678901234') {
    res.render('1-19/dynamic/record-entries-routes', 
    { 
      'name' : 'Tanner Ball', 
      'uln' : '5678901234', 
      'dob' : '15 April 2004', 
      'provider' : 'Abingdon and Witney College (10000055)',
      'tlevelTitle' : 'Design, Surveying and Planning for Construction',
      'core' : 'Design, Surveying and Planning (60358300)',
      'coreResult' : "Summer 2021",
      'coreGrade' : '-',
      'coreOnHold' : req.session.data['core-place-on-hold'],
      'specialism' : 'Building Services Design (ZTLOS003)',
      'specialismResults' : "Summer 2021",    
      'specialismGrade' : '-',
      'specialismOnHold' : req.session.data['specialism-place-on-hold'],
    })
    ;
  
  // learner has core with no grades yet and specialism not yet specified  
  } else if (uln === '4321987650') {
    res.render('1-19/dynamic/record-entries-routes', 
    { 
      'name' : 'Ian Buckells', 
      'uln' : '4321987650', 
      'dob' : '15 April 2004', 
      'provider' : 'Abingdon and Witney College (10000055)',
      'tlevelTitle' : 'Design, Surveying and Planning for Construction',
      'core' : 'Design, Surveying and Planning (60358300)',
      'coreResult' : "Summer 2021",
      'coreGrade' : '-',
      'coreOnHold' : req.session.data['core-place-on-hold'],
      'specialism' : 'Not yet specified',
      'specialismResults' : "-",    
      'specialismGrade' : '-',
      'specialismOnHold' : req.session.data['specialism-place-on-hold'],
    })
    ;

  //too late to review and or appeal results
  } else if (uln === '5647382910') {
    res.render('1-19/dynamic/record-entries-routes', 
    { 
      'name' : 'Steve Rogers', 
      'uln' : '5647382910', 
      'dob' : '15 April 2004', 
      'provider' : 'Abingdon and Witney College (10000055)',
      'tlevelTitle' : 'Design, Surveying and Planning for Construction',
      'core' : 'Design, Surveying and Planning (60358300)',
      'coreResult' : "Winter 2021",
      'coreGrade' : 'C',
      'specialism' : 'Building Services Design (ZTLOS003)',
      'specialismResults' : "Winter 2021",    
      'specialismGrade' : 'Merit',
      'coreOnHold' : req.session.data['core-place-on-hold'],
      'specialismOnHold' : req.session.data['specialism-place-on-hold'],
    })
    ;
  // learner withdrawn  

  } else if (uln === '1231231234') {
    req.session.data['uln'] = uln
    req.session.data['name'] = 'Jo Davidson'
    req.session.data['provider'] = 'Barnsley College (10000536)'
    req.session.data['dob'] = '24 December 2004'
    req.session.data['tlevelTitle'] = 'Design, Surveying and Planning for Construction'
    res.redirect('learner-withdrawn')
  
  //learner not found 
  }else {
    req.session.data['uln'] = uln
    res.redirect('no-learner-found')
  }
  
});

router.post('/1-19/dynamic/core-put-on-hold', function (req, res) {

  let coreOnHold = req.session.data['core-place-on-hold']


  if (coreOnHold === 'yes') {
    req.session.data['newcoreOnHold'] = 'yes'
    req.session.data['dateChanged'] = 'yes'
    req.session.data['showBanner'] = "yes"
    
    res.redirect('/1-19/dynamic/record-entries-routes')
  } else {
    req.session.data['coreOnHold'] = 'no'
    res.redirect('/1-19/dynamic/record-entries-routes')
  }
})

router.post('/1-19/dynamic/specialism-put-on-hold', function (req, res) {

  let specialismOnHold = req.session.data['specialism-place-on-hold']
  
  if (specialismOnHold === 'yes') {
    req.session.data['newspecialismOnHold'] = 'yes'
    req.session.data['specialismdateChanged'] = 'yes'
    req.session.data['showBanner'] = "yes"
    req.session.data['showspecialismBanner'] = "yes"
 
    

    res.redirect('/1-19/dynamic/record-entries-routes')
  } else {
    req.session.data['specialismOnHold'] = 'no'
    res.redirect('/1-19/dynamic/record-entries-routes')
  }
})

router.post('/1-19/dynamic/core-put-on-appeal', function (req, res) {

  let coreOnHold = req.session.data['core-place-on-appeal']
//yes is being appealed
  if (coreOnHold === 'yes') {
    req.session.data['newcoreOnHold'] = 'appealed'
    req.session.data['dateChanged'] = 'yes'
    req.session.data['showBanner'] = "yes"

    res.redirect('/1-19/dynamic/record-entries-routes')
  
// no not being appealed - leave with no tag or corrected tag if applicable  
  } else {
    res.redirect('/1-19/dynamic/record-entries-routes')
  }
})

router.post('/1-19/dynamic/specialism-put-on-appeal', function (req, res) {

  let specialismOnHold = req.session.data['specialism-place-on-appeal']
//yes is being appealed
  if (specialismOnHold === 'yes') {
    req.session.data['newspecialismOnHold'] = 'appealed'
    req.session.data['specialismdateChanged'] = 'yes'
    req.session.data['showBanner'] = "yes"

    res.redirect('/1-19/dynamic/record-entries-routes')

// no not being appealed - leave with no tag or corrected tag if applicable      
  } else {
    
    res.redirect('/1-19/dynamic/record-entries-routes')
  }
})


//2021 core put on appeal
router.post('/1-19/dynamic/core-put-on-appeal-2021', function (req, res) {

  let coreOnHold = req.session.data['core-place-on-appeal-2021']
//yes is being appealed
  if (coreOnHold === 'yes') {
    req.session.data['newcoreOnHold2021'] = 'appealed'
    req.session.data['dateChanged2021'] = 'yes'
    req.session.data['showBanner'] = "yes"

    res.redirect('/1-19/dynamic/record-entries-routes')
  
// no not being appealed - leave with no tag or corrected tag if applicable  
  } else {
    res.redirect('/1-19/dynamic/record-entries-routes')
  }
})


//2021 specialism put on appeal
router.post('/1-19/dynamic/specialism-put-on-appeal-2021', function (req, res) {

  let specialismOnHold = req.session.data['specialism-place-on-appeal-2021']
//yes is being appealed
  if (specialismOnHold === 'yes') {
    req.session.data['newspecialismOnHold2021'] = 'appealed'
    req.session.data['specialismdateChanged2021'] = 'yes'
    req.session.data['showBanner'] = "yes"

    res.redirect('/1-19/dynamic/record-entries-routes')

// no not being appealed - leave with no tag or corrected tag if applicable      
  } else {
    
    res.redirect('/1-19/dynamic/record-entries-routes')
  }
})



router.post('/1-19/dynamic/core-take-off-hold', function (req, res) {

  let coreOnHold = req.session.data['core-take-off-hold']
//No I need to update status
  if (coreOnHold === 'no') {
    res.redirect('/1-19/dynamic/has-result-changed')
//Yes still under review    
  } else {
    req.session.data['newcoreOnHold'] = 'yes'
    res.redirect('/1-19/dynamic/record-entries-routes')
  }
})

router.post('/1-19/dynamic/specialism-take-off-hold', function (req, res) {

  let specialismOnHold = req.session.data['specialism-take-off-hold']
//No I need to update status
  if (specialismOnHold === 'no') {
    res.redirect('/1-19/dynamic/specialism-has-result-changed')
//Yes still under review     
  } else {
    req.session.data['specialismOnHold'] = 'yes'
    res.redirect('/1-19/dynamic/record-entries-routes')
  }
})


router.post('/1-19/dynamic/core-take-off-appeal', function (req, res) {

  let coreOnHold = req.session.data['core-take-off-appeal']
//I need to update status
  if (coreOnHold === 'update') {
    res.redirect('/1-19/dynamic/change-core-result-appeal')
//Result the same - back to record - final tag   
  } else {
    req.session.data['newcoreOnHold'] = 'final'
    req.session.data['coreReviewed'] = 'appealed'
    req.session.data['dateChanged'] = 'yes'
    req.session.data['showBanner'] = "yes"

    res.redirect('/1-19/dynamic/record-entries-routes')
  }
})


router.post('/1-19/dynamic/specialism-take-off-appeal', function (req, res) {

  let specialismOnHold = req.session.data['specialism-take-off-appeal']
//I need to update status
  if (specialismOnHold === 'update') {
    res.redirect('/1-19/dynamic/change-specialism-result-appeal')
//Result the same - back to record - final tag    
  } else {
    req.session.data['newspecialismOnHold'] = 'final'
    req.session.data['specialismReviewed'] = 'appealed'
    req.session.data['specialismdateChanged'] = 'yes'
    req.session.data['showBanner'] = "yes"
 
    res.redirect('/1-19/dynamic/record-entries-routes')
  }
})


// 2021 core take off appeal
router.post('/1-19/dynamic/core-take-off-appeal-2021', function (req, res) {

  let coreOnHold = req.session.data['core-take-off-appeal-2021']
//I need to update status
  if (coreOnHold === 'update') {
    res.redirect('/1-19/dynamic/change-core-result-appeal-2021')
//Result the same - back to record - final tag   
  } else {
    req.session.data['newcoreOnHold2021'] = 'final'
    req.session.data['coreReviewed2021'] = 'appealed'
    req.session.data['dateChanged2021'] = 'yes'
    req.session.data['showBanner'] = "yes"

    res.redirect('/1-19/dynamic/record-entries-routes')
  }
})

// 2021 specialism take off appeal
router.post('/1-19/dynamic/specialism-take-off-appeal-2021', function (req, res) {

  let specialismOnHold = req.session.data['specialism-take-off-appeal-2021']
//I need to update status
  if (specialismOnHold === 'update') {
    res.redirect('/1-19/dynamic/change-specialism-result-appeal-2021')
//Result the same - back to record - final tag    
  } else {
    req.session.data['newspecialismOnHold2021'] = 'final'
    req.session.data['specialismReviewed2021'] = 'appealed'
    req.session.data['specialismdateChanged2021'] = 'yes'
    req.session.data['showBanner'] = "yes"
 
    res.redirect('/1-19/dynamic/record-entries-routes')
  }
})



router.post('/1-19/dynamic/has-result-changed', function (req, res) {

  let resultChanged = req.session.data['result-answer']

  //Result the same - back to record - no tag & reviewed marked as yes
  if (resultChanged === 'option1') {
    req.session.data['newcoreOnHold'] = ''
    req.session.data['coreReviewed'] = 'yes'
    req.session.data['dateChanged'] = 'yes'
    req.session.data['showBanner'] = "yes"


    res.redirect('/1-19/dynamic/record-entries-routes')

  //Component now being appealed - back to record - being appealed tag
  } else if (resultChanged === 'option3') {  
    req.session.data['newcoreOnHold'] = 'appealed'
    req.session.data['dateChanged'] = 'yes'
    req.session.data['showBanner'] = "yes"
  

    res.redirect('/1-19/dynamic/record-entries-routes')
  
  //Result changed  
  } else {
    req.session.data['resultChanged'] = 'yes'
    res.redirect('/1-19/dynamic/change-core-result')
  }
})

router.post('/1-19/dynamic/specialism-has-result-changed', function (req, res) {

  let resultChanged = req.session.data['specialism-result-answer']

 //Result the same - back to record - no tag & reviewed marked as yes
 if (resultChanged === 'option1') {
  req.session.data['newspecialismOnHold'] = ''
  req.session.data['specialismReviewed'] = 'yes'
  req.session.data['specialismdateChanged'] = 'yes'
  req.session.data['showBanner'] = "yes"
  

  res.redirect('/1-19/dynamic/record-entries-routes')

//Component now being appealed - back to record - being appealed tag
} else if (resultChanged === 'option3') {  
  req.session.data['newspecialismOnHold'] = 'appealed'
  req.session.data['specialismdateChanged'] = 'yes'
  req.session.data['showBanner'] = "yes"
 

  res.redirect('/1-19/dynamic/record-entries-routes')

  //Result changed    
  } else {
    req.session.data['specialismResultChanged'] = 'yes'
    res.redirect('/1-19/dynamic/change-specialism-result')
  }
})

router.post('/1-19/dynamic/confirm-result-change', function (req, res) {
  
  let newResult = req.session.data['result-answer']
  req.session.data['newcoreGrade'] = newResult
  req.session.data['newcoreOnHold'] = 'corrected'
  req.session.data['coreReviewed'] = 'yes'
  req.session.data['dateChanged'] = 'yes'
  req.session.data['showBanner'] = "yes"
 
  res.redirect('/1-19/dynamic/record-entries-routes')

})

router.post('/1-19/dynamic/specialism-confirm-result-change', function (req, res) {
  
  let newResult = req.session.data['specialism-result-answer']
  req.session.data['newspecialismGrade'] = newResult
  req.session.data['specialismResultChanged'] = 'yes'
  req.session.data['newspecialismOnHold'] = 'corrected'
  req.session.data['specialismReviewed'] = 'yes'
  req.session.data['specialismdateChanged'] = 'yes'
  req.session.data['showBanner'] = "yes"
 
  res.redirect('/1-19/dynamic/record-entries-routes')

})

router.post('/1-19/dynamic/confirm-result-change-appeal', function (req, res) {
  
  let newResult = req.session.data['result-answer']
  req.session.data['resultChanged'] = 'appeal'
  req.session.data['appealcoreGrade'] = newResult
  req.session.data['newcoreOnHold'] = 'final'
  req.session.data['coreReviewed'] = 'appealed'
  req.session.data['dateChanged'] = 'yes'
  req.session.data['showBanner'] = "yes"
 
  res.redirect('/1-19/dynamic/record-entries-routes')

})

router.post('/1-19/dynamic/specialism-confirm-result-change-appeal', function (req, res) {
  
  let newResult = req.session.data['specialism-result-answer']
  req.session.data['specialismResultChanged'] = 'appeal'
  req.session.data['appealspecialismGrade'] = newResult
  req.session.data['newspecialismOnHold'] = 'final'
  req.session.data['specialismReviewed'] = 'appealed'
  req.session.data['specialismdateChanged'] = 'yes'
  req.session.data['showBanner'] = "yes"
 
  res.redirect('/1-19/dynamic/record-entries-routes')

})


//2021 core grade changed appeal
router.post('/1-19/dynamic/confirm-result-change-appeal-2021', function (req, res) {
  
  let newResult = req.session.data['result-answer-2021']
  req.session.data['resultChanged2021'] = 'appeal'
  req.session.data['appealcoreGrade2021'] = newResult
  req.session.data['newcoreOnHold2021'] = 'final'
  req.session.data['coreReviewed2021'] = 'appealedgrade'
  req.session.data['dateChanged2021'] = 'yes'
  req.session.data['showBanner'] = "yes"
 
  res.redirect('/1-19/dynamic/record-entries-routes')

})

//2021 specialism grade changed appeal
router.post('/1-19/dynamic/specialism-confirm-result-change-appeal-2021', function (req, res) {
  
  let newResult = req.session.data['specialism-result-answer-2021']
  req.session.data['specialismResultChanged2021'] = 'appeal'
  req.session.data['appealspecialismGrade2021'] = newResult
  req.session.data['newspecialismOnHold2021'] = 'final'
  req.session.data['specialismReviewed2021'] = 'appealedgrade'
  req.session.data['specialismdateChanged2021'] = 'yes'
  req.session.data['showBanner'] = "yes"
 
  res.redirect('/1-19/dynamic/record-entries-routes')

})



// 1-20 routes
router.get('/1-20/dynamic/request-statement-of-achievement-check-and-submit', function(req, res) {

  let uln = req.session.data['uln-search']

  if (uln === '1234567890') {
    res.render('1-20/dynamic/request-statement-of-achievement-check-and-submit', 
    {
    'uln' : uln,
    'name' : 'John Smith',
    'dob' : '12 June 2004',
    'provider' : 'Barnsley College (10000536)',
    'coreGrade' : 'Grade: A',
    'engMaths' : 'Achieved minimum standard',
    'industryPlacement' : 'Not completed',
    'tlevelTitle' : 'Design, Surveying and Planning for Construction',
    'core' : 'Design, Surveying and Planning for Construction (60358300)',
    'specialism' : 'Building Services Design (ZTLOS003)',     
    'specialismGrade' : 'Grade: None',
    'department' : 'Exams Office',
    'orgName' : 'Barnsley Academy',
    'orgBuilding' : 'Main Block',
    'orgStreet' : 'Farm Rd',
    'orgCity' : 'Barnsley',
    'orgPostcode' : 'S70 3DL',
  })
    req.session.data['name'] = 'John Smith'
    req.session.data['provider'] = 'Barnsley College (10000536)'
    req.session.data['dob'] = '12 June 2004'
    req.session.data['coreGrade'] = 'Grade: A'
    req.session.data['engMaths'] = 'Achieved minimum standard'
    req.session.data['industry'] = 'Not completed'
    req.session.data['tlevelTitle'] = 'Design, Surveying and Planning for Construction'
    req.session.data['uln'] = uln
    req.session.data['core'] = "Design, Surveying and Planning for Construction (60358300)"
    req.session.data['specialism'] = "Building Services Design (ZTLOS003)"
    req.session.data['specialismGrade'] = 'Grade: None'
    req.session.data['department'] = 'Exams Office'
    req.session.data['orgName'] = "Barnsley Academy"
    req.session.data['orgBuilding'] = "Main Block"
    req.session.data['orgStreet'] = "Farm Rd"
    req.session.data['orgCity'] = 'Barnsley'
    req.session.data['orgPostcode'] = 'S70 3DL'
    
  ;

} else if (uln === '5678901234') {
  res.render('1-20/dynamic/request-statement-of-achievement-check-and-submit', 
  {
  'uln' : uln,
  'name' : 'Tanner Ball',
  'dob' : '15 April 2004',
  'provider' : 'Barnsley College (10000536)',
  'engMaths' : 'Not achieved minimum standard',
  'industryPlacement' : 'Not completed',
  'tlevelTitle' : 'Design, Surveying and Planning for Construction',
  'core' : 'Design, Surveying and Planning for Construction (60358300)',
  'coreGrade' : 'None',
  'specialism' : 'Not specified',     
  'specialismGrade' : 'Grade: None',
  'department' : 'Exams Office',
  'orgName' : 'Barnsley College',
  'orgBuilding' : 'Cheylesmore House',
  'orgStreet' : 'Church St',
  'orgCity' : 'Barnsley',
  'orgPostcode' : 'S70 2AX',
  })

  req.session.data['name'] = 'Tanner Ball'
  req.session.data['uln'] = uln
  req.session.data['coreGrade'] = 'Grade: C'
  req.session.data['engMaths'] = 'Achieved minimum standard'
  req.session.data['industry'] = 'Not completed'
  req.session.data['tlevelTitle'] = 'Design, Surveying and Planning for Construction'
  req.session.data['core'] = "Design, Surveying and Planning for Construction (60358300)"
  req.session.data['coreGrade'] = 'Grade: None'
  req.session.data['specialism'] = "Not specified"
  req.session.data['specialismGrade'] = 'Grade: None'
  req.session.data['department'] = 'Exams Office'
  req.session.data['orgName'] = "Barnsley College"
  req.session.data['orgBuilding'] = "Cheylesmore House"
  req.session.data['orgStreet'] = "Church St"
  req.session.data['orgCity'] = 'Barnsley'
  req.session.data['orgPostcode'] = 'S70 2AX'
  ;
} else if (uln === '5647382910') {

  req.session.data['name'] = 'Sheldon Maxwell'
  req.session.data['uln'] = uln
  req.session.data['dob'] = '24 December 2003'
  req.session.data['tlevelTitle'] = 'Design, Surveying and Planning for Construction'
  req.session.data['provider'] = 'Barnsley College (10000536)'
  req.session.data['engMaths'] = 'Achieved minimum standard'
  req.session.data['industry'] = 'Placement completed'
  req.session.data['tlevelTitle'] = 'Design, Surveying and Planning for Construction'
 ;

  res.redirect('/1-20/dynamic/request-statement-of-achievement-not-available-no-results')

} else if (uln === '9876543210') {

  req.session.data['name'] = 'Jane Barrow'
  req.session.data['provider'] = 'Barnsley College (10000536)'
  req.session.data['dob'] = '23 October 2004'
  req.session.data['coreGrade'] = 'Grade: A'
  req.session.data['engMaths'] = 'Achieved minimum standard'
  req.session.data['industry'] = 'Placement completed'
  req.session.data['tlevelTitle'] = 'Design, Surveying and Planning for Construction'
  req.session.data['uln'] = uln
  req.session.data['core'] = "Design, Surveying and Planning for Construction (60358300)"
  req.session.data['specialism'] = "Building Services Design (ZTLOS003)"
  req.session.data['specialismGrade'] = 'Grade: None'
  req.session.data['department'] = 'Exams Office'
  req.session.data['orgName'] = "Barnsley College"
  req.session.data['orgBuilding'] = "Cheylesmore House"
  req.session.data['orgStreet'] = "Church St"
  req.session.data['orgCity'] = 'Barnsley'
  req.session.data['orgPostcode'] = 'S70 2AX'

 ;

  res.redirect('/1-20/dynamic/request-statement-of-achievement-already-requested')

} else if (uln === '8642135790') {

  req.session.data['name'] = 'Kate Fleming'
  req.session.data['uln'] = uln
  req.session.data['dob'] = '2 January 2004'
  req.session.data['tlevelTitle'] = 'Design, Surveying and Planning for Construction'
  req.session.data['provider'] = 'Barnsley College (10000536)'
 ;

  res.redirect('/1-20/dynamic/request-statement-of-achievement-not-available-no-ip-status')

} else if (uln === '1231231234') {

  req.session.data['name'] = 'Steve Arnott'
  req.session.data['uln'] = uln
  req.session.data['dob'] = '12 January 2003'
  req.session.data['tlevelTitle'] = 'Design, Surveying and Planning for Construction'
  req.session.data['provider'] = 'Barnsley College (10000536)'
 ;

  res.redirect('/1-20/dynamic/request-statement-of-achievement-ULN-not-withdrawn')

}


  else {
    
    req.session.data['uln'] = uln
    res.redirect('/1-20/dynamic/request-statement-of-achievement-ULN-not-registered')
    
  }
  
});


//Cancel Request Page
router.post('/1-20/dynamic/request-statement-of-achievement-cancel', function (req, res) {

  let cancelRequest = req.session.data['cancel-request-answer']

  if (cancelRequest === 'no') {
    res.redirect('/1-20/dynamic/request-statement-of-achievement-check-and-submit')
  } else {
    res.redirect('/1-20/dynamic/tlevels-dashboard')
  }
})

//Cancel Address Page
router.post('/1-20/dynamic/cancel-address', function (req, res) {

  let cancelAddress = req.session.data['cancel-address-answer']

  if (cancelAddress === 'no') {
    res.redirect('/1-20/dynamic/add-address-confirm-address')
  } else {
    res.redirect('/1-20/dynamic/tlevels-dashboard')
  }
})


//Manage Postal Address

router.get('/1-20/dynamic/org-address-present', function(req, res) {

    res.render('1-20/dynamic/org-address-present', 
    {
      'department' : 'Exams Office',
      'orgName' : 'Barnsley Academy',
      'orgBuilding' : 'Main Block',
      'orgStreet' : 'Farm Rd',
      'orgCity' : 'Barnsley',
      'orgPostcode' : 'S70 3DL',
  })
  req.session.data['department'] = 'Exams Office'
  req.session.data['orgBuilding'] = "Barnsley Academy"
  req.session.data['orgStreet'] = "Farm Rd"
  req.session.data['orgCity'] = 'Barnsley'
  req.session.data['orgPostcode'] = 'S70 3DL'
  
});

router.post('/1-20/dynamic/add-address-confirm-address', function (req, res) {

  let addressChoice = req.session.data['full-address']

  req.session.data['newAddress'] = "yes"

  if (addressChoice === 'add1') {
    
    req.session.data['neworgName'] = "Barnsley College"
    req.session.data['neworgBuilding'] = "Cheylesmore House"
    req.session.data['neworgStreet'] = "Church St"
    req.session.data['neworgCity'] = 'Barnsley'
    req.session.data['neworgPostcode'] = 'S70 2AX'
    ;

    res.redirect('/1-20/dynamic/add-address-confirm-address')
  
  }else if (addressChoice === 'add2'){
    req.session.data['neworgName'] = "The Open Kitchen"
    req.session.data['neworgBuilding'] = "Eaton House"
    req.session.data['neworgStreet'] = "Church St"
    req.session.data['neworgCity'] = 'Barnsley'
    req.session.data['neworgPostcode'] = 'S70 2AX'
    ;

    res.redirect('/1-20/dynamic/add-address-confirm-address')
  
  
  } else if (addressChoice === 'add3'){
    req.session.data['neworgName'] = "Jobshop"
    req.session.data['neworgBuilding'] = "Friarsgate"
    req.session.data['neworgStreet'] = "Church St"
    req.session.data['neworgCity'] = 'Barnsley'
    req.session.data['neworgPostcode'] = 'S70 2AX'
    ;

    res.redirect('/1-20/dynamic/add-address-confirm-address')
  }
})

router.post('/1-20/dynamic/add-address-manually', function (req, res) {
  
  let newmanualOrganisation = req.session.data['org-name']
  let newmanualBuilding = req.session.data['address-line-1']
  let newmanualStreet = req.session.data['address-line-2']
  let newmanualCity = req.session.data['address-town']
  let newmanualPostcode = req.session.data['address-postcode']

  
  req.session.data['neworgName'] = newmanualOrganisation
  req.session.data['neworgBuilding'] = newmanualBuilding
  req.session.data['neworgStreet'] = newmanualStreet
  req.session.data['neworgCity'] = newmanualCity 
  req.session.data['neworgPostcode'] = newmanualPostcode
  
  res.redirect('/1-20/dynamic/add-address-confirm-address')

})


//Update Learner Records

router.get('/1-20/dynamic/result-entries1', function(req, res) {

  let uln = req.session.data['uln-search']

  if (uln === '1234567890') {
    res.render('1-20/dynamic/result-entries1', 
    {
    'uln' : uln,
    'name' : 'John Smith',
    'dob' : '12 June 2004',
    'provider' : 'Barnsley College (UKRPN: 10000536)',
    'engMaths' : 'Achieved minimum standard',
    'industryPlacement' : 'Not completed',
    'tlevelTitle' : 'Design, Surveying and Planning for Construction',

  })
    req.session.data['name'] = 'John Smith'
    req.session.data['provider'] = 'Barnsley College (UKRPN: 10000536)'
    req.session.data['dob'] = '12 June 2004'
    req.session.data['engMaths'] = 'Achieved minimum standard'
    req.session.data['industry'] = 'Not completed'
    req.session.data['tlevelTitle'] = 'Design, Surveying and Planning for Construction'
    req.session.data['uln'] = uln

    
  ;

} else if (uln === '5678901234') {
  res.render('1-20/dynamic/result-entries1', 
  {
  'uln' : uln,
  'name' : 'Tanner Ball',
  'dob' : '15 April 2004',
  'provider' : 'Barnsley College (UKRPN: 10000536)',
  'engMaths' : 'Not achieved minimum standard',
  'industryPlacement' : 'Not completed',
  'tlevelTitle' : 'Design, Surveying and Planning for Construction',
  })

  req.session.data['name'] = 'Tanner Ball'
  req.session.data['provider'] = 'Barnsley College (UKRPN: 10000536)'
  req.session.data['dob'] = '15 April 2004'
  req.session.data['engMaths'] = 'Not achieved minimum standard'
  req.session.data['industry'] = 'Not completed'
  req.session.data['tlevelTitle'] = 'Design, Surveying and Planning for Construction'
  req.session.data['uln'] = uln
  ;

} else if (uln === '1231231234') {
  res.render('1-20/dynamic/result-entries1', 
  {
  'uln' : uln,
  'name' : 'Steve Arnott',
  'dob' : '12 January 2003',
  'provider' : 'Barnsley College (UKRPN: 10000536)',
  'engMaths' : 'Not achieved minimum standard',
  'industryPlacement' : 'Not completed',
  'tlevelTitle' : 'Design, Surveying and Planning for Construction',
  })

  req.session.data['name'] = 'Steve Arnott'
  req.session.data['uln'] = uln
  req.session.data['dob'] = '12 January 2003'
  req.session.data['engMaths'] = 'Not achieved minimum standard'
  req.session.data['industry'] = 'Not completed'
  req.session.data['tlevelTitle'] = 'Design, Surveying and Planning for Construction'
  req.session.data['provider'] = 'Barnsley College (UKRPN: 10000536)'
  ;
 
} else if (uln === '9876543210') {
  res.render('1-20/dynamic/result-entries1', 
  {
  'uln' : uln,
  'name' : 'Jane Barrow',
  'dob' : '23 October 2004',
  'provider' : 'Barnsley College (UKRPN: 10000536)',
  'engMaths' : 'Not achieved minimum standard',
  'industryPlacement' : 'Not completed',
  'tlevelTitle' : 'Design, Surveying and Planning for Construction',
  })

  req.session.data['name'] = 'Jane Barrow'
  req.session.data['uln'] = uln
  req.session.data['dob'] = '23 October 2004'
  req.session.data['engMaths'] = 'Not achieved minimum standard'
  req.session.data['industry'] = 'Placement completed'
  req.session.data['tlevelTitle'] = 'Design, Surveying and Planning for Construction'
  req.session.data['provider'] = 'Barnsley College (UKRPN: 10000536)'
  ;

} else if (uln === '5647382910') {
  res.render('1-20/dynamic/result-entries1', 
  {
  'uln' : uln,
  'name' : 'Sheldon Maxwell',
  'dob' : '24 December 2004',
  'provider' : 'Barnsley College (UKRPN: 10000536)',
  'engMaths' : 'Achieved minimum standard',
  'industryPlacement' : 'Not completed',
  'tlevelTitle' : 'Design, Surveying and Planning for Construction',
  })

  req.session.data['name'] = 'Sheldon Maxwell'
  req.session.data['uln'] = uln
  req.session.data['dob'] = '24 December 2003'
  req.session.data['provider'] = 'Barnsley College (10000536)'
  req.session.data['engMaths'] = 'Achieved minimum standard'
  req.session.data['industry'] = 'Not completed'
  req.session.data['tlevelTitle'] = 'Design, Surveying and Planning for Construction'
  ;
} 



  else {
    
    req.session.data['uln'] = uln
    res.redirect('request-statement-of-achievement-ULN-not-registered')
    
  }
  
});

//Change Industry Placement

router.post('/1-20/dynamic/change-ip-result', function (req, res) {
  let newResult = req.session.data['result-ip-answer']

  req.session.data['newplacementResult'] = "yes"
  req.session.data['newindustryPlacement'] = newResult
  
  res.redirect('/1-20/dynamic/change-ip-result-successful')

});


// Add learner record 

router.get('/1-20/dynamic/add-learner-q4-ip', function(req, res) {

  let uln = req.session.data['uln-search']

  if (uln === '1234567890') {

    req.session.data['name'] = 'John Smith'
    req.session.data['provider'] = 'Barnsley College (UKRPN: 10000536)'
    req.session.data['dob'] = '12 June 2004'
    req.session.data['engMaths'] = 'Achieved minimum standard'
    req.session.data['industry'] = 'Not completed'
    req.session.data['tlevelTitle'] = 'Design, Surveying and Planning for Construction'
    req.session.data['uln'] = uln

    res.redirect('/1-20/dynamic/add-learner-q1-ulnAlreadyAdded')

} else if (uln === '5678901234') {

    req.session.data['name'] = 'Tanner Ball'
    req.session.data['provider'] = 'Barnsley College (UKRPN: 10000536)'
    req.session.data['dob'] = '15 April 2004'
    req.session.data['engMaths'] = 'Not achieved minimum standard'
    req.session.data['industry'] = 'Not completed'
    req.session.data['tlevelTitle'] = 'Design, Surveying and Planning for Construction'
    req.session.data['uln'] = uln

    res.redirect('/1-20/dynamic/add-learner-q1-ulnAlreadyAdded')

  } else if (uln === '1231231234') {

    req.session.data['name'] = 'Steve Arnott'
    req.session.data['provider'] = 'Barnsley College (UKRPN: 10000536)'
    req.session.data['dob'] = '12 January 2003'
    req.session.data['engMaths'] = 'Not achieved minimum standard'
    req.session.data['industry'] = 'Not completed'
    req.session.data['tlevelTitle'] = 'Design, Surveying and Planning for Construction'
    req.session.data['uln'] = uln

    res.redirect('/1-20/dynamic/add-learner-q1-ulnAlreadyAdded')

  } else if (uln === '9876543210') {

    req.session.data['name'] = 'Jane Barrow'
    req.session.data['uln'] = uln
    req.session.data['dob'] = '23 October 2004'
    req.session.data['engMaths'] = 'Not achieved minimum standard'
    req.session.data['industry'] = 'Placement completed'
    req.session.data['tlevelTitle'] = 'Design, Surveying and Planning for Construction'
    req.session.data['provider'] = 'Barnsley College (UKRPN: 10000536)'

    res.redirect('/1-20/dynamic/add-learner-q1-ulnAlreadyAdded')
    
    
  } else if (uln === '8642135790') {

    req.session.data['name'] = 'Kate Fleming'
    req.session.data['uln'] = uln
    req.session.data['dob'] = '2 January 2004'
    req.session.data['tlevelTitle'] = 'Design, Surveying and Planning for Construction'
    req.session.data['provider'] = 'Barnsley College (UKRPN: 10000536)'

    res.redirect('/1-20/dynamic/add-learner-q2-em')


}else {
    
    req.session.data['uln'] = uln
    res.redirect('/1-20/dynamic/add-learner-q1-ulnNotExist')
    
  }
  
});



module.exports = router
//checkIfActive(router.req)
