<template>
  <div class="confirm-order">
    <step :activeStep="1"/>
    <section>
      <h1 class="order-title">Order Content</h1>
      <table class="buy-goods">
        <tr>
          <th>Order Contents</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Subtotal</th>
        </tr>
        <tr>
          <td>
            <img src="" alt="" class="goods-img">
            <span>name</span>
          </td>
          <td>$266</td>
          <td>x 8</td>
          <td>$266</td>
        </tr>
      </table>
    </section>
    <p class="price">
      <span>Item subtotal:</span>
      <i>$2499</i>
    </p>
    <p class="price">
      <span>Shipping:</span>
      <i>$2499</i>
    </p>
    <p class="price">
      <span>Discount:</span>
      <i>$2499</i>
    </p>
    <p class="price">
      <span>Tax:</span>
      <i>$0</i>
    </p>
    <p class="price total-price">
      <span>Order total:</span>
      <i>$2499</i>
    </p>
    <div class="foot-btn">
      <custom-button
        text="Previous"
        :customStyle="buttonStyle"
      ></custom-button>
      <div class="right-btn-container">
        <custom-button
          text="Proceed to payment"
          :customStyle="buttonStyle"
          :hasActive="true"
        ></custom-button>
      </div>
    </div>
  </div>
</template>

<script>
import Step from '@/components/Step'
import CustomButton from '@/components/CustomButton'
import newRequest from '@/assets/js/request'

export default {
  name: 'ConfirmOrder',
  components: {
    Step,
    CustomButton
  },
  data () {
    return {
      buttonStyle: {
        'font-size': '16px',
        'font-weight': 'bold'
      }
    }
  },
  mounted () {
    this.getOrdersInfo()
  },
  methods: {
    getOrdersInfo () {
      newRequest.post('ordersInfo', {
        ordersId: this.$route.query.ordersId
      }).then((res) => {
        // todo
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/style/validate';
.confirm-order{
  width: $MAX-WIDTH;
  margin: 0 auto;
  .order-title{
    padding: 40px 0 20px;
    font-size: 16px;
  }
  .buy-goods{
    width: 100%;
    border-spacing: 0;
    border: 1px solid #e5e5e5;
    tr{
      border-bottom: 1px solid #e5e5e5;
      &:last-child{
        border: none;
      }
    }
    th,
    td{
      text-align: center;
      &:nth-child(1){
        width: 55%;
      }
      &:nth-child(2){
        width: 15%;
      }
      &:nth-child(3){
        width: 15%;
      }
      &:nth-child(4){
        width: 15%;
      }
    }
    td:nth-child(1){
      display: flex;
      align-items: center;
      padding: 10px 30px;
    }
    td:nth-child(4){
      color: $DANGER-COLOR;
    }
    th{
      padding: 10px 0;
      background: #605F5F;
      color: #ffffff;
      font-weight: normal;
    }
    .goods-img{
      width: 100px;
      height: 100px;
    }
    .goods-num-btn,
    .goods-num{
      height: 30px;
      border: 1px solid #f0f0f0;
    }
    .goods-num-btn{
      width: 40px;
      background: #f0f0f0;
      cursor: pointer;
    }
    .goods-num{
      width: 60px;
      text-align: center;
      border-left: none;
      border-right: none;
    }
  }
  .price{
    padding: 8px 0;
    text-align: right;
    &.total-price{
      i{
        color: $DANGER-COLOR;
        font-size: 16px;
        font-weight: bold;
      }
    }
    i{
      display: inline-block;
      width: 150px;
    }
  }
  .foot-btn{
    display: flex;
    margin: 60px 0 0;
    .right-btn-container{
      flex: 1;
      text-align: right;
    }
  }
}
</style>
