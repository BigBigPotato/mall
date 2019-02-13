<template>
  <div class="order-success">
    <step :activeStep="3"/>
    <div class="success-content">
      <p>Congratulations!</p>
      <p>Your order is under processing!</p>
      <p>Order total：$1000</p>
      <div class="clearfix foot-btn">
        <button type="button" class="pull-left">CART LIST</button>
        <button type="button" class="pull-right active">GOODS LIST</button>
      </div>
    </div>
  </div>
</template>

<script>
import Step from '@/components/Step'

export default {
  name: 'OrderSuccess',
  components: {
    Step
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/style/validate';
.order-success{
  width: $MAX-WIDTH;
  margin: 0 auto;
  .success-content{
    width: 340px;
    margin: 100px auto 0;
    text-align: center;
    p{
      padding: 8px 0;
      font-size: 20px;
      font-weight: 100;
    }
    .foot-btn{
      margin: 40px 0 0;
      button{
        width: 120px;
        height: 42px;
        background: none;
        border: 1px solid $DANGER-COLOR;
        font-size: 14px;
        font-weight: bold;
        color: $DANGER-COLOR;
        &:hover{
          cursor: pointer;
        }
        &.active{
          background: $DANGER-COLOR;
          color: #fff;
          transition: background 0.25s;
          &:hover{
            background: #f16f75;
          }
        }
      }
    }
  }
}
</style>
