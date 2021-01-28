const e = require('express')

module.exports = function (router) {

    function loadProviderData(req) {
       
        
        // req.session.data['verify_tlevel_count'] = null
        // req.session.data['tLevel-verified'] = null
        // req.session.data['view_selected_tLevel'] = null
        // req.session.data['verify_tlevel_count'] = null

         var fs = require('fs')
        
        // Accounts
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
    }

    function clearSession(req) {
        req.session.data['learner-uln'] = null
        req.session.data['learner-name'] = null
        req.session.data['date-of-birth'] = null
        req.session.data['send-answer'] = null
        req.session.data['result-ip-answer'] = null        
        req.session.data['result-answer'] = null
        req.session.data['has-lrs-data'] = true
        req.session.data['has-search-uln-added'] = true
        req.session.data['uln-already-added'] = false  
        req.session.data['errors'] = []      
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
        //var errors = []
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

    router.get('/1-17/dynamic/action-select-add-learner', function (req, res) {
        clearSession(req);        
        res.redirect('/1-17/dynamic/add-learner-q1-uln')      
    })

    router.get('/1-17/dynamic/action-clear-add-learner-q1-uln', function (req, res) {
        clearSession(req);        
        res.redirect('/1-17/dynamic/add-learner-q1-uln')      
    })    

    router.post('/1-17/dynamic/action-add-learner', function (req, res) {

        var isValid = checkUlnValidation(req, res)

        if(isValid) {
            var enteredUln = req.session.data['learner-uln']
            var userInfo = req.session.data['user_info']
            
            if(enteredUln == userInfo[0][1]) 
            {            
                res.redirect('/1-17/dynamic/add-learner-q1-ulnNotExist')  
            }
            else if(enteredUln == userInfo[1][1] || enteredUln == userInfo[5][1])
            {
                setLearnerDetails(req)
                res.redirect('/1-17/dynamic/add-learner-q3-send')  
            }
            else if(enteredUln == userInfo[2][1])
            {
                setLearnerDetails(req)
                res.redirect('/1-17/dynamic/add-learner-q2-em')  
            }  
            else if(enteredUln == userInfo[3][1])
            {
                setLearnerDetails(req)
                res.redirect('/1-17/dynamic/add-learner-q1-ulnAlreadyAdded')  
            } 
        }
        else {
            res.redirect('/1-17/dynamic/add-learner-q1-uln')
        }     
    }) 

    router.post('/1-17/dynamic/action-add-learner-q3-send', function (req, res) {

        var hasReultAnswerSelected = req.session.data['result-answer']

        if(hasReultAnswerSelected == null || hasReultAnswerSelected == '')
        {
            var sendErrors = ['#result-answer-1', "Select if the learner has achieved the minimum standard"]
            addValidationError(req,res,sendErrors)
            res.redirect('/1-17/dynamic/add-learner-q2-em')                             
        } else {
            clearValidationError(req)
            req.session.data['has-lrs-data'] = false
            res.redirect('/1-17/dynamic/add-learner-q3-send')                 
        }                       
    })   

    router.post('/1-17/dynamic/action-add-learner-q4-ip', function (req, res) {

        var hasSendSelected = req.session.data['send-answer']

        if(hasSendSelected == null || hasSendSelected == '')
        {
            var sendErrors = ['#send-answer-1', "Select yes if the learner has special educational needs and/or a disability"]
            addValidationError(req,res,sendErrors)
            res.redirect('/1-17/dynamic/add-learner-q3-send')                             
        } else {
            clearValidationError(req)
            res.redirect('/1-17/dynamic/add-learner-q4-ip')                 
        }
    })
    
    router.post('/1-17/dynamic/action-add-learner-q5-check', function (req, res) {

        var hasIpSelected = req.session.data['result-ip-answer']

        if(hasIpSelected == null || hasIpSelected == '')
        {
            var sendErrors = ['#result-ip-answer-1', "Select if the learner has completed their industry placement"]
            addValidationError(req,res,sendErrors)
            res.redirect('/1-17/dynamic/add-learner-q4-ip')                             
        } else {
            clearValidationError(req)
            res.redirect('/1-17/dynamic/add-learner-q5-check')                
        }                  
    })    

    router.get('/1-17/dynamic/action-another-learner-add-learner-q1-uln', function (req, res) {
        clearSession(req);        
        res.redirect('/1-17/dynamic/add-learner-q1-uln')      
    })

    router.get('/1-17/dynamic/action-result-entries1', function (req, res) {
        //clearSession(req);      
        req.session.data['send-answer'] = "No"
        req.session.data['result-ip-answer'] = "Yes, passed"        
        req.session.data['uln-already-added'] = true  
        res.redirect('/1-17/dynamic/result-entries1')      
    })    

    // Search Learner
    
    router.get('/1-17/dynamic/action-select-search-learner', function (req, res) {
        clearSession(req);        
        res.redirect('/1-17/dynamic/search-learner')      
    })

    router.get('/1-17/dynamic/action-search-learner', function (req, res) {
        
        var isValid = checkUlnValidation(req, res)

        if(isValid) {
            var enteredUln = req.session.data['learner-uln']
            var userInfo = req.session.data['user_info']
            
            if(enteredUln == userInfo[4][1]) 
            {            
                res.redirect('/1-17/dynamic/search-failed')  
            }
            else if(enteredUln == userInfo[5][1])
            {
                setLearnerDetails(req)
                res.redirect('/1-17/dynamic/search-failed-notadded')  
            }
            else if(enteredUln == userInfo[6][1])
            {
                setLearnerDetails(req)
                
                req.session.data['send-answer'] = "No"
                req.session.data['result-ip-answer'] = "Yes, passed"

                res.redirect('/1-17/dynamic/result-entries1')  
            }   
            else if(enteredUln == userInfo[7][1])
            {
                setLearnerDetails(req)
                req.session.data['has-lrs-data'] = false
                req.session.data['result-answer'] = "Achieved"
                req.session.data['send-answer'] = "No"
                req.session.data['result-ip-answer'] = "Yes, passed"

                res.redirect('/1-17/dynamic/result-entries1')  
            }            
        }
        else {
            res.redirect('/1-17/dynamic/search-learner')
        }          
    })

    router.get('/1-17/dynamic/action-search-add-learner-q1-uln', function (req, res) {
        req.session.data['has-search-uln-added'] = false      
        res.redirect('/1-17/dynamic/add-learner-q1-uln')      
    })

    router.post('/1-17/dynamic/action-change-em-send-successful', function (req, res) {
        res.redirect('/1-17/dynamic/change-em-send-successful')          
    })    

    router.post('/1-17/dynamic/action-change-em-status-successful', function (req, res) {
        res.redirect('/1-17/dynamic/change-em-status-successful')          
    })    
    
    router.post('/1-17/dynamic/action-change-ip-result-successful', function (req, res) {
        res.redirect('/1-17/dynamic/change-ip-result-successful')          
    })    
}
