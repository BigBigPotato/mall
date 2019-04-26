/*
 * Created by yny on 2019/3/8
 */
let express = require('express');
let router = express.Router();
let mongodbServer = require('../public/js/mongodbServer');
let util = require('../public/js/util');


function pushOrder(userId, goodsId, res) {
    mongodbServer.updateOneData('carts', {
        userId
    }, {
        $push: {
            carts: {
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
        } else {
            res.json({
                code: 1011,
                msg: '添加购物车失败'
            })
        }
    })
}

router.post('/addCart', function (req, res, next) {
    let {
        userId,
        goodsId
    } = req.body;
    mongodbServer.selectData({
        collectionName: 'carts',
        findWhat: {
            userId
        }
    }, function (result) {
        if (result.length) {
            let orders = result[0].carts
            if (orders.length) {
                let hasSameGoods = orders.find((item) => item.goodsId === goodsId)
                if (hasSameGoods) {
                    mongodbServer.updateOneData('carts', {
                        userId,
                        "carts.goodsId": goodsId
                    }, {
                        $inc: {
                            "carts.$.number": 1
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
            mongodbServer.insertData('carts', [
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
                } else {
                    res.json({
                        code: 1011,
                        msg: '添加购物车失败'
                    })
                }
            })
        }
    })
});

// 购物车列表
router.post('/list', function (req, res, next) {
    let {
        userId,
        page,
        limit
    } = req.body;
    mongodbServer.selectData({
        collectionName: 'carts',
        findWhat: {
            userId
        },
        page,
        limit
    }, function (result) {
        if (!result.length || !result[0].carts.length) {
            res.json({
                code: 1005,
                message: '购物车为空',
                result: []
            })
        } else {
            // 根据goodsId再查询商品信息，组合返回
            let carts = result[0].carts;
            let goodsId = [];
            carts.forEach((item) => {
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
                    for (let cartsItem of carts) {
                        if (goodsItem.productId === cartsItem.goodsId) {
                            cartsItem.goodsMsg = goodsItem
                        }
                    }
                }
                res.json({
                    code: 1000,
                    message: '查询成功',
                    result: carts
                })
            })
        }
    })
});

function deleteCartGoods(userId, goodsId, cb = function () {
}) {
    mongodbServer.updateOneData('carts', {
        userId
    }, {
        $pull: {
            carts: {
                goodsId
            }
        }
    }, function (result) {
        cb(result)
    })
}

// 删除购物车商品
router.post('/delete', function (req, res, next) {
    let {
        goodsId,
        userId
    } = req.body;
    deleteCartGoods(userId, goodsId, function (result) {
        if (result.modifiedCount === 1) {
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
        number,
        type
    } = req.body;
    let parameter = {
        $inc: {
            "carts.$.number": number
        }
    };
    if (type === 'edit') {
        parameter = {
            $set: {
                "carts.$.number": number
            }
        }
    }
    mongodbServer.updateOneData('carts', {
        userId,
        'carts.goodsId': goodsId
    }, parameter, function (result) {
        if (result.modifiedCount === 1) {
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

function deleteCheckoutGoods(userId, goods) {
    goods.forEach((val) => {
        deleteCartGoods(userId, val.goodsId)
    })
}

// 结算
router.post('/checkOut', function (req, res, next) {
    let {
        userId,
        goods
    } = req.body;
    goods.forEach((val) => {
        val.status = 0
    });
    let ordersId = util.createId();
    mongodbServer.selectData({
        collectionName: 'orders',
        findWhat: {
            userId
        }
    }, function (result) {
        if (result.length) {
            mongodbServer.updateOneData('orders', {
                userId
            }, {
                $push: {
                    orders: {
                        ordersId,
                        goods
                    }
                }
            }, function (result2) {
                if (result2.modifiedCount === 1) {
                    deleteCheckoutGoods(userId, goods);
                    res.json({
                        code: 1000,
                        message: '成功',
                        result: {
                            ordersId
                        }
                    })
                } else {
                    res.json({
                        code: 1011,
                        message: '失败'
                    })
                }
            })
        } else {
            mongodbServer.insertData('orders', [
                {
                    userId,
                    orders: [
                        {
                            ordersId,
                            goods
                        }
                    ]
                }
            ], function (result2) {
                if (result2.insertedCount === 1) {
                    deleteCheckoutGoods(userId, goods);
                    res.json({
                        code: 1000,
                        message: '成功',
                        result: {
                            ordersId
                        }
                    })
                } else {
                    res.json({
                        code: 1011,
                        message: '失败'
                    })
                }
            })
        }
    })
});


module.exports = router;