<template>
  <div class="top-nav clearfix">
    <div class="pull-left">
      <router-link tag="span" to="/">Home</router-link>
      <span>/</span>
      <slot></slot>
    </div>
    <div class="pull-right">
      <span>sortBy：</span>
      <span class="active">default</span>
      <span>price<i class="icon-arrow-down"></i></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/style/validate';
@import '../assets/style/iconStyle.css';
.top-nav{
  width: $MAX-WIDTH;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0px 5px 15px #eee;
  span{
    margin: 0 6px;
  }
}
</style>
