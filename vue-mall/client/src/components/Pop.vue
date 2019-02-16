<template>
  <div class="pop-container" v-show="showPop">
    <div class="shape" @click="handleClose"></div>
    <div class="pop-content" :style="{'width': popWidth}">
      <h1
        :style="[alignCenter ? textAlignCenter : '']"
        class="pop-title"
      >{{popTitle}}</h1>
      <div>
        <slot></slot>
      </div>
      <div v-show="showButtons" :style="[alignCenter ? btnCenter: '']">
        <button
          type="button"
          class="btn"
          v-show="showCancleButton"
          @click="handleClose"
        >取消</button>
        <button
          type="button"
          class="btn sure"
          @click="handleSure"
        >{{sureButtonText}}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pop',
  props: {
    showPop: {
      type: Boolean,
      default: true
    },
    popWidth: {
      type: [String, Number],
      default: '50%'
    },
    popTitle: String,
    alignCenter: {
      type: Boolean,
      default: true
    },
    showButtons: {
      type: Boolean,
      default: true
    },
    showCancleButton: {
      type: Boolean,
      default: true
    },
    sureButtonText: {
      type: String,
      default: '确认'
    }
  },
  data () {
    return {
      btnCenter: {
        display: 'flex',
        justifyContent: 'center'
      },
      textAlignCenter: {
        textAlign: 'center'
      }
    }
  },
  methods: {
    handleClose () {
      this.$emit('close-pop')
    },
    handleSure () {
      this.$emit('sure-pop')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/style/validate';
.pop-container{
  position: fixed;
  z-index: 99;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  min-width: $MAX-WIDTH;
  .shape{
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba($color: #000000, $alpha: 0.4);
  }
  .pop-content{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
    padding: 10px 30px 30px;
    background: #fff;
    .btn{
      width: 100px;
      height: 30px;
      margin: 40px 0 0;
      background: none;
      border: 1px solid #999;
      outline: none;
      &:hover{
        cursor: pointer;
      }
      &.sure{
        margin-left: 40px;
        border: none;
        background: $DANGER-COLOR;
        color: #fff;
      }
    }
    .pop-title{
      padding: 10px 0 30px;
      font-size: 16px;
    }
  }
}
</style>
