/*
 * Created by yny on 2019/3/8
 */
let express = require('express');
let router = express.Router();
let mongodbServer = require('../public/js/mongodbServer');

// 购物车列表
router.post('/list', function (req, res, next) {
    let {
        userId,
        page,
        limit
    } = req.body;
    mongodbServer.selectData({
        collectionName: 'orders',
        findWhat: {
            userId
        },
        page,
        limit
    }, function (result) {
        if (!result.length || !result[0].orders.length) {
            res.json({
                code: 1005,
                message: '购物车为空',
                result: []
            })
        } else {
            // 根据goodsId再查询商品信息，组合返回
            let orders = result[0].orders;
            let goodsId = [];
            orders.forEach((item) => {
                goodsId.push(item.goodsId)
            });
            mongodbServer.selectData({
                collectionName: 'goods',
                findWhat: {
                    productId: {
                        $in: goodsId
                    }
                }
            }, function (result2) {
                for (let goodsItem of result2) {
                    for (let ordersItem of orders) {
                        if (goodsItem.productId === ordersItem.goodsId) {
                            ordersItem.goodsMsg = goodsItem
                        }
                    }
                }
                res.json({
                    code: 1000,
                    message: '查询成功',
                    result: orders
                })
            })
        }
    })
});

// 删除购物车商品
router.post('/delete', function (req, res, next) {
    let {
        goodsId,
        userId
    } = req.body;
    mongodbServer.updateOneData('orders', {
        userId
    }, {
        $pull: {
            orders: {
                goodsId
            }
        }
    }, function (result) {
        if (result.result.nModified === 1) {
            res.json({
                code: 1000,
                message: '删除成功'
            })
        } else {
            res.json({
                code: 1011,
                message: '删除失败'
            })
        }
    })
});

// 编辑数量
router.post('/editGoodsNum', function (req, res, next) {
   let {
       userId,
       goodsId,
       number
   } = req.body;
   mongodbServer.updateOneData('orders', {
       userId,
       'orders.goodsId': goodsId
   }, {
       $inc: {
           "orders.$.number": number
       }
   }, function (result) {
       if (result.result.nModified === 1) {
           res.json({
               code: 1000,
               message: '修改数量成功'
           })
       } else {
           res.json({
               code: 1011,
               message: '修改数量失败'
           })
       }
   })
});

module.exports = router;