<template>
  <div class="header-container">
    <div class="header-wrapper">
      <img src="../assets/images/smile.png" class="left-icon"/>
      <div class="right-content">
        <span>login</span>
        <span>name</span>
        <span>logout</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommonHeader'
}
</script>

<style lang="scss" scoped>
@import '../assets/style/validate';
.header-container{
  background: $MAIN-COLOR;
  .header-wrapper{
    display: flex;
    align-items: center;
    width: $MAX-WIDTH;
    margin: 0 auto;
    padding: 10px 0;
    background: inherit;
    .left-icon{
      width: 50px;
    }
    .right-content{
      flex: 1;
      text-align: right;
      font-size: 16px;
      span{
        margin: 0 10px;
        color: #fff;
      }
    }
  }
}
</style>
