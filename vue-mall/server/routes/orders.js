/*
 * Created by yny on 2019/4/24
 */
 let express = require('express');
 let router = express.Router();
 let mongodbServer = require('../public/js/mongodbServer');

// 添加选择的收货地址
router.post('/chooseAddress', function (req, res) {
    let {
        userId,
        addressId,
        ordersId
    } = req.body;
    mongodbServer.updateOneData('orders', {
        userId,
        'orders.ordersId': ordersId
    }, {
        $set: {
            'orders.$.addressId': addressId
        }
    }, function (result) {
        if (result.modifiedCount === 1) {
            res.json({
                code: 1000,
                message: '成功'
            })
        } else {
            res.json({
                code: 1011,
                message: '失败'
            })
        }
    })
});

// 订单信息
router.post('/info', function (req, res) {
    let {
        userId,
        ordersId
    } = req.body;
    mongodbServer.selectData({
        collectionName: 'orders',
        findWhat: {
            userId
        },
        findMatch: {
            orders: {
                $elemMatch: {
                    ordersId
                }
            }
        }
    }, function (result) {
        // todo
        let goodsId = [];
        result.forEach((val) => {

        })
    })
});

module.exports = router;