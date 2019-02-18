<template>
  <div class="loading-container" v-show="showLoading">
    <div class="shape"></div>
    <transition>
      <div class="loading-content" :class="[showIconName]" v-show="showLoadingContent">
        <div class="icon-container" v-show="showIcon">
          <template v-for="(item, index) of iconArr">
            <i
              :key="index"
              :class="[item.className, item.name === 'loading' ? 'loading-icon' : '']"
              v-show="item.name === showIconName"
            ></i>
          </template>
        </div>
        <span>{{infoText}}</span>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      showLoading: false,
      showLoadingContent: false,
      showIcon: true,
      showIconName: 'success',
      infoText: 'loading',
      iconArr: [
        {
          name: 'loading',
          className: 'icon-spinner9'
        },
        {
          name: 'info',
          className: 'icon-info'
        },
        {
          name: 'success',
          className: 'icon-checkmark'
        },
        {
          name: 'warning',
          className: 'icon-warning'
        },
        {
          name: 'error',
          className: 'icon-cancel-circle'
        }
      ]
    }
  }
}
</script>

<style lang="scss">
@import url('../../assets/style/iconStyle.css');

.v-enter,
.v-leave-to{
  top: -50px !important;// ps：动画不生效，可能是css优先级的原因！！！！
}
.v-enter-active,
.v-leave-active{
  transition: top 0.4s ease-in-out;
}
.loading-container{
  position: fixed;
  z-index: 100;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  .shape{
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .loading-content{
    display: flex;
    align-items: center;
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    padding: 8px 24px;
    font-size: 14px;
    border-radius: 4px;
    background: #fff;
    box-shadow: 1px 1px 18px #e5e5e5;
    &.info,
    &.loading{
      color: #333;
    }
    &.success{
      color: rgb(60, 241, 60);
    }
    &.warning{
      color: #ee7a23;
    }
    &.error{
      color: #d1434a;
    }
    .icon-container{
      margin: 0 10px 0 0;
      .loading-icon{
        display: inline-block;
        animation: roateIcon 1s linear infinite;
      }
      @keyframes roateIcon {
        from {
          transform: rotate(0)
        }
        to {
          transform: rotate(360deg)
        }
      }
    }
  }
}
</style>
