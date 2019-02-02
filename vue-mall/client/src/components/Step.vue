<template>
  <ul class="step-list">
    <li
      class="step-item"
      v-for="(item, index) of stepName"
      :key="index"
      :class="[activeStep >= index ? 'active' : '']"
    >
      <h1 class="step-title">{{item}}</h1>
      <div class="vertical-line">
        <i class="circle"></i>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Step',
  props: {
    activeStep: Number
  },
  data () {
    return {
      stepName: ['Confirm Your Address', 'View Your Order', 'Make Payment', 'Order Confirmation']
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/style/validate';
.step-list{
  display: flex;
  font-size: 0;
  .step-item{
    flex: 1;
    color: #999;
    text-align: center;
    &.active{
      color: $DANGER-COLOR;
      .step-title{
        color: inherit;
      }
      .vertical-line{
        background: $DANGER-COLOR;
        .circle{
          background: $DANGER-COLOR;
        }
      }
    }
    .step-title{
      color: inherit;
      font-size: 14px;
      line-height: 4;
    }
    .vertical-line{
      position: relative;
      height: 2px;
      background: #999;
      .circle{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #999;
      }
    }
  }
}
</style>
