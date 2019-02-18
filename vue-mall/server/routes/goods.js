var express = require('express');
var router = express.Router(),
    mongodbServer = require('../public/js/mongodbServer')

router.post('/list', function(req, res) {
  let {
    page,
    limit,
    priceRange = null,
    sortBy = null
  } = req.body;
  let parameter = {
    collectionName: 'goods',
    page,
    limit
  }
  if (priceRange) {
    // priceRange = JSON.parse(priceRange)
    parameter.findWhat = {
      "salePrice": {
        "$gte": priceRange.startPrice,
        "$lt": priceRange.endPrice
      }
    }
  }
  sortBy ? parameter.sortParams = sortBy : ''
  mongodbServer.selectData(parameter, function (result, num) {
    if (result.length) {
      if (result.length < limit) {
        // 数据少于一页
        res.json({
          code: 1001,
          msg: '查询成功，无更多数据',
          result: {
            list: result,
            count: num
          }
        })
      } else {
        res.json({
          code: 1000,
          msg: '查询成功',
          result: {
            list: result,
            count: num
          }
        })
      }
    } else {
      res.json({
        code: 1002,
        msg: '未查询到数据'
      })
    }
  })
});

router.post('/priceRange', function (req, res) {
  mongodbServer.selectData({
    collectionName: 'goods',
    backResult: {
      _id: 0,
      salePrice: 1
    }
  }, function (result) {
    let priceArr = [];
    for (let item of result) {
      priceArr.push(item.salePrice)
    }
    priceArr.sort(function (a, b) {
      return a - b
    })
    let maxPrice = priceArr[priceArr.length - 1]
    let priceRange = 500
    let priceRangeCount = Math.ceil(maxPrice / priceRange)
    let priceRangeArr = []
    for (let i = 0; i < priceRangeCount; i++) {
      priceRangeArr.push({
        startPrice: i * priceRange,
        endPrice: (i + 1) * priceRange
      })
    }
    res.json({
      code: 1000,
      msg: '查询成功',
      result: priceRangeArr
    })
  })
})

module.exports = router;
