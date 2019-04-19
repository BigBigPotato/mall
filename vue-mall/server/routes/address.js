/*
 * Created by yny on 2019/4/19
 */
 let express = require('express');
 let router = express.Router();
 let mongodbServer = require('../public/js/mongodbServer');

 // 地址列表
 router.post('/list', function (req, res) {
    let {
        userId
    } = req.body;
    mongodbServer.selectData({
        collectionName: 'address',
        findWhat: {
            userId
        }
    }, function (result) {
        console.log(result)
    })
 });

 // 添加地址
router.post('/add', function (req, res) {
   let {
       userId,
       receiveUser,
       addressDetail,
       province,
       city,
       area
   } = req.body;
   mongodbServer.selectData({
       collectionName: 'address',
       findWhat: {
           userId
       }
   }, function (result) {
       if (result.length) {
           // 更新
           mongodbServer.updateOneData('address', {
               userId
           }, {
               $push: {
                   address: {
                       receiveUser,
                       addressDetail,
                       province,
                       city,
                       area
                   }
               }
           }, function (result) {
               if (result.modifiedCount === 1) {
                   res.json({
                       code: 1000,
                       message: '添加成功'
                   })
               } else {
                   res.json({
                       code: 1011,
                       message: '添加失败'
                   })
               }
           })
       } else {
           // 新增
           mongodbServer.insertData('address', [
               {
                   userId,
                   address: [
                       {
                           receiveUser,
                           addressDetail,
                           province,
                           city,
                           area
                       }
                   ]
               }
           ], function (result) {
               if (result.insertedCount === 1) {
                   res.json({
                       code: 1000,
                       message: '添加成功'
                   })
               } else {
                   res.json({
                       code: 1011,
                       message: '添加失败'
                   })
               }
           })
       }
   })
});

 // 省市区
 // 省
router.get('/province', function (req, res) {
    mongodbServer.selectData({
        collectionName: 'province-city',
        backResult: {
            cityList: 0
        }
    }, function (result) {
        if (result.length) {
            res.json({
                code: 1000,
                message: '查询成功',
                result
            })
        } else {
            res.json({
                code: 1011,
                message: '查询失败'
            })
        }
    })
});
 // 市
router.get('/city', function (req, res) {
    let {
        province
    } = req.query;
    mongodbServer.selectData({
        collectionName: 'province-city',
        findWhat: {
            name: province
        },
        backResult: {
            'cityList.areaList': 0
        }
    }, function (result) {
        if (result.length) {
            res.json({
                code: 1000,
                message: '查询成功',
                result: result[0].cityList
            })
        } else {
            res.json({
                code: 1011,
                message: '查询失败'
            })
        }
    })
});
// 区
router.get('/area', function (req, res) {
    let {
        city
    } = req.query;
    mongodbServer.selectData({
        collectionName: 'province-city',
        findWhat: {
            'cityList.name': city
        }
    }, function (result) {
        if (result.length) {
            res.json({
                code: 1000,
                message: '查询成功',
                result: result[0].cityList[0].areaList
            })
        } else {
            res.json({
                code: 1011,
                message: '查询失败'
            })
        }
    })
});

 module.exports = router;