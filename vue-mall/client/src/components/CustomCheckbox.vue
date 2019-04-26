<template>
  <div class="checked-container">
    <!--no check-->
    <i class="circle" v-show="!checked" @click="handleCheck"></i>
    <!--checked-->
    <div class="checked-circle" v-show="checked" @click="handleCancel">
      <i class="white-dot"></i>
    </div>
    <!--显示提示-->
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'CustomCheckbox',
  props: {
    checked: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    handleCheck () {
      this.$emit('handle-check')
    },
    handleCancel () {
      this.$emit('handle-cancel')
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/style/validate.scss";
.checked-container{
  display: flex;
  align-items: center;
  .circle{
    @include circle()
  }
  .checked-circle{
    @include checked-circle()
  }
}
</style>
