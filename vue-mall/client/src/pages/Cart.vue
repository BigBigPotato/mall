<template>
  <section class="cart-content">
    <h1 class="container-title">My Cart</h1>
    <table class="cart-table">
      <tr>
        <th></th>
        <th>Items</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Subtotal</th>
        <th>Edit</th>
      </tr>
      <tr>
        <td class="no-msg" colspan="6" v-if="!cartList.length">暂无数据</td>
      </tr>
      <tr v-for="(item, index) of cartList" :key="item.goodsId">
        <td>
          <!--no check-->
          <i class="circle" v-show="!item.checked" @click="toToggleCheck(index)"></i>
          <!--checked-->
          <div class="checked-circle" v-show="item.checked" @click="toToggleCheck(index)">
            <i class="white-dot"></i>
          </div>
        </td>
        <td>
          <img :src="item.goodsMsg.productImage | imgPrefix" class="goods-img">
          <span>{{item.goodsMsg.productName}}</span>
        </td>
        <td>${{item.goodsMsg.salePrice}}</td>
        <td>
          <div class="goods-num-container">
            <button
              type="button"
              class="edit-num"
              :disabled="item.number === 1"
              @click="handleMinusNum(item.goodsId, index)"
            >-</button>
            <input type="text" :value="item.number" class="goods-num" @input="handleEditNum(item.goodsId, index, $event)">
            <button type="button" class="edit-num" @click="handlePlusNum(item.goodsId, index)">+</button>
          </div>
        </td>
        <td class="total-price">${{item.goodsMsg.salePrice * item.number}}</td>
        <td><i class="icon-bin" @click="toDeleteGoods(item.goodsId, index)"></i></td>
      </tr>
    </table>
    <div class="price-check-all" v-if="cartList.length">
      <div class="left-check">
        <!--no check-->
        <i class="circle checkbox" v-show="!hasCheckAllGoods" @click="toToggleAllCheck(true)"></i>
        <!--checked-->
        <div class="checked-circle checkbox" v-show="hasCheckAllGoods" @click="toToggleAllCheck(false)">
          <i class="white-dot"></i>
        </div>
        <label>Check all</label>
      </div>
      <div class="right-price">
        <p>Total price：<i>${{totalPrice}}</i></p>
        <button type="button" class="checkout-btn" @click="toCheckOut">CHECKOUT</button>
      </div>
    </div>
  </section>
</template>

<script>
import newRequest from '@/assets/js/request'
import { mapState } from 'vuex'

export default {
  name: 'Cart',
  data () {
    return {
      cartList: [],
      page: 1,
      checkedGoods: [],
      editGoodsNumTimer: null // 上一次修改number的计时器
    }
  },
  computed: {
    ...mapState([
      'pageSize'
    ]),
    totalPrice () {
      let price = 0
      this.cartList.forEach((item) => {
        if (item.checked) {
          price += Number(item.goodsMsg.salePrice) * Number(item.number)
        }
      })
      return price
    },
    hasCheckAllGoods () {
      return this.cartList.every((item) => {
        return item.checked
      })
    }
  },
  mounted () {
    this.getCartList()
  },
  methods: {
    getCartList () {
      let page = this.page
      let limit = this.pageSize
      newRequest.post('cartList', {
        page,
        limit
      }).then((res) => {
        if (res.data.code === 1000) {
          let rs = res.data.result
          rs.forEach((item) => {
            item.checked = false
          })
          this.cartList = rs
        }
      })
    },
    handleMinusNum (goodsId, index) {
      this.toEditNum(goodsId, -1, 'minus', index)
    },
    handlePlusNum (goodsId, index) {
      this.toEditNum(goodsId, 1, 'plus', index)
    },
    handleEditNum (goodsId, index, e) {
      this.editNumTimer(goodsId, index, e)
    },
    editNumTimer (goodsId, index, e) {
      let editGoodsNumTimer = this.editGoodsNumTimer
      if (editGoodsNumTimer) clearTimeout(editGoodsNumTimer)
      this.editGoodsNumTimer = setTimeout(() => {
        this.toEditNum(goodsId, Number(e.target.value), 'edit', index)
      }, 500)
    },
    toEditNum (goodsId, number, type, index) {
      newRequest.post('editCartGoodsNum', {
        type,
        number,
        goodsId
      }).then((res) => {
        if (res.data.code === 1000) {
          let activeGoodsNum = this.cartList[index].number
          if (type === 'edit') {
            this.cartList[index].number = number
          } else {
            this.cartList[index].number = activeGoodsNum + number
          }
          this.$message({
            type: 'success',
            infoText: '修改成功'
          })
        }
      })
    },
    toDeleteGoods (goodsId, index) {
      newRequest.post('deleteCartGoods', {
        goodsId
      }).then((res) => {
        if (res.data.code === 1000) {
          this.$message({
            infoText: '删除成功'
          })
          this.cartList.splice(index, 1)
        }
      })
    },
    toToggleCheck (index) {
      let hasChecked = this.cartList[index].checked
      this.cartList[index].checked = !hasChecked
    },
    toToggleAllCheck (flag) {
      this.cartList.forEach((item) => {
        item.checked = flag
      })
    },
    toCheckOut () {
      let goodsId = []
      this.cartList.forEach((item) => {
        item.checked ? goodsId.push(item.goodsId) : ''
      })
      newRequest.post('checkOutGoods', {
        goodsId
      }).then((res) => {
        // todo
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/style/validate';
@import '../assets/style/iconStyle.css';
.cart-content{
  width: $MAX-WIDTH;
  margin: 40px auto;
  .container-title{
    font-size: 16px;
  }
  .circle{
    @include circle()
  }
  .checked-circle{
    @include checked-circle()
  }
  .cart-table{
    width: 100%;
    margin: 30px 0 0;
    border-spacing: 0;
    border: 1px solid #e5e5e5;
    td,
    th{
      padding: 10px 0;
      text-align: center;
      &:nth-child(1){
        width: 4%;
      }
      &:nth-child(2){
        width: 40%;
      }
      &:nth-child(3){
        width: 10%;
      }
      &:nth-child(4){
        width: 20%;
      }
      &:nth-child(5){
        width: 20%;
      }
      &:nth-child(6){
        width: 6%;
      }
    }
    th{
      background: #605F5F;
      color: #fff;
      font-weight: normal;
    }
    td:nth-child(2){
      display: flex;
      align-items: center;
      width: 100%;
      padding: 10px 20px;
      text-align: left;
    }
    .goods-img{
      width: 100px;
      height: 100px;
      margin: 0 10px 0 0;
    }
    .goods-num-container{
      display: flex;
      align-items: center;
      justify-content: center;
      .edit-num,
      .goods-num{
        display: inline-block;
        height: 30px;
      }
      .edit-num{
        width: 40px;
        border: none;
        outline: none;
        font-size: 16px;
        background: #f0f0f0;
        &:hover{
          cursor: pointer;
        }
      }
      .goods-num{
        width: 50px;
        border: 1px solid #f0f0f0;
        outline: none;
        text-align: center;
      }
    }
    .total-price{
      color: $DANGER-COLOR;
    }
  }
  .price-check-all{
    display: flex;
    align-items: center;
    margin: 30px 0;
    border: 1px solid #e5e5e5;
    box-shadow: 0 0 14px #f0f0f0;
    .left-check,
    .right-price{
      display: flex;
      align-items: center;
    }
    .checkbox{
      margin: 0 20px;
    }
    .right-price{
      flex: 1;
      justify-content: flex-end;
      i{
        font-style: normal;
        font-size: 16px;
        color: $DANGER-COLOR;
        font-weight: bold;
      }
      .checkout-btn{
        height: 55px;
        padding: 0 28px;
        margin: 0 0 0 20px;
        font-weight: bold;
        border: none;
        color: #fff;
        background: $DANGER-COLOR;
      }
    }
  }
}
</style>
