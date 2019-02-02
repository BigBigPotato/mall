<template>
  <div class="address-container">
    <step :activeStep="0"/>
    <section class="address-box">
      <h1 class="box-title">Shiping Address</h1>
      <ul>
        <li class="box-item">
          <i class="delete-address">X</i>
          <p class="receiver">name</p>
          <p class="receive-address">address</p>
          <p>编码</p>
          <p class="default-tag">Default Address</p>
        </li>
      </ul>
    </section>
    <section class="address-box">
      <h1 class="box-title">Shiping Method</h1>
      <ul>
        <li></li>
      </ul>
    </section>
  </div>
</template>

<script>
import Step from '@/components/Step'

export default {
  name: 'Address',
  components: {
    Step
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/style/validate';
.address-container{
  width: $MAX-WIDTH;
  margin: 0 auto;
  .address-box{
    .box-title{
      padding: 20px 0;
      font-size: 14px;
    }
    .box-item{
      position: relative;
      display: inline-block;
      width: 20%;
      padding: 8px 12px;
      border: 2px solid #e5e5e5;
      font-size: 12px;
      .delete-address{
        position: absolute;
        top: 10px;
        right: 10px;
        &:hover{
          cursor: pointer;
          color: $INFO-COLOR;
        }
      }
      .receiver{
        font-size: 14px;
        color: #333
      }
      .receive-address{
        margin: 10px 0 30px;
      }
      .default-tag{
        margin: 10px 0 0;
        color: $INFO-COLOR;
      }
    }
  }
}
</style>
