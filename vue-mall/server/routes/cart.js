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

// 删除购物车商品
router.post('/delete', function (req, res, next) {
    let {
        goodsId,
        userId
    } = req.body;
    mongodbServer.updateOneData('carts', {
        userId
    }, {
        $pull: {
            carts: {
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

// 结算
router.post('/checkOut', function (req, res) {
   let {
       userId,
       goodsId
   } = req.body;
   // todo
});

module.exports = router;