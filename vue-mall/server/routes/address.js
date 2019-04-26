/*
 * Created by yny on 2019/4/19
 */
 let express = require('express');
 let router = express.Router();
 let mongodbServer = require('../public/js/mongodbServer');
 let util = require('../public/js/util');

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
        if (result.length) {
            res.json({
                code: 1000,
                message: '查询成功',
                result: result[0].address
            })
        } else {
            res.json({
                code: 1002,
                message: '无数据'
            })
        }
    })
 });
function updateAddress (req, res) {
    let {
        userId,
        receiveUser,
        addressDetail,
        province,
        city,
        area,
        addressMail,
        setDefault
    } = req.body;
    let addressId = util.createId();
    mongodbServer.updateOneData('address', {
        userId
    }, {
        $push: {
            address: {
                receiveUser,
                addressDetail,
                province,
                city,
                area,
                addressMail,
                setDefault,
                addressId
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
}

 // 添加地址
router.post('/add', function (req, res) {
   let {
       userId,
       receiveUser,
       addressDetail,
       province,
       city,
       area,
       addressMail,
       setDefault
   } = req.body;
   let addressId = String(new Date().getTime()) + Math.round(Math.random() * 10);
   mongodbServer.selectData({
       collectionName: 'address',
       findWhat: {
           userId
       }
   }, function (result) {
       if (result.length) {
           // 有添加过地址
           if (setDefault) {
               mongodbServer.updateOneData('address', {
                   userId,
                   'address.setDefault': 1
               }, {
                   $set: {
                       'address.$.setDefault': 0
                   }
               }, function () {
                    updateAddress(req, res)
               })
           } else {
               updateAddress(req, res)
           }
       } else {
           // 没有添加过地址
           mongodbServer.insertData('address', [
               {
                   userId,
                   address: [
                       {
                           receiveUser,
                           addressDetail,
                           province,
                           city,
                           area,
                           addressMail,
                           setDefault,
                           addressId
                       }
                   ]
               }
           ], function (result2) {
               if (result2.insertedCount === 1) {
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

// 删除
router.post('/delete', function (req, res) {
    let {
        userId,
        deleteId
    } = req.body;
    mongodbServer.updateOneData('address', {
        userId
    }, {
        $pull: {
            address: {
                addressId: deleteId
            }
        }
    }, function (result) {
        if (result.modifiedCount === 1){
            res.json({
                code: 1000,
                message: '删除成功',
                result
            })
        } else {
            res.json({
                code: 1011,
                message: '删除失败'
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