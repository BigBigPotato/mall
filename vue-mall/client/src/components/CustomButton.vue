<template>
  <button
    type="button"
    :style="customStyle"
    class="button"
    :class="[hasActive ? 'active' : '']"
    @click="handleClick"
  >{{text}}</button>
</template>

<script>
export default {
  name: 'CustomButton',
  props: {
    text: String,
    customStyle: Object,
    hasActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick () {
      this.$emit('handle-click')
    }
  }
}
</script>

<style scoped lang="scss">
  @import "../assets/style/validate";
  .button{
    width: 190px;
    padding: 10px 0;
    border: 1px solid $DANGER-COLOR;
    font-size: 16px;
    background: none;
    color: $DANGER-COLOR;
    text-align: center;
    transition: background 0.25s;
    &:hover{
      cursor: pointer;
    }
    &.active{
      background: $DANGER-COLOR;
      color: #fff;
      border: none;
      &:hover{
        background: #f16f75;
        cursor: pointer;
      }
    }
  }
</style>
