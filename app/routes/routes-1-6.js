module.exports = function (router) {

    function loadTLevelsData(req) {
        req.session.data['tLevels'] = []
        req.session.data['tLevels-ao'] = []
        req.session.data['tLevels-list'] = []
        req.session.data['has-one-tLevel-verified-or-queried'] = false
        req.session.data['requested_tLevel'] = null

        req.session.data['verify_tlevel_count'] = null
        req.session.data['tLevel-verified'] = null
        req.session.data['view_selected_tLevel'] = null
        req.session.data['verify_tlevel_count'] = null

        var fs = require('fs')
        var filename = 'app/views/1-6/AO/data/TLevels_v1.6.csv'
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
            checkAndSetIfVerifyTlevelHasOneComponent(req)
        })

        // Specialisms
        req.session.data['specialisms'] = []
        req.session.data['specialisms-ao'] = []
        var filename = 'app/views/1-6/AO/data/specialisms_v1.6.csv'
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

        // Accounts
        req.session.data['accounts'] = []
        var filename = 'app/views/1-1/AO/data/Accounts_v1.5.csv'
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

    }

    function checkAndSetIfVerifyTlevelHasOneComponent(req) {
        var verifyCount = 0;
        // reset count
        req.session.data['verify_tlevel_count'] = verifyCount
        for (tlevel of req.session.data['tLevels-ao']) {
            if (tlevel[6] === "Unverified") {
                verifyCount = verifyCount+1
            }
        }
        req.session.data['verify_tlevel_count'] = verifyCount
    }

    router.get('/1-6/AO/action-select-tlevels', function (req, res) {
        checkAndSetIfVerifyTlevelHasOneComponent(req)

        if(req.session.data['verify_tlevel_count'] == 0){
            //res.render('/1-6/AO/view-all-tlevels', { 'backLink': '/1-6/AO/tlevels-dashboard'})
            res.redirect('/1-6/AO/view-all-tlevels')
        } else {
            //res.render('/1-6/AO/tLevel-select', { 'backLink': '/1-6/AO/tlevels-dashboard'})
            res.redirect('/1-6/AO/tlevel-select')
        }
    })

    router.post('/1-6/AO/action-tlevels-provider-setup', function (req, res) {
        var org = req.session.data['selected_organisation']
        var role = req.session.data['selected_role']

        req.session.data['errors'] = []
        if(org == null || org == '')
        {
            // Errors! No organisation selected
            req.session.data['errors'] = []
            error = ['#01', 'Select what you need to do']
            req.session.data['errors'].push(error)
            res.render('1-6/AO/tlevels-prototype-setup', { errors: req.session.data['errors'] })
        }
        else 
        {
            if(org == 'ncfe')
            {
                req.session.data['ao'] = 'NCFE'
            }
            else if(org == 'pearson')
            {
                req.session.data['ao'] = 'Pearson'
            }
            else if(org == 'cityandguilds')
            {
                req.session.data['ao'] = 'City and Guilds'
            }
            loadTLevelsData(req);            
            res.redirect('/1-6/Verification/tlevels-start')
        }
    })

    router.post('/1-6/AO/action-verify-tLevel-details', function (req, res) {
        req.session.data['req_tLevel'] = []
        var tlCode = req.query.tl;
        if(req.session.data['tLevels-ao'].length == 1)
        {
            req.session.data['requested_tLevel'] = req.session.data['tLevels-ao'][0][7]
        }
        else {
            checkAndSetIfVerifyTlevelHasOneComponent(req)            
        }

        for (tlevel of req.session.data['tLevels-ao']) {

            // if only one tlevel left to verify then check and get tl code and set to requested_tLevel
            if(req.session.data['verify_tlevel_count'] == 1 && tlevel[6] === "Unverified") {
                req.session.data['requested_tLevel'] = tlevel[7]
            }

            // this is possible if they queried and confirming details as tlCode is passed in query string as tl
            if(tlCode != null && tlCode != '')
            {
                req.session.data['requested_tLevel'] = tlcode
            }

            if (tlevel[7] === req.session.data['requested_tLevel']) {
                req.session.data['req_tLevel'] = tlevel
            }
        }
        res.redirect('/1-6/AO/verify-tlevel-details?tl=' + req.session.data['requested_tLevel'])
    })
    
    router.post('/1-6/AO/action-verify-single-tLevel', function (req, res) {
        var tlCode = req.session.data['requested_tLevel']
        var acceptance = req.session.data['tLevel-verified']

        for (idx = 0; idx < req.session.data['tLevels-ao'].length; idx++) {
            if (req.session.data['tLevels-ao'][idx][7] === req.session.data['requested_tLevel']) {
                break
            }
        }

        for (tlevel of req.session.data['tLevels-ao']) {
            if (tlevel[7] === tlCode) {
                req.session.data['view_selected_tLevel'] = tlevel
            }
        }

        if (acceptance === 'Rejected') {
            // Not accepted
            req.session.data['tLevels-ao'][idx][6] = "Rejected"
            req.session.data['has-one-tLevel-verified-or-queried'] = true
            checkAndSetIfVerifyTlevelHasOneComponent(req);
            res.redirect('/1-6/AO/report-tlevel-issue')
        } else if (acceptance === 'Verified') {
            // Accepted
            req.session.data['tLevels-ao'][idx][6] = "Verified"
            req.session.data['has-one-tLevel-verified-or-queried'] = true
            checkAndSetIfVerifyTlevelHasOneComponent(req);
            var verifyTlevelCount = req.session.data['verify_tlevel_count'];
            if(verifyTlevelCount == 0) {
                res.render('1-6/AO/view-all-tlevels', { 'msg' : 'confirm', 'tlCode': tlCode, 'backLink': '/1-6/AO/verify-tlevel-details', 'verifyTlevelCount': verifyTlevelCount, 'showAll' : req.session.data['has-one-tLevel-verified-or-queried'] })
            }
            else {
                res.render('1-6/AO/tlevel-select', { 'msg' : 'confirm', 'tlCode': tlCode, 'backLink': '/1-6/AO/verify-tlevel-details', 'verifyTlevelCount': verifyTlevelCount, 'showAll' : req.session.data['has-one-tLevel-verified-or-queried'] })
            }
        }
    })

    router.get('/1-6/AO/action-view-tlevel-details', function (req, res) {
        req.session.data['view_selected_tLevel'] = []
        req.session.data['back_link'] = []
        var tlCode = req.query.tl;
        var backLink = req.query.bl;

        if(backLink == null) {
            backLink = 'tlevel-details'
        }

        req.session.data['back_link'] = backLink
        
        for (tlevel of req.session.data['tLevels-ao']) {
            if (tlevel[7] === tlCode) {
                req.session.data['view_selected_tLevel'] = tlevel
            }
        }
        res.redirect('/1-6/AO/tlevel-details')
    })

    router.get('/1-6/AO/action-report-tLevel-issue', function (req, res) {
        var tlCode = req.session.data['requested_tLevel']
        var verifyTlevelCount = req.session.data['verify_tlevel_count'];
            if(verifyTlevelCount == 0) {
                res.render('1-6/AO/view-all-tlevels', { 'msg' : 'reported', 'tlCode': tlCode, 'verifyTlevelCount': verifyTlevelCount, 'showAll' : req.session.data['has-one-tLevel-verified-or-queried'] })
            }
            else {
                res.render('1-6/AO/tlevel-select', { 'msg' : 'reported', 'tlCode': tlCode, 'verifyTlevelCount': verifyTlevelCount, 'showAll' : req.session.data['has-one-tLevel-verified-or-queried'] })
            }
    })

    router.get('/1-6/AO/action-confirm-tLevel-details', function (req, res) {
        req.session.data['req_tLevel'] = []
        var tlCode = req.query.tl;

        for (tlevel of req.session.data['tLevels-ao']) {
            // this is possible if they queried and confirming details as tlCode is passed in query string as tl
            if(tlCode != null && tlCode != '')
            {
                req.session.data['requested_tLevel'] = tlCode
            }

            if (tlevel[7] === req.session.data['requested_tLevel']) {
                req.session.data['req_tLevel'] = tlevel
            }
        }
        res.redirect('/1-6/AO/verify-tlevel-details')
    })

    router.get('/1-6/AO/action-something-wrong-tLevel-details', function (req, res) {
        var tlCode = req.query.tl;

        for (tlevel of req.session.data['tLevels-ao']) {
            // this is possible if they queried and confirming details as tlCode is passed in query string as tl
            if(tlCode != null && tlCode != '' && tlevel[7] === tlCode)
            {
                tlevel[6] = "Rejected"
                req.session.data['has-one-tLevel-verified-or-queried'] = true
                checkAndSetIfVerifyTlevelHasOneComponent(req);
                req.session.data['view_selected_tLevel'] = tlevel
            }
        }
        res.redirect('/1-6/AO/report-tlevel-issue')
    })
}
