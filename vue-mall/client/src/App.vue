<template>
  <div class="container">
    <common-header/>
    <div class="content-container">
      <transition name="fade">
        <router-view/>
      </transition>
    </div>
    <common-footer />
  </div>
</template>

<script>
import CommonHeader from '@/components/CommonHeader'
import CommonFooter from '@/components/CommonFooter'

export default {
  name: 'App',
  components: {
    CommonHeader,
    CommonFooter
  }
}
</script>

<style lang="scss" scoped>
@import './assets/style/validate';
.fade-enter,
.fade-leave-to{
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active{
  transition: opacity 0.5s;
}
.container{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .content-container{
    flex: 1;
  }
}
</style>
