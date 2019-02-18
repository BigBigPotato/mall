var express = require('express');
var router = express.Router(),
    mongodbServer = require('../public/js/mongodbServer')

/* GET users listing. */
router.post('/login', function(req, res, next) {
  let {
    userName,
    userPwd
  } = req.body
  if (!userName) {
    res.json({
      code: 1003,
      msg: '用户名不能为空'
    })
    return
  }
  if (!userPwd) {
    res.json({
      code: 1004,
      msg: '密码不能为空'
    })
    return
  }
  let params = {
    collectionName: 'user',
    findWhat: {
      userName
    }
  }
  mongodbServer.selectData(params, function (result) {
    if (result.length) {
      if (result[0].userPwd === userPwd) {
        res.json({
          code: 1000,
          msg: '登陆成功',
          result
        })
      } else {
        res.json({
          code: 1004,
          msg: '密码错误'
        })
      }
    } else {
      res.json({
        code: 1006,
        msg: '该账号不存在'
      })
    }
  })
});

router.post('/register', function (req, res, next) {
  let {
    userName,
    userPwd
  } = req.body
  if (!userName) {
    res.json({
      code: 1003,
      msg: '用户名不能为空'
    })
    return
  } else {
    let nameRexg = /^[a-z][a-z0-9]{5,11}$/
    if (!nameRexg.test(userName)) {
      res.json({
        code: 1003,
        msg: '用户名必须以英文字母开头，只能包含小写英文字母和数字，且长度在6-12位'
      })
      return
    }
  }
  if (!userPwd) {
    res.json({
      code: 1004,
      msg: '密码不能为空'
    })
    return
  } else {
    let pwdRexg = /^[0-9]{6,12}$/
    if (!pwdRexg.test(userPwd)) {
      res.json({
        code: 1004,
        msg: '密码只能包含数字，且长度在6-12位'
      })
      return
    }
  }
  let params = {
    collectionName: 'user',
    findWhat: {
      userName
    }
  }
  mongodbServer.selectData(params, function (result) {
    if (result.length) {
      res.json({
        code: 1007,
        msg: '该账号已存在'
      })
    } else {
      let randomNumber = Math.floor(Math.random() * 10)
      mongodbServer.insertData('user', [
        {
          userId: String(new Date().getTime()) + randomNumber,
          userName,
          userPwd
        }
      ], function (result2) {
        if (result2.insertedCount === 1) {
          res.json({
            code: 1000,
            msg: '注册成功'
          })
        }
      })
    }
  })
})


function pushOrder(userId, goodsId, res) {
  mongodbServer.updateOneData('orders', {
    userId
  }, {
    $push: {
      orders: {
        goodsId,
        number: 1
      }
    }
  }, function (result) {
      if (result.modifiedCount === 1) {
        res.json({
          code: 1000,
          msg: '添加购物车成功'
        })
      }
  })
}
router.post('/addCart', function (req, res, next) {
  let {
    userId,
    goodsId
  } = req.body
  mongodbServer.selectData({
    collectionName: 'orders',
    findWhat: {
      userId
    }
  }, function (result) {
    if (result.length) {
      let orders = result[0].orders
      if (orders.length) {
        let hasSameGoods = orders.find((item) => item.goodsId === goodsId)
        if (hasSameGoods) {
          mongodbServer.updateOneData('orders', {
            userId,
            "orders.goodsId": goodsId
          }, {
            $inc: {
              "orders.$.number": 1
            }
          }, function (result3) {
            if (result3.modifiedCount === 1) {
              res.json({
                code: 1000,
                msg: '添加购物车成功'
              })
            }
          })
        } else {
          pushOrder(userId, goodsId, res)
        }
      } else {
        // 购物车没有商品
        pushOrder(userId, goodsId, res)
      }
    } else {
      // 首次加入商品进购物车
      mongodbServer.insertData('orders', [
        {
          userId,
          orders: [
            {
              goodsId,
              number: 1
            }
          ]
        }
      ], function (result2) {
        if (result2.insertedCount === 1) {
          res.json({
            code: 1000,
            msg: '添加购物车成功'
          })
        }
      })
    }
  })
})

module.exports = router;
