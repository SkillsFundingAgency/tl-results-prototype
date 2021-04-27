const e = require('express');
const { post } = require('../routes');

module.exports = function (router) {

router.get('/1-19/dynamic/template-record-entries-routes', function(req, res) {
  res.render('1-19/dynamic/template-record-entries-routes', { name : 'Foo' });
});
    

}

