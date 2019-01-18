var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/goodsList', function(req, res, next) {
  console.log(req.params)
});

module.exports = router;
